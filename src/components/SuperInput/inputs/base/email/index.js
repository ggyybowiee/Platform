import TextInput from '../text';

const Email = TextInput.getTypeof('email', [{ type: 'email' }]);

Email.info = {
  name: '邮箱',
  category: '文本',
};

Email.structure = {
  type: 'string',
};

export default Email;
