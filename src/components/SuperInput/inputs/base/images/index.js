import curryingUpload from '../../mixins/curryingUpload';

const images = curryingUpload('picture-card', true);

images.info = {
  name: '多图片',
  category: '上传',
};

images.properties = {
  // action: {
  //   showName: '上传URL',
  //   type: 'string',
  //   rules: [{
  //     required: true,
  //     message: '上传的URL为必填项',
  //   }],
  // },
  maxlength: {
    showName: '最大文件个数',
    type: 'integer',
    defaultValue: 1,
  },
  maxlength: {
    showName: '文件大小限制',
    type: 'integer',
    placeholder: '单位：kb',
    defaultValue: 1024,
  },
  accept: {
    showName: '文件类型',
    type: 'string',
    placeholder: '例如：image/*',
  },
};

images.structure = {
  // TODO
  type: 'objectArray',
};

export default images;
