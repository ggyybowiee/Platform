import React, { PureComponent } from 'react';
import { Card, Popover, Badge, Tag, Button } from 'antd';
import _ from 'lodash';
import ExModal from 'components/ExModal';
import styles from './index.less';

const {
  components: {
    SuperLayout,
    SuperInput,
    SuperAction,
  },
} = platform;

const handleLayoutChange = (values, onChange) => {
  onChange({
    ...values,
  });
};

const setFormItemLayout = (formItemLayout, onChange) => {
  let value = formItemLayout;
  const handleChange = newValue => {
    value = newValue;
  };
  const handleSubmit = () => {
    onChange({
      formItemLayout: value,
    });
    modal.destroy();
  }
  const modal = ExModal.open({
    title: '表单项布局配置',
    content: (
      <div>
        <SuperInput type="formItemGridLayout" value={value} onChange={handleChange} />
        <Button onClick={handleSubmit} type="primary">提交</Button>
      </div>
    ),
    footer: false,
    width: '70%',
  });
};

const handleImport = onImport => {
  let value = '';
  const onChange = (newValue) => {
    value = newValue;
  };
  ExModal.open({
    title: '导入表单配置',
    content: () => (<SuperInput type="json" value={value} onChange={onChange} />),
    onOk: () => {
      if (value) {
        try {
          onImport(JSON.parse(value));
        } catch (err) {
          return false;
        }
      }
    },
  });
};

export default ({
  elements,
  layout,
  onChange,
  onImport,
  formSetting: { isLabelInline, isShowLabel, isAutoSubmit, formItemLayout },
}) => (
  <div className={styles.formSetting}>
    <div>
      <label for="isShowLabel">是否显示label：</label>
      <SuperInput name="isShowLabel" type="boolean" value={isShowLabel} onChange={isShowLabel => onChange({ isShowLabel })} />
    </div>
    <div>
      <label for="isShowLabel">是否修改后自动提交：</label>
      <SuperInput type="boolean" value={isAutoSubmit} onChange={isAutoSubmit => onChange({ isAutoSubmit })} />
    </div>
    <div>
      <label for="isShowLabel">是否label行内：</label>
      <SuperInput type="boolean" value={isLabelInline} onChange={isLabelInline => onChange({ isLabelInline })} />
    </div>
    <div>
      <Button onClick={() => setFormItemLayout(formItemLayout, onChange)}>布局配置</Button>
    </div>
    <SuperLayout.LayoutSelector
      elements={elements}
      layout={layout.type}
      onChange={value => handleLayoutChange(value, onChange)}
    />
    <SuperAction type="icon" iconType="cloud-download-o" onTrigger={() => handleImport(onImport)} />
  </div>
);
