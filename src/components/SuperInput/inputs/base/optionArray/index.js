import React from 'react';
import { Tag, Button, InputNumber as Number, Tooltip, Input, Popover, Select } from 'antd';
import SuperInput from '../../../index.js';
import styles from './index.less';

import  Boolean from '../boolean';
import  String from '../string';
import  RegExp from '../regExp';

const { Option, OptGroup } = Select;

class OptionInput extends React.Component {
  state = {
    fields: [{
      field: 'label',
      type: 'string',
    }, {
      field: 'value',
      type: 'string',
    }],
    inputVisible: false,
    activeField: null,
    option: {},
  }

  componentDidMount() {
    if (this.props.fields) {
      this.setState({
        fields: this.props.fields,
      });
    }
  }

  handleRemove = index => {
    const { onChange, value: options } = this.props;

    onChange(options.filter((item, optionIndex) => index !== optionIndex));
  }

  handleRemoveField = (index) => {
    this.setState({
      fields: this.state.fields.filter((item, idx) => idx !== index),
    });

    setTimeout(() => {
      this.setState({
        inputVisible: false,
        activeField: null,
        tagInputValue: '',
      });
    });
  }

  hanldeFieldChange = (e) => {
    this.setState({
      tagInputValue: e.target.value,
    });
  }

  handleAddField = (e) => {
    this.setState({
      inputVisible: true,
    }, () => this.tagInput.focus());
  }

  handleSaveField = () => {

    const { tagInputValue, activeField } = this.state;
    let fields = this.state.fields.slice();

    if (activeField === null && tagInputValue && fields.filter(({ field }) => field === tagInputValue).length === 0) {
      fields = [...fields, { type: 'string', field: tagInputValue }];
    }

    if (activeField !== null) {
      fields[activeField].field = tagInputValue;
    }

    this.setState({
      fields,
      inputVisible: false,
      tagInputValue: '',
      activeField: null,
    });
  }

  saveInputRef = input => {
    this.tagInput = input;
  }

  handleFieldClick = (index) => {
    const { inputVisible, activeField } = this.state;
    this.setState({
      inputVisible: index !== activeField ? true : !inputVisible,
      activeField: index === activeField ? null : index,
      tagInputValue: this.state.fields[index].field,
    });
  }

  handleChangeFieldType = (index, value) => {
    let { fields } = this.state;

    fields = fields.slice();
    fields[index].type = value;

    this.setState({
      fields,
    });
  }

  handleAdd = () => {
    const { value: options, onChange } = this.props;
    const opts = options || [];
    const { option } = this.state;
    const newOptions = [...opts, {
      ...option,
    }];

    if (onChange) {
      onChange(newOptions);
    }

    this.setState({
      option: {},
    });
  }

  handleChange = (value, key) => {
    const { option } = this.state;

    this.setState({
      option: {
        ...option,
        [key]: value,
      },
    });
  }

  render() {
    const { value: options, fields: specificFields } = this.props;
    const { fields, tagInputValue, inputVisible, activeField } = this.state;
    const fieldTypeMap = SuperInput.CompMap;

    const getColumnTypes = (fieldIndex, type) => (
      <div>
        <Select style={{ width: 200 }} defaultValue={type} onChange={(value) => this.handleChangeFieldType(fieldIndex, value)}>
          {
            _.chain(SuperInput.CompMap)
            .map((item, type) => ({
              category: item.info ? item.info.category : '其他',
              name: item.info ? item.info.name : type,
              type,
            }))
            .groupBy('category')
            .map((group, category) => (
              <OptGroup label={category}>
                {
                  _.map(group, ({ name, type }) => (
                    <Option value={type}>{name}</Option>
                  ))
                }
              </OptGroup>
            ))
            .value()
          }
        </Select>
      </div>
    );


    const finalFields = specificFields || fields;

    const fieldsWrap = (
      <div className={styles.fields}>
        {
          finalFields.map(({ field, type }, index) => (
            <Popover title="列类型" content={getColumnTypes(index, type)}>
              <Tag
                onClick={() => !specificFields && this.handleFieldClick(index)}
                closable
                onClose={() => !specificFields && this.handleRemoveField(index)}
                color={index === activeField ? '#108ee9' : '#999'}
              >
                {field}
              </Tag>
            </Popover>
          ))
        }
        {inputVisible && !specificFields && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={tagInputValue}
            onChange={this.hanldeFieldChange}
            onBlur={this.handleSaveField}
            onPressEnter={this.handleSaveField}
          />
        )}
        {!inputVisible && !specificFields && <Button size="small" type="dashed" onClick={this.handleAddField}>+ 添加</Button>}
      </div>
    );

    const tags = (options || []).map((item, index) => (
      <Tooltip key={`tag-${index}`}>
        <Tag closable onClose={() => this.handleRemove(index)}>
          {JSON.stringify(item)}
        </Tag>
      </Tooltip>
    ));

    const inputs = (
      <div className={styles.inputs}>
        {
          finalFields.map(({ field, type, ...props }, index) => console.log(props) || (
            <div className={styles.inputItem}>
              <Tooltip title={field}>
                <span>
                  <SuperInput
                    {...props}
                    type={type}
                    value={this.state.option[field]}
                    onChange={value => this.handleChange(value.nativeEvent ? value.target.value : value, field)}
                  />
                </span>
              </Tooltip>
            </div>
          ))
        }
      </div>
    );

    return (
      <div className={styles.wrap}>
        {fieldsWrap}
        <div className={styles.tags}>
          {tags}
        </div>
        {inputs}
        <Button icon="plus" onClick={this.handleAdd}>添加</Button>
      </div>
    );
  }
}

OptionInput.validatorRules = [{
  type: 'objectArray',
}]

OptionInput.info = {
  name: '键值对',
  category: '集合',
};

OptionInput.properties = {
  options: {
    type: 'optionArray',
    showName: '选项',
    required: true,
  },
};

OptionInput.structure = {
  type: 'objectArray',
};

export default OptionInput;
