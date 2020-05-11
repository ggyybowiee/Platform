import React from 'react';
import { Form, Tabs, Button, Alert, Checkbox, Popover } from 'antd';
import _ from 'lodash';
import SuperInput from 'components/SuperInput';
import { getApi, postApi, putApi } from 'utils/request';
import { findPermissionTypeByCode, parsePermissionsToTree } from '../../../utils/permissionTree';
import ResourceTree from '../../../components/ResourcesTree';
import { buildResourcesTree } from '../../../services/permissions';
import styles from './index.less';

const { TabPane } = Tabs;

const isPermissionChecked = (node, permission) => {
  return _.some(node.resourcePermissionRelations, resPerRelation =>
    (resPerRelation.permission.code === permission.code)
  );
}

@Form.create()
export default class GrantPermissionForms extends React.Component {
  state = {
    apps: [],
    modules: [],
    grantedPermissionsKeys: null,
  }

  componentDidMount() {
    this.computeAndUpdateAppsAndModules(this.props);

    const { role, permissions } = this.props;
    getApi(`/auth/roles/${role.roleCode}/roleResourceMappings`)
      .then((rolePermissionMap) => {
        const groupedKeys = _.chain(rolePermissionMap)
          .filter({ roleCode: role.roleCode, relation: '1' })
          .map('resourceCode')
          .groupBy(resourceCode => findPermissionTypeByCode(permissions, resourceCode))
          .value();
        this.setState({
          rolePermissionMap,
          grantedPermissionsKeys: {
            '1': groupedKeys['1'],
            '2': _.concat([], groupedKeys['0'], groupedKeys['2']),
          },
        });
      });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.list === this.props.list) {
      return;
    }
    this.computeAndUpdateAppsAndModules(nextProps);
  }

  computeAndUpdateAppsAndModules(props) {
    const { permissions } = props || this.props;

    const {
      apps,
      modules,
    } = buildResourcesTree(permissions);

    this.setState({
      apps,
      modules,
    });
  }

  handleSaveClick = () => {
    const { onSave, form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    const permissionKeys =_.chain(values)
      .map(_.identity)
      .flatten()
      .value();
  }

  handleCheck = (checkedKeys, evt) => {
    const { role } = this.props;
    const permission = evt.node.props.dataRef;
    const { checked } = evt;
    const { rolePermissionMap } = this.state;
    const rolePermission = _.find(rolePermissionMap, { resourceCode: permission.key });

    if (!rolePermission) {
      return postApi('/auth/roleResourceMappings', {
        relation: checked ? '1' : '0',
        resourceCode: permission.key,
        roleCode: role.roleCode,
      }).then(resp => {
        rolePermissionMap.push(resp);
      });
    }
    return putApi(`/auth/roleResourceMappings/${rolePermission.seqId}`, {
      ...rolePermission,
      relation: checked ? '1' : '0',
    });
  }

  renderSetPermissionTitle = (title, node) => {
    const permissions = [{
      name: '查看',
      code: 'view',
    }, {
      name: '点击',
      code: 'click',
    }, {
      name: '点击',
      code: 'click',
    }, {
      name: '点击',
      code: 'click',
    }, {
      name: '点击',
      code: 'click',
    }];
    const permissionSetting = (
      <div>
        {
          _.map(permissions, (p, index) => (
            <Checkbox key={index} checked={isPermissionChecked(node, p)} onChange={(evt) => this.handlePermissionCheckedChange(p, evt.target.checked)}>{p.name}</Checkbox>
          ))
        }
      </div>
    );
    return (
      <Popover content={permissionSetting}>{title}</Popover>
    );
  }

  render() {
    const {
      permissions,
      form: { getFieldProps, isFieldsTouched },
      onCancel,
    } = this.props;
    const {
      grantedPermissionsKeys,
      apps, modules,
    } = this.state;

    if (!grantedPermissionsKeys) {
      return (
        <div>加载中...</div>
      );
    }

    return (
      <Form>
        <Alert message="操作后直接生效" type="info" showIcon />
        <Tabs>
          <TabPane tab="模块" key="modules">
            <ResourceTree
              modules={_.map(modules, m => ({ ...m, children: m.routes }))}
              renderTitle={this.renderSetPermissionTitle}
            />
          </TabPane>
          {
            _.map(parsePermissionsToTree(permissions), ({ permissionsTree, title, type }) => (
              <TabPane tab={title} key={type}>
                <SuperInput
                  type="treeCheck"
                  treeData={permissionsTree}
                  onCheck={this.handleCheck}
                  checkStrictly
                  {...getFieldProps(type, { initialValue: grantedPermissionsKeys[type] })}
                />
              </TabPane>
            ))
          }
        </Tabs>

        <div className={styles.footer}>
          <Button onClick={onCancel}>关闭</Button>
          {/* <Button type="primary" disabled={!isFieldsTouched()} onClick={this.handleSaveClick}>保存</Button> */}
        </div>
      </Form>
    );
  }
}
