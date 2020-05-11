const {
  vendor: {
    react: React,
    dva: { connect },
    antd: { Table, Card },
  },
  components: {
    SuperInput,
  },
  layouts: {
    PageHeaderLayout,
  },
} = platform;

const getColumns = values => [
  { title: '名称', dataIndex: 'info.title', key: 'info.title' },
  { title: '说明', dataIndex: 'info.desc', key: 'info.desc' },
  { title: '值', dataIndex: 'value', key: 'value', render(value, record, b, c, d) {
    const isModule = !record.parent;
    if (isModule) {
      return '';
    }

    let fieldPath = record.field ? record.field.name : '';
    let tmpParent = record.parent;
    while (tmpParent) {
      fieldPath = `${tmpParent.field.name}.${fieldPath}`;
      tmpParent = tmpParent.parent;
    }
    return (
      <SuperInput
        {...record.input}
        value={_.get(values, fieldPath)}
      />
    );
  } },
];

@connect(state => ({ }))
export default class ModuleConfig extends React.Component {

  render() {
    // const { tpls } = this.props;
    const moduleConfigsSchema = mockSchema;
    const moduleConfigsValues = mockData;

    return (
      <PageHeaderLayout title="模块配置">
        <Card bodyStyle={{ padding: 0 }}>
          <Table
            pagination={false}
            columns={getColumns(moduleConfigsValues)}
            dataSource={tranformModuleConfigsToDataSource(moduleConfigsSchema, moduleConfigsValues)}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

function tranformModuleConfigsToDataSource(moduleConfigs) {
  return _.map(moduleConfigs, (item, key) => {
    const result = {
      ...item,
      field: {
        name: item.info.name,
      },
    };
    result.children = tranformSchema(item.schema, result);
    return result;
  });
}

function tranformSchema(schema, parent, isArray) {
  // TODO: 数组类型schema
  return _.map(schema, item => ({
    ...item,
    parent,
    children: item.input.schema ? tranformSchema(item.input.schema, item) : null,
  }));
}

const mockData = {
  platform: platform.moduleConfigs.platform.config,
};

const mockSchema = [{
  info: {
    name: 'platform',
    title: '平台',
    desc: '平台',
  },
  schema: [
    {
      info: {
        title: '文档标题前缀',
        desc: '显示在浏览器标签页上的标题的前缀，最终浏览器标签页的标题为`${前缀} ${页面标题}`',
      },
      field: {
        name: 'documentTitlePrefix',
        label: '文档标题前缀',
      },
      input: {
        type: 'string',
      },
    },
    {
      info: {
        title: '网站名',
        desc: '后台管理的网站名称',
      },
      field: {
        name: 'siteName',
        label: '网站名',
      },
      input: {
        type: 'string',
      },
    },
    {
      info: {
        title: '网站标语',
        desc: '网站标语',
      },
      field: {
        name: 'siteShotIntro',
        label: '网站标语',
      },
      input: {
        type: 'string',
      },
    },
    {
      info: {
        title: 'logo',
        desc: '',
      },
      field: {
        name: 'logo',
        label: 'logo',
      },
      input: {
        type: 'string',
      },
    },
    {
      info: {
        title: '底部链接',
        desc: '',
      },
      field: {
        name: 'footerLinks',
        label: '底部链接',
      },
      input: {
        schema: [
          {
            info: {
              name: 'key',
              title: '标志',
            },
            field: {
              name: 'key',
              label: '标志',
            },
            input: {
              type: 'string',
            },
          },
          {
            info: {
              name: 'title',
              title: '标题',
            },
            field: {
              name: 'title',
              label: '标题',
            },
            input: {
              type: 'string',
            },
          },
          {
            info: {
              name: 'href',
              title: '链接',
            },
            field: {
              name: 'href',
              label: '链接',
            },
            input: {
              type: 'string',
            },
          },
          {
            info: {
              name: 'blankTarget',
              title: '是否在新页面打开',
            },
            field: {
              name: 'blankTarget',
              label: '是否在新页面打开',
            },
            input: {
              type: 'boolean',
            },
          },
        ],
      },
    },
    {
      info: {
        title: '版权',
        desc: '版权声明',
      },
      field: {
        name: '版权',
        label: '',
      },
      input: {
        schema: [{
          info: {
            name: 'year',
            title: '版权年份',
          },
          field: {
            name: 'year',
            label: '年份',
          },
          input: {
            type: 'string',
          },
        }, {
          info: {
            name: 'owner',
            title: '版权所有者',
          },
          field: {
            name: 'owner',
            label: '版权所有者',
          },
          input: {
            type: 'string',
          },
        }]
      },
    },
  ],
}];

