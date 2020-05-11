import _ from 'lodash';
import ValidatorSchema from 'async-validator';
import SuperInput from './SuperInput';
import validateMessages from './validateMessages';

export const getDefaultRulesByType = (type, field) => {
  if (!SuperInput.CompMap[type]) {
    throw new Error(`不支持的输入控件： ${type}`);
  }
  const { validatorRules } = SuperInput.CompMap[type];
  if (!validatorRules) {
    return null;
  }
  return typeof validatorRules === 'function' ? validatorRules(type, field) : validatorRules;
};

export const getStructRules = (struct) => {
  return _.chain(struct)
    .mapKeys('name')
    .mapValues(field => [
      ...((field.fieldOptions && field.fieldOptions.rules) || []),
      ...(getDefaultRulesByType(field.type, field) || []),
    ])
    .value();
};

export const getStructValidator = (struct) => {
  const rules = _.chain(struct)
    .filter('fieldOptions.rules')
    .mapKeys('name')
    .mapValues('fieldOptions.rules')
    .value();
  const validator = new ValidatorSchema(rules);
  validator.messages(validateMessages);

  return validator;
};

export const getStructValidatorRule = (fields) => {
  const valiadtor = getStructValidator(fields);
  return (rule, value, callback) => {
    return valiadtor.validate(value, (errors) => {
      callback(errors ? ['字段错误'] : []);
    });
  };
};

export const fillStructDefaultRules = (struct) => {
  return _.map(struct, (field) => {
    const newField = {
      ...field,
      fieldOptions: {
        ...(field.fieldOptions || {}),
        rules: [
          ...((field.fieldOptions && field.fieldOptions.rules) || []),
          ...(getDefaultRulesByType(field.type, field) || []),
        ],
      },
    };
    if (field.struct) {
      newField.struct = fillStructDefaultRules(field.struct);
    }
    return newField;
  });
};

export const validateField = (field, value) => {
  const validator = new ValidatorSchema({
    [field.name]: field.fieldOptions ? field.fieldOptions.rules : [],
  });
  return new Promise((resolve) => {
    validator.validate({ [field.name]: value }, (errors) => {
      resolve(errors);
    });
  });
};
