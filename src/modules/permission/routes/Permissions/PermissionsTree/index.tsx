import React, { Component } from 'react';
import {
  ResourceType, Resource,
  App, Module, Route, Element,
} from '../../../classes/Resource.interface';
import { connect } from 'dva';
import _ from 'lodash';
import { Tree, Icon, Popover, Button, Modal } from 'antd';
import TableLayout from 'layouts/TableLayout';
import ExModal from 'components/ExModal';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import ResourceTree from '../../../components/ResourcesTree';
import CONFIG from '../../../config';
import { findPermissionTypeByCode, resolveAppPermissions, parsePermissionsToTree } from '../../../utils/permissionTree';
import { buildResourcesTree } from '../../../services/permissions';
// import { buildResourcesTree } from '../../../services/permissionsV2';
import styles from './index.less';
import AppNode from './AppNode';
import ModuleNode from './ModuleNode';
import RouteNode from './RouteNode';
import NodeTitle from './NodeTitle';
import AppModuleTitle from './AppModuleTitle';
import renderResourceNode from './renderResourceNode';

const TreeNode = Tree.TreeNode;

const RESOURCE_PARENT_CODE_FIELD = 'parentResourceCode';
const RESOURCE_TYPE_FIELD = 'resourceType';

const callFetchListDebounce = _.debounce((fetchList) => fetchList(), 300);

const parseAppContent = (appContentStr) => {
  let appContent;
  try {
    appContent = JSON.parse(appContentStr);
  } catch (err) {}
  return appContent || {
    homePath: null,
    modules: [],
  };
};

const formatAppContent = JSON.stringify;


@connect(({ permissions }) => ({
  list: _.get(permissions, 'list'),
  resourcePermissions: _.get(permissions, 'resourcePermissions'),
  // list: mockData,
}))
export default class PermissionsPage extends Component {
  state = {
    apps: [],
    modules: [],
    tabActiveKey: 'all-modules',
  }

  curdActions: {
    fetchList: Function
    create: Function
    update: Function
    delete: Function
  }
  columns: Object[]
  itemFormConfigs: Object

  constructor(props) {
    super(props);

    this.columns = CONFIG.get('permissions.list').columns;

    this.itemFormConfigs = {
      create: CONFIG.get('permissions.createForm'),
      edit: CONFIG.get('permissions.editForm'),
    };

    this.curdActions = createSimpleRestActions('permissions', this.props.dispatch);
  }

  componentDidMount() {
    callFetchListDebounce(this.curdActions.fetchList);
    // this.computeAndUpdateAppsAndModules(this.props);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.list === this.props.list) {
      return;
    }
    // this.computeAndUpdateAppsAndModules(nextProps);
  }

  computeAndUpdateAppsAndModules(props) {
    const { list } = props || this.props;
    const { tabActiveKey } = this.state;

    const {
      apps,
      modules,
    } : {
      apps: App[],
      modules: Module[],
    } = buildResourcesTree(list);

    this.setState({
      apps,
      modules,
    });
  }

  addApp = () => {
    const onSave = (values) => {
      this.curdActions.create({
        ...values,
        parentResourceCode: null,
      });
    };

    ExModal.form({
      title: '创建应用',
      formInfo: CONFIG.get('permissions.createAppForm'),
      values: {
        resourceType: ResourceType.Module,
      },
      onSave,
      width: 600,
    });
  }

  createNodeActions = (node) => ({
    onEdit: () => this.handleEditNode(node._source),
    onDelete: () => this.handleDeleteNode(node._source),
    onAddChild: () => this.handleAddChild(node._source),
    onPermissionCheckedChange: (checked) => this.handlePermissionCheckedChange(node._source, checked),
  })

  getActiveApp = () => {
    const { list: permissions } = this.props;
    if (this.state.tabActiveKey === 'all-modules') {
      return;
    }
    const resourceCode = this.state.tabActiveKey;
    const permission = _.find(permissions, { resourceCode });
    if (!permission) {
      throw new Error('没有找到需要添加module的app');
    }

    return permission;
  }

  setAppHomeRoute = (node) => {
    const activeApp = this.getActiveApp();

    this.curdActions.update({
      ...activeApp._source,
      resourceContent: formatAppContent({
        modules: activeApp.modules,
        homePath: node.path,
      }),
    });
  }

  handleEditNode = node => {
    const onSave = (values) => {
      this.curdActions.update({ ...node, ...values });
    };

    ExModal.form({
      title: `编辑 ${node.resourceName}`,
      formInfo: CONFIG.get('permissions.editForm'),
      values: node,
      onSave,
      width: 600,
    });
  }

  handleDeleteNode = node => {
    this.curdActions.delete(node);
  }

  handleAddChild = node => {
    const parentCode = node.resourceCode;
    const onSave = (values) => {
      this.curdActions.create({
        ...values,
        [RESOURCE_PARENT_CODE_FIELD]: parentCode,
      });
    };

    ExModal.form({
      title: `创建 ${node.resourceName} 子权限`,
      formInfo: CONFIG.get('permissions.createChildNodeForm'),
      values: {
        [RESOURCE_PARENT_CODE_FIELD]: parentCode,
        [RESOURCE_TYPE_FIELD]: ResourceType.Route,
      },
      onSave,
      width: 600,
    });
  }

  handleAddModule = () => {
    const onSave = (values) => {
      this.curdActions.create({
        ...values,
      });
    };

    ExModal.form({
      title: `创建模块`,
      formInfo: CONFIG.get('permissions.createChildNodeForm'),
      values: {
        [RESOURCE_TYPE_FIELD]: ResourceType.Module,
      },
      onSave,
      width: 600,
    });
  }

  handleTabChange = key => {
    this.setState({
      tabActiveKey: key,
    });
  }

  handleAddModuleToApp = () => {
    const { list: permissions } = this.props;
    const permission = this.getActiveApp();
    if (!permission) {
      throw new Error('没有找到需要添加module的app');
    }
    const appContent = parseAppContent(permission.resourceContent);

    const onSave = ({ moduleCode }) => {
      const appContent = parseAppContent(permission.resourceContent);
      this.curdActions.update({
        ...permission,
        resourceContent: formatAppContent({
          ...appContent,
          modules: [ ...appContent.modules, moduleCode ],
        }),
      });
    };

    ExModal.form({
      title: `添加 ${permission.resourceName} 的模块`,
      formInfo: CONFIG.get('permissions.getModuleSelectForm')(
        _.chain(permissions)
          .filter({ resourceType: ResourceType.Module })
          .differenceBy(appContent.modules.map(item => ({ resourceCode: item })), 'resourceCode')
          .value()
      ),
      values: permission,
      onSave,
      width: '70%',
    });
  }

  handleEditApp = () => {
    const permission = this.getActiveApp();;
    if (!permission) {
      debugger;
      throw new Error('没有找到需要修改的app');
    }

    const onSave = (values) => {
      this.curdActions.update({
        ...permission,
        ...values,
      });
    };

    ExModal.form({
      title: `修改 ${permission.resourceName} 应用`,
      formInfo: CONFIG.get('permissions.editAppForm'),
      values: permission,
      onSave,
    });
  }

  handleRemoveApp = () => {
    const permission = this.getActiveApp();
    if (!permission) {
      debugger;
      throw new Error('没有找到需要删除的app');
    }
    Modal.confirm({
      title: '删除应用',
      content: `确定删除${permission.resourceName}？`,
      onOk: () => {
        this.handleDeleteNode(permission);
      }
    });
  }

  handleRemoveModuleFromApp = (moduleNode) => {
    const permission = this.getActiveApp();;
    if (!permission) {
      debugger;
      throw new Error('没有找到需要删除的app');
    }
    const appContent = parseAppContent(permission.resourceContent);
    const newAppContentStr = formatAppContent({
      ...appContent,
      modules: _.reject(appContent.modules, item => (item === moduleNode.key)),
    });

    this.curdActions.update({
      ...permission,
      resourceContent: newAppContentStr,
    });
  }

  handlePermissionCheckedChange = () => {
    // TODO:
    console.log('TODO: handlePermissionCheckedChange');
  }

  renderNodeTitle = (title, node) => {
    const { tabActiveKey } = this.state;
    const activeApp = this.getActiveApp();
    const isActiveAllModules = !tabActiveKey || tabActiveKey === 'all-modules';
    return isActiveAllModules
      ? <NodeTitle title={title} node={node} {...this.createNodeActions(node)} />
      : <AppModuleTitle title={title} node={node} onDelete={this.handleRemoveModuleFromApp} onSetHome={this.setAppHomeRoute} activeAppHomePath={activeApp && activeApp.homePath} />
  }

  render() {
    const { list } = this.props;
    const { tabActiveKey } = this.state;

    const typedTrees = parsePermissionsToTree(list);
    const modulesTreeObj = _.find(typedTrees, { type: ResourceType.Module });
    const modulesTree = modulesTreeObj ? modulesTreeObj.permissionsTree : [];
    const appPermissions = _.filter(list, { resourceType: ResourceType.App });

    // const { resourcePermissions: { apps, modules } = { apps: [], modules: [] } } = this.props;

    const isActiveAllModules = !tabActiveKey || tabActiveKey === 'all-modules';
    const tabList = [
      { key: 'all-modules', tab: '所有模块' },
      ..._.map(appPermissions, item => ({ key: item.resourceCode, tab: item.resourceName })),
    ];

    let activeApp: App, activeModules: Module[];
    if (isActiveAllModules) {
      activeModules = modulesTree;
    } else {
      activeApp = _.find(appPermissions, { code: tabActiveKey });
      activeModules = activeApp.modules;
    }
    const activeModulesTree = _.map(activeModules, m => ({
      ...m,
      children: m.routes,
    }));


    const action = (
      <div>
        <Button onClick={this.addApp}>添加应用</Button>
        { isActiveAllModules ? <Button onClick={this.handleAddModule}>添加模块</Button> : null }
      </div>
    );

    return (
      <PageHeaderLayout
        title="权限配置"
        action={action}
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >
        <div className={styles.container}>
          {
            tabActiveKey !== 'all-modules'
            ? (
              <div className={styles.appActionsContainer}>
                <Button type="primary" onClick={this.handleAddModuleToApp}>添加模块</Button>
                <Button onClick={this.handleEditApp}>编辑应用</Button>
                <Button type="danger" onClick={this.handleRemoveApp}>删除应用</Button>
              </div>
            ) : null
          }
          <ResourceTree
            modules={activeModulesTree}
            renderTitle={this.renderNodeTitle}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}

const mockData = [
  {
    id: 101,
    resCode: 'RS101',
    perCode: 'Per001',
    code: 'RT001',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 101,
      code: 'RS101',
      name: '运营',
      createTime: null,
      createUser: null,
      type: 'app',
      icon: null,
      parentCode: null,
      description: null,
      content: '{"homePath":"/","modules":[]}',
    },
    permisstion: {
      id: 101,
      name: '查看',
      code: 'view',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },{
    id: 1,
    resCode: 'RS001',
    perCode: 'Per001',
    code: 'RT001',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 1,
      code: 'RS001',
      name: '顶层访问',
      createTime: null,
      createUser: null,
      type: 'app',
      icon: null,
      parentCode: null,
      description: null,
      content: '{"homePath":"/","modules":["RS002"]}',
    },
    permisstion: {
      id: 1,
      name: '查看',
      code: 'view',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },
  {
    id: 2,
    resCode: 'RS002',
    perCode: 'Per001',
    code: 'RT002',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 2,
      code: 'RS002',
      name: '商品管理',
      createTime: null,
      createUser: null,
      type: 'module',
      icon: null,
      parentCode: 'RS001',
      description: null,
      content: null,
    },
    permisstion: {
      id: 1,
      name: '查看',
      code: 'view',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },
  {
    id: 3,
    resCode: 'RS003',
    perCode: 'Per001',
    code: 'RT002',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 2,
      code: 'RS003',
      name: '维度管理',
      createTime: null,
      createUser: null,
      type: 'route',
      icon: null,
      parentCode: 'RS002',
      description: null,
      content: null,
    },
    permisstion: {
      id: 1,
      name: '查看',
      code: 'view',
      createTime: null,
      createUser: null,
      description: '可否查看',
    },
  },
  {
    id: 4,
    resCode: 'RS004',
    perCode: 'Per002',
    code: 'RT004',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 4,
      code: 'RS004',
      name: '活动添加按钮',
      createTime: null,
      createUser: null,
      type: 'element',
      icon: null,
      parentCode: 'RS003',
      description: null,
      content: null,
    },
    permisstion: {
      id: 2,
      name: '点击',
      code: 'click',
      createTime: null,
      createUser: null,
      description: '可否点击',
    },
  },
  {
    id: 5,
    resCode: 'RS005',
    perCode: 'Per002',
    code: 'RT005',
    createTime: '2018-02-02 00:00:00',
    createUser: 'admin',
    resource: {
      id: 4,
      code: 'RS005',
      name: '活动添加按钮',
      createTime: null,
      createUser: null,
      type: 'element',
      icon: null,
      parentCode: 'RS003',
      description: null,
      content: null,
    },
    permisstion: {
      id: 2,
      name: '点击',
      code: 'click',
      createTime: null,
      createUser: null,
      description: '可否点击',
    },
  },
];
