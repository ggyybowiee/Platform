import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Tree, Icon, Popover, Button, Modal } from 'antd';
import TableLayout from 'layouts/TableLayout';
import ExModal from 'components/ExModal';
import { createSimpleRestActions } from 'utils/createSimpleRestModel';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import CONFIG from '../../../config';
import { findPermissionTypeByCode, resolveAppPermissions, parsePermissionsToTree } from '../../../utils/permissionTree';
import styles from './index.less';
import AppNode from './AppNode';
import ModuleNode from './ModuleNode';
import RouteNode from './RouteNode';
import NodeTitle from './NodeTitle';
import AppModuleTitle from './AppModuleTitle';
import { PERMISSION_APP, PERMISSION_MODULE, PERMISSION_ROUTE } from './const';

const TreeNode = Tree.TreeNode;

const callFetchListDebounce = _.debounce((fetchList) => fetchList(), 300);

const RESOURCE_PARENT_CODE_FIELD = 'parentResourceCode';
const RESOURCE_TYPE_FIELD = 'resourceType';

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
  pagination: _.get(permissions, 'pagination'),
}))
export default class PermissionsPage extends Component {
  state = {
    tabActiveKey: 'all-modules',
  }

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
  }

  addApp = () => {
    const onSave = (values) => this.curdActions.create({
      ...values,
      parentResourceCode: null,
    });

    ExModal.form({
      title: '创建应用',
      formInfo: CONFIG.get('permissions.createAppForm'),
      values: {
        resourceType: PERMISSION_APP,
        isMobileResource: '0',
      },
      onSave,
      width: 400,
    });
  }

  createNodeActions = (node) => ({
    onEdit: () => this.handleEditNode(node),
    onDelete: () => this.handleDeleteNode(node),
    onAddChild: () => this.handleAddChild(node),
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
    const appContent = parseAppContent(activeApp.resourceContent);

    this.curdActions.update({
      ...activeApp,
      resourceContent: formatAppContent({
        ...appContent,
        homePath: node.path,
      }),
    });
  }

  handleEditNode = node => {
    const onSave = (values) => this.curdActions.update({ ...node, ...values });

    ExModal.form({
      title: `编辑 ${node.resourceName}`,
      formInfo: CONFIG.get('permissions.editForm'),
      values: node,
      onSave,
      width: 400,
    });
  }

  handleDeleteNode = node => {
    this.curdActions.delete(node);
  }

  handleAddChild = node => {
    const isCreateAppChild = node.resourceType == PERMISSION_APP;
    const parentCode = isCreateAppChild ? null : node.resourceCode;

    const onSave = (values) => this.curdActions.create({
      ...values,
      parentResourceCode: parentCode,
    });

    ExModal.form({
      title: `创建 ${node.resourceName} 子权限`,
      formInfo: CONFIG.get('permissions.createChildNodeForm'),
      values: {
        isMobileResource: '0',
        parentResourceCode: parentCode,
        resourceType: node.resourceType == isCreateAppChild ? PERMISSION_MODULE : PERMISSION_ROUTE,
      },
      onSave,
      width: 400,
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
      return this.curdActions.update({
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
          .filter({ resourceType: PERMISSION_MODULE })
          .differenceBy(appContent.modules.map(item => ({ resourceCode: item })), 'resourceCode')
          .value()
      ),
      values: {
        isMobileResource: '0',
        ...permission,
      },
      onSave,
      width: '70%',
    });
  }


  handleAddModule = () => {
    const onSave = (values) => this.curdActions.create({
      ...values,
    });

    ExModal.form({
      title: `创建模块`,
      formInfo: CONFIG.get('permissions.createChildNodeForm'),
      values: {
        [RESOURCE_TYPE_FIELD]: PERMISSION_MODULE,
        isMobileResource: '0',
      },
      onSave,
      width: 600,
    });
  }

  handleEditApp = () => {
    const { list: permissions } = this.props;
    const permission = this.getActiveApp();;
    if (!permission) {
      debugger;
      throw new Error('没有找到需要修改的app');
    }

    const onSave = (values) => this.curdActions.update({
      ...permission,
      ...values,
    });

    ExModal.form({
      title: `修改 ${permission.resourceName} 应用`,
      formInfo: CONFIG.get('permissions.editAppForm'),
      values: {
        isMobileResource: '0',
        ...permission,
      },
      onSave,
    });
  }

  handleRemoveApp = () => {
    const { list: permissions } = this.props;
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
    const { list: permissions } = this.props;
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

  render() {
    const { list, pagination, location } = this.props;
    const { tabActiveKey } = this.state;

    const typedTrees = parsePermissionsToTree(list);
    const modulesTreeObj = _.find(typedTrees, { type: PERMISSION_MODULE });
    const modulesTree = modulesTreeObj ? modulesTreeObj.permissionsTree : [];
    const appPermissions = _.filter(list, { resourceType: PERMISSION_APP });

    let activeApp, activeAppContent, activeModulesTree;

    const isActiveAllModules = !tabActiveKey || tabActiveKey === 'all-modules';

    if (isActiveAllModules) {
      activeApp = null;
      activeAppContent = null;
      activeModulesTree = modulesTree;
    } else {
      activeApp = _.find(list, { resourceCode: tabActiveKey });

      if (activeApp) {
        activeAppContent = parseAppContent(activeApp.resourceContent);
        activeModulesTree = _.filter(modulesTree, m =>
          _.some(activeAppContent.modules, activeModule => (activeModule === m.key))
        );
      }
    }

    const tabList = [
      { key: 'all-modules', tab: '所有模块' },
      ..._.map(appPermissions, item => ({ key: item.resourceCode, tab: item.resourceName })),
    ];

    const action = (
      <div>
        <Button onClick={this.addApp}>添加应用</Button>
        { isActiveAllModules ? <Button onClick={this.handleAddModule}>添加模块</Button> : null }
      </div>
    );

    return (
      <PageHeaderLayout
        title="资源配置"
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
          <Tree
            showIcon
            showLine
            onSelect={this.onSelect}
          >
            {
              _.mapTreeNodes(activeModulesTree, (node) => (
                <Tree.TreeNode
                  key={node.key}
                  title={(
                    tabActiveKey === 'all-modules'
                    ? <NodeTitle node={node} {...this.createNodeActions(node.source)} />
                    : <AppModuleTitle node={node} onDelete={this.handleRemoveModuleFromApp} onSetHome={this.setAppHomeRoute} activeAppHomePath={activeAppContent && activeAppContent.homePath} />
                  )}
                  icon={<Icon type={node.source.resourceIcon || node.source.resourceContent} />}
                >
                  {node.children}
                </Tree.TreeNode>
              ))
            }
          </Tree>
        </div>
      </PageHeaderLayout>
    );
  }
}
