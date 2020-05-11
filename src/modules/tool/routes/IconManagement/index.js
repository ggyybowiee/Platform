const {
  vendor: {
    react: React,
    dva: { connect },
    antd: { Card, Icon, Button, Input, message, Modal, Row, Col, Popconfirm },
    lodash: _,
    classnames: classNames,
  },
  utils: {
    request: { getApi, postApi },
  },
  layouts: {
    PageHeaderLayout,
  },
  components: {
    ExModal,
  }
} = platform;

const Search = Input.Search;

import styles from './index.less';

@connect(state => ({
  iconTypes: _.get(state, 'icons.iconTypes'),
  loading: _.get(state, 'loading.effects.icons/fetchIconTypes'),
  running: _.get(state, 'loading.effects.icons/run'),
  deleting: _.get(state, 'loading.effects.icons/delete'),
}))
export default class Scaffold extends React.Component {

  state = {
    filterText: '',
  }

  componentDidMount() {
    this.getIconTypes();
  }

  getIconTypes = () => {
    return this.props.dispatch({
      type: 'icons/fetchIconTypes',
    });;
  }

  handleRun = () => {
    this.props.dispatch({
      type: 'icons/run',
    }).then(response => {

      if (response) {
        message.success('图标已生成~');
        this.getIconTypes();
      }
    });
  }

  handleOpenUpload = () => {
    const onSave = (values, form) => {
      const formData = new FormData();
      const instance = form.getFieldInstance('file');

      formData.append('name', values.name);
      formData.append('file', _.get(instance, 'state.value.originFileObj'));

      return postApi('/icons/upload', formData).then(response => {

        if (response) {
          this.handleRun();
        }

        return !!response;
      });
    };

    ExModal.form({
      title: '上传图标',
      formInfo: require('./config/form.json'),
      onSave,
      width: 400,
    });
  }

  handleFilterChange = (value) => this.setState({ filterText: value })

  handleDelete = (type) => {
    this.setState({
      deletingType: type,
    });

    this.props.dispatch({
      type: 'icons/delete',
      payload: type,
    }).then(() => {
      this.setState({
        deletingType: null,
      });

      message.success('图标已删除~');

      this.getIconTypes();
    });
  }

  render() {
    const { iconTypes, running, loading, deleting } = this.props;
    const { deletingType } = this.state;

    return (
      <PageHeaderLayout title="图标管理">
        <Card
          loading={loading}
          className={styles.iconWrap}
          title={(
            <div>
              <Search
                placeholder="按字体名称检索"
                onChange={e => this.handleFilterChange(e.target.value)}
                style={{ width: 300 }}
              />
              &nbsp;
              <Button icon="upload" onClick={this.handleOpenUpload}>上传新图标</Button>
            </div>
          )}
          extra={(
            <Button loading={running} icon="arrow-right" onClick={this.handleRun} type="primary">生成iconFont</Button>
          )}
        >
          <Row gutter={0}>
            {
              _.chain(iconTypes)
              .filter(type => type.indexOf(this.state.filterText) > -1 || !this.state.filterText)
              .map((type) => (
                <Col span={4}>
                  <Card.Grid
                    key={type}
                    className={classNames(styles.iconItem, {
                      [styles.deleting]: deleting && deletingType === type,
                    })}
                  >
                    <Icon style={{ fontSize: 24 }} type={type} />
                    <div>
                      {type}
                    </div>
                    <Popconfirm title="确定删除此图标吗？" onConfirm={() => this.handleDelete(type)}>
                      <Icon className={styles.remove} type="close" />
                    </Popconfirm>
                  </Card.Grid>
                </Col>
              ))
              .value()
            }
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
