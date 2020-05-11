import TextInput from '../text';

const Url = TextInput.getTypeof('string', [{ type: 'url' }]);

Url.info = {
  name: 'URL文本',
  category: '文本',
};

Url.structure = {
  type: 'string',
};

export default Url;
