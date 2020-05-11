import { postApi } from 'utils/request';
import * as filesize from 'utils/filesize';

const HUGE_SIZE_BYTES = filesize.parse('30m');

export default {
  upload(options) {
    const { file } = options;
    return (file.size >= HUGE_SIZE_BYTES ? this.hugeFileUpload(options) : this.simpleUpload(options))
      .then(data => ({
        ...data,
        url: data.seqId,
      }));
  },

  simpleUpload({ path, file, onProgress, type, extraParams = {} }) {
    const config = require('../config/oss').default;
    const formData = new FormData();
    formData.append(config.get('typeField'), type);
    formData.append(config.get('fileField'), file);
    _.forEach(extraParams, (value, key) => {
      formData.append(key, value);
    });
    const urlOrGetUrl = config.get('url');
    const url = typeof urlOrGetUrl === 'function' ? urlOrGetUrl(type, extraParams) : urlOrGetUrl;
    return postApi(url, formData);
  },

  // 上传大文件
  async hugeFileUpload({ path, file, onProgress, type, extraParams = {} }) {
    const uploadId = await postApi('/sys/hugeFileUpload');
    return this.simpleUpload({ path, file, onProgress, type, extraParams: { ...extraParams, uploadId } });
  }
}
