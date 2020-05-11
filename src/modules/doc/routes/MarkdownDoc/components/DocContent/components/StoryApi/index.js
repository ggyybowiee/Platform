import styles from './index.less';

const {
  vendor: {
    react: React,
    dva: { connect },
    antd: { Table },
  },
} = platform;

const API_COLUMNS = [{
  title: '字段名',
  dataIndex: 'field',
  dataKey: 'field',
}, {
  title: '属性名',
  dataIndex: 'showName',
  dataKey: 'showName',
}, {
  title: '类型',
  dataIndex: 'type',
  dataKey: 'type',
}, {
  title: '默认值',
  dataIndex: 'defaultValue',
  dataKey: 'defaultValue',
  render(value) {
    return JSON.stringify(value);
  }
}, {
  title: '是否必须',
  dataIndex: 'required',
  dataKey: 'required',
  render(value) {
    return value ? '是' : '否';
  },
}, {
  title: '描述',
  dataIndex: 'desc',
  dataKey: 'desc',
}];

@connect(() => ({
}))
export default class StoryApi extends React.Component {

  render() {
    const { api } = this.props;

    if (!api) {
      return (
        <p></p>
      );
    }

    return (
      <div>
        <p>{api.info.desc}</p>
        <Table
          columns={API_COLUMNS}
          dataSource={_.map(api.properties, (prop, key) => ({ ...prop, field: key }))}
          pagination={false}
        />
      </div>
    );
  }
}
