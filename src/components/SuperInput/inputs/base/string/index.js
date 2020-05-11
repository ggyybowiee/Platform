import TextInput from '../text';

const String = TextInput.getTypeof('string', [{ type: 'string' }]);

String.properties = {
  rules: {
    showName: '验证规则',
    type: 'optionArray',
  },
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
};

String.info = {
  name: '普通文本',
  category: '文本',
};

String.structure = {
  type: 'string',
};

export default String;
