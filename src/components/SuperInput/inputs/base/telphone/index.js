import TextInput from '../text';

const Telphone = TextInput.getTypeof('string', [{
  type: 'string',
}, {
  pattern: /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/,
  message: '手机号不正确',
},
]);

Telphone.info = {
  name: '手机号码',
  category: '文本',
};

Telphone.structure = {
  type: 'string',
};

export default Telphone;
