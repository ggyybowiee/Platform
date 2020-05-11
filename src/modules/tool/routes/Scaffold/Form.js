const {
  vendor: {
    react: React,
    antd: { Table, Form, Button },
  },
  components: {
    SuperInput,
  },
} = platform;

@Form.create({})
export default class Scaffold extends React.Component {

  handleSubmit = (evt) => {
    evt.preventDefault();
    const { name, onSubmit, form: { validateFields } } = this.props;
    validateFields((error, values) => {
      if (!_.isEmpty(error) || !onSubmit) {
        return;
      }
      onSubmit(name, values);
    });
  }

  renderFooter = () => (
    <div style={{ textAlign: 'center' }}>
      <Button htmlType="submit" type="primary">创建</Button>
    </div>
  )

  render() {
    const { params, form: { getFieldProps } } = this.props;
    const columns = [
      { title: '属性名', dataIndex: 'field.name', key: 'field.name' },
      { title: '属性标题', dataIndex: 'field.label', key: 'field.label' },
      { title: '属性值', dataIndex: 'input', key: 'input', render(inputConfig, record) {
        return <SuperInput {...(inputConfig || {})} {...getFieldProps(record.field.name, record.field)} />
      } },
    ];

    return (
      <Form onSubmit={this.handleSubmit}>
        <Table
          columns={columns}
          dataSource={params}
          footer={this.renderFooter}
          pagination={false}
        />
      </Form>
    );
  }
}
