/**
 * Created by Simon on 2017/6/27 0027.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Upload, message, Icon, Modal, Button, Input } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './index.less';

// function getBase64 (img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }

// function beforeUpload(file) {
//   const isJPG = file.type.indexOf('image') === 0;
//   if (!isJPG) {
//     message.error('You can only upload JPG file!');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('image must smaller than 2MB!');
//   }
//   return isJPG && isLt2M;
// }
// if (info.file.status === 'done') {
//   const responseData = info.file.response[0][0];
//   this.props.onChange && this.props.onChange(
//     `/api/upload/${responseData.fieldname}/${responseData.filename}`
//   )
// }
class Uploader extends React.Component {
  constructor(props) {
    super(props);
    let value;
    if (props.value) {
      value = typeof props.value === 'string' ? [props.value] : props.value;
    } else {
      value = null;
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: value
        ? _.map(value, (url, index) => ({
          uid: index,
          name: url,
          status: 'done',
          url,
        }))
        : [],
    };
  }
  beforeUpload = (file) => {
    const { maxSize } = this.props;
    let isOverSized = false;

    if (maxSize) {
      isOverSized = file.size / 1024 > 2;

      message.error(`文件大小超过${maxSize}kb！请重新选择~`);

      return false;
    }

    return true;
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ file, fileList }) => {
    const triggerOnChange = () => {
      const value = _.map(fileList, 'url');
      if (this.props.onChange) {
        this.props.onChange(this.props.multiple ? value : (value[0] || null));
      }
    };
    if (file.status === 'done') {
      const { url } = file.response;
      _.chain(fileList)
        .last()
        .set('url', url)
        .value();
      triggerOnChange();
    }
    if (file.status === 'removed') {
      triggerOnChange();
    }
    this.setState({ fileList });
  }
  handleUpload = (payload) => {
    const {
      file,
      filename: path,
      onProgress,
      onSuccess,
      onError,
    } = payload;
    const { uploadType, submitType, responseValueKey = 'url', handleCacheValue } = this.props;
    if (submitType === 'FormData') {

        setTimeout(() => {
          handleCacheValue && handleCacheValue(this.state.fileList[0]);

          this.setState({
            fileList: [{ ...this.state.fileList[0], status: 'done' }],
          });
        }, 100, file)

      return {
        abort() { console.log('abort'); }
      };
    }

    return window.platform.services.services.platform.oss.upload({ path, file, onProgress, type: uploadType })
      .then((data) => {
        onSuccess({ ...data, url: data[responseValueKey] });
        return data[responseValueKey];
      }).catch((err) => {
        onError(err);
      });
  }

  renderUploadButton = () => {
    const { fileList } = this.state;
    let { maxlength, multiple } = this.props;
    maxlength = multiple ? maxlength : 1;

    if (maxlength && fileList.length >= maxlength) {
      return null;
    }

    return (
      <span>
        <Icon type="upload" /> 点击上传
      </span>
    );
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { category = 'file', maxlength = 100, uploadType, accept = 'image/*', className, ...props } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div className={classnames('clearfix', className)}>
        <Upload
          name={category}
          showUploadList
          action="/api/upload"
          headers={{ Authorization: window.jwt }}
          accept={accept}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          customRequest={this.handleUpload}
        >
        {this.renderUploadButton()}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="图片" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

Uploader.defaultProps = {
  onChange: null,
  multiple: true,
  maxlength: 5,
};

Uploader.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  category: PropTypes.string.isRequired,
  maxlength: PropTypes.number,
};

export default Uploader;
