import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { update, set, concat, filter, compose } from 'lodash/fp';
import { Form, Button, Card, Input } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import SuperLayout from 'components/SuperLayout';
import ExModal from 'components/ExModal';
import PropertiesForm from 'components/PropertiesForm';
import SuperInput, { defaultValidateMessages } from 'components/SuperInput';
import JsonForm from 'components/JsonForm';
import ElementPlaceholder from './ElementPlaceholder';
import FormSetting from './FormSetting';

import styles from './index.less';


const TextArea = Input.TextArea;

const FormItem = Form.Item;

@connect(({ loading, global }) => ({
  loading: loading.effects['global/fetch'],
  records: global.records,
}))
export default class FormGenerator extends PureComponent {
  autoIdCode = 'A'.charCodeAt()

  state = {
    elements: [],
    formSetting: {
      isShowLabel: true,
      isAutoSubmit: false,
    },
    layout: {
      type: 'grid',
      detail: [],
    },
  }

  componentDidMount() {
    console.log('fetch form list');
  }

  createNewElement = () => {
    const autoId = String.fromCharCode(this.autoIdCode++);
    return {
      field: {
        label: `字段名${autoId}`,
        name: `field${autoId}`,
      },
      input: {
        type: 'string',
      },
    };
  }

  handleChange = ({ elements, detail }) => {
    this.setState({
      elements, layout: { ...this.state.layout, detail },
    });
  }

  handleEdit = (element) => {
    const onSave = values => {
      this.handleSave(element, values);
      modal.destroy();
    };
    const onCancel = () => {
      modal.destroy();
    };
    const getProperties = (values) => {
      const bindParentField = parentField => property => ({
        ...property,
        field: {
          ...property.field,
          name: `${parentField}.${property.field.name}`,
        },
      });
      return [
        bindParentField('input')(SuperInput.getElementTypeProperty()),
        ..._.map(JsonForm.FormFieldItem.getProperties(), bindParentField('field')),
        ..._.map(SuperInput.getElementProperties(
          _.get(values, 'input.type')
        ), bindParentField('input')),
      ];
    }
    const checkNeedUpdateProperties = (valuesChanged, allValues, ) => {
      return !_.isEmpty(valuesChanged.input && valuesChanged.input.type);
    };

    const modal = ExModal.open({
      title: _.get(element, 'field.label'),
      content: () =>  (
        <PropertiesForm
          properties={getProperties}
          defaultValues={element}
          onSave={onSave}
          onCancel={onCancel}
          checkNeedUpdateProperties={checkNeedUpdateProperties}
        />),
      width: 800,
      footer: false,
    });
  }

  handleSave = (element, values) => {
    const { elements } = this.state;
    const elementIndex = _.findIndex(elements, { id: element.id });
    this.setState({
      elements: set([elementIndex])({ ...element, ...values })(elements),
    });
  }

  handlePreview = () => {
    const { elements, layout, formSetting } = this.state;

    ExModal.open({
      title: '表单预览',
      width: window.innerWidth * 0.7,
      content: () => (
        <JsonForm
          data={{}}
          elements={elements}
          formSetting={formSetting}
          layout={layout}
          onSubmit={() => console.log('提交')}
        />
      ),
    });
  }

  handleToJson = () => {
    const { elements, layout, formSetting } = this.state;

    ExModal.open({
      title: '表单配置JSON',
      content: () => (
        <TextArea rows={20} value={JSON.stringify({ formSetting, elements, layout }, ' ', 4)} />
      ),
    });
  }

  render() {
    const { loading } = this.props;
    const { elements, formSetting, layout } = this.state;

    const formSettingElt = (
      <FormSetting
        formSetting={formSetting}
        elements={elements}
        layout={layout}
        onChange={({ layout: newLayout, ...newFormSetting }) => {
          this.setState({
            formSetting: {
              ...formSetting,
              ...newFormSetting,
            },
            layout: newLayout || layout,
          });
        }}
        onImport={(value) => {
          this.setState({
            ...value,
          });
        }}
      />
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false} title="表单配置" extra={formSettingElt} className={styles.wrap}>
          <SuperLayout
            {...layout}
            mode="design"
            elements={elements}
            ElementPlaceholder={ElementPlaceholder}
            createNewElement={this.createNewElement}
            onChange={this.handleChange}
            onEdit={this.handleEdit}
          />

          <div>
            <Button type="default" onClick={this.handleToJson}>生成JSON</Button>
            &nbsp;
            <Button type="default" onClick={this.handlePreview}>预览</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
