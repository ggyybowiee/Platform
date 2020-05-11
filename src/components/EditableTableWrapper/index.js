import React from 'react';
import _ from 'lodash';
import { Popconfirm, Form, Button, message } from 'antd';
import TableLayout from 'layouts/TableLayout';
import SuperInput  from 'components/SuperInput';
import styles from './index.less';

const FormItem = Form.Item;
window.React = React;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      input = {},
      field = {},
      disabled,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          const inputProps = { ...input };

          // TODO: InputNumber min max
          _.forIn(inputProps, (value, key) => {
            if (_.isFunction(value)) {
              inputProps[key] = value(form);
            }
          });
          const currentField = !disabled ? field : {}
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    // rules: [{
                    //   required: true,
                    //   message: `Please Input ${title}!`,
                    // }],
                    initialValue: _.get(record, dataIndex),
                    ...currentField,
                  })(<SuperInput {...inputProps} disabled={disabled} />)}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingKey: '' };
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }

  save(form, record) {
    form.validateFields({ force: true }, (error, row) => {  
      if (error) {
        return;
      }
      const { dispatch, curdHandles } = this.props;
      curdHandles.update(_.assign({}, record, row), row, record);
      this.setState({ editingKey: null });
    });
  }
  cancel = () => {
    this.setState({ editingKey: null });
  };

  getColumns = (columns = this.props.columns) => {
    const { recordKey, } = this.props;
    const { editingKey } = this.state;
    return _.map(columns, col => ({
      ...col,
      children: col.children ? this.getColumns(col.children) : null,
      // editable: editingKey === col[recordKey],
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: col.editable && editingKey === record[recordKey],
        input: col.input,
        field: col.field,
        disabled: typeof col.disabled === 'function' ? col.disabled(record, col.dataIndex) : col.disabled,
      }),
    }));
  }

  render() {
    const { recordKey } = this.props;
    const { editingKey } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.getColumns();
    return (
      <TableLayout
        {...this.props}
        components={components}
        bordered
        columns={columns}
        rowClassName="editable-row"
        isDisabled={editingKey}
        rowOprs={[({ item }) => {
          if (item[recordKey] === editingKey) {
            return (
              <EditableContext.Consumer>
                {form => (
                  <div className={styles.rowSaveCancelContainer}>
                    <Button onClick={() => this.save(form, item)}>保存</Button>
                    <Button onClick={() => this.cancel()}>取消</Button>
                  </div>
                )}
              </EditableContext.Consumer>
            )
          }
          if (!editingKey) {
            return <Button onClick={() => this.edit(item[recordKey])}>编辑</Button>;
          }
          return null;
        }]}
      />
    );
  }
}
