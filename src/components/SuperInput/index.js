import { Input } from 'antd';
import _ from 'lodash';
import Schema from 'async-validator';
import SuperInput from './SuperInput';
import validateMessages from './validateMessages';
import baseInputs from './inputs/base';
import composeInputs from './inputs/compose';
import codeInputs from './inputs/code';
import formInputs from './inputs/form';
import others from './inputs/others';
import Uploader from './inputs/mixins/curryingUpload';
// import editorInputs from './inputs/editor';
// import compose from './inputs/compose';
export * from './utils';

SuperInput.baseInputs = baseInputs;
// SuperInput.uploadInputs = {};
// SuperInput.editorInputs = editorInputs;
// SuperInput.compose = compose;

SuperInput.CompMap = {
  ...baseInputs,
  ...composeInputs,
  ...codeInputs,
  ...formInputs,
  ...others,
  // ...uploadInputs,
  // ...editorInputs,
  // ...compose,
};

SuperInput.DefaultComp = Input;

SuperInput.getElementProperties = elementType =>
  _.chain(SuperInput.CompMap)
    .get(elementType)
    .get('properties')
    .map((property, field) => ({
      field: {
        name: field,
        label: property.showName,
      },
      input: property,
    }))
    .concat([{
      field: {
        name: 'disabled',
        label: '是否只读',
        initialValue: false,
      },
      input: {
        type: 'boolean',
      },
    }])
    .value();

SuperInput.getElementTypeProperty = () => ({
  field: {
    label: '控件类型',
    name: 'type',
  },
  input: {
    type: 'enum',
    enumType: 'select',
    optionGroups: _.chain(SuperInput.CompMap)
      .map((item, type) => ({
        category: item.info ? item.info.category : '其他',
        name: item.info ? item.info.name : type,
        type,
      }))
      .groupBy('category')
      .map((group, category) => ({
        title: category,
        options: _.map(group, ({ name, type }) => ({
          label: name,
          value: type,
        })),
      }))
      .value(),
  },
});

export const defaultValidateMessages = validateMessages;

export function register(type, Comp) {
  SuperInput.CompMap[type] = Comp;
}

export default SuperInput;
