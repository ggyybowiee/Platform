import TextInput from '../text';

const Password = TextInput.getTypeof('password', [{ type: 'string' }]);

Password.properties = {
  rules: {
    showName: '验证规则',
    type: 'optionArray',
  },
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
};

Password.info = {
  name: '密码',
  category: '文本',
};

Password.structure = {
  type: 'string',
};

export default Password;
