import curryingUpload from '../../mixins/curryingUpload';

const image = curryingUpload('picture-card', false);

image.info = {
  name: '单图片',
  category: '上传',
};

image.properties = {
  // action: {
  //   showName: '上传URL',
  //   type: 'string',
  //   rules: [{
  //     required: true,
  //     message: '上传的URL为必填项',
  //   }],
  // },
  submitType: {
    showName: '类型',
    type: 'enum',
    defaultValue: 'Json',
    enumType: 'button',
    options: [{
      label: '随表单提交（FormData）',
      value: 'FormData',
    }, {
      label: '文件单独上传',
      value: 'Json',
    }],
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

image.structure = {
  // TOOD: 对象
  type: 'object',
};

export default image;
