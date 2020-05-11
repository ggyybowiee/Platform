import curryingUpload from '../../mixins/curryingUpload';

const files = curryingUpload('text', true);

files.info = {
  name: '多文件',
  category: '上传',
};

files.properties = {
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

files.structure = {
  // TODO
  type: 'objectArray',
};


export default files;
