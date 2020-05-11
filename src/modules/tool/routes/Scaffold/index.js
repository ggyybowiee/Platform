import ScaffoldForm from './Form';

const {
  vendor: {
    react: React,
    dva: { connect },
    antd: { Table },
  },
  layouts: {
    PageHeaderLayout,
  },
} = platform;

const columns = [
  { title: '名称', dataIndex: 'title', key: 'title' },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
];

@connect(state => ({ tpls: _.get(state, 'scaffold.tpls') }))
export default class Scaffold extends React.Component {
  expandedRowRender = (tpl) => {
    return (<ScaffoldForm {...tpl} onSubmit={this.handleFormSubmit} />);
  }

  handleFormSubmit = (scaffoldName, scaffoldConfig) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'scaffold/trigger',
      payload: {
        name: scaffoldName,
        config: scaffoldConfig,
      },
    });
  }

  render() {
    const { tpls } = this.props;

    return (
      <PageHeaderLayout title="脚手架">
        <Table
          className="components-table-demo-nested"
          columns={columns}
          expandedRowRender={this.expandedRowRender}
          dataSource={_.map(tpls, (item, key) => ({ ...item, name: key }))}
        />
      </PageHeaderLayout>
    );
  }
}
