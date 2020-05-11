import curryingUpload from '../../mixins/curryingUpload';

const file = curryingUpload('text', false);

file.info = {
  name: '单文件',
  category: '上传',
};

file.properties = {
  // action: {
  //   showName: '上传URL',
  //   type: 'string',
  //   rules: [{
  //     required: true,
  //     message: '上传的URL为必填项',
  //   }],
  // },
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

file.structure = {
  // TODO
  type: 'object',
};

export default file;
