import React from 'react';
import _ from 'lodash';
import { set, unset } from 'lodash/fp';
import { Form, List, Checkbox, notification, Alert } from 'antd';
import { getApi, postApi, deleteApi } from 'utils/request';

@Form.create()
class GrantUserRole extends React.Component {
  state = {
    roles: [],
    userRolesMap: [],
  }

  componentDidMount() {
    getApi('/auth/roles')
      .then(data => {
        this.setState({ roles: data });
      });

    getApi(`/auth/users/${this.props.user.userCode}/userRoleMappings`)
      .then(userRoles => {
        this.setState({ userRolesMap: _.mapKeys(userRoles, 'roleCode') });
      })
  }

  handleItemCheckedChange = (role, isChecked) => {
    const { userRolesMap } = this.state;
    if (isChecked) {
      postApi('/auth/userRoleMappings', { roleCode: role.roleCode, userCode: this.props.user.userCode })
        .then(resp => {
          this.setState({
            userRolesMap: set([role.roleCode])(resp)(userRolesMap),
          });
        });
      this.setState({
        userRolesMap: set([role.roleCode])({})(userRolesMap),
      });
    } else {
      const userRole = userRolesMap[role.roleCode];
      deleteApi(`/auth/userRoleMappings/${userRole.seqId}`);
      this.setState({
        userRolesMap: unset([role.roleCode])(userRolesMap),
      });
    }
  }

  render() {
    const { roles, userRolesMap } = this.state;

    return (
      <Form onClick={this.handleClick}>
        <Alert message="操作后直接生效" type="info" showIcon />
        <List
          bordered
          dataSource={roles}
          renderItem={role => (
            <List.Item>
              <Checkbox checked={_.get(userRolesMap, [role.roleCode])} onChange={(evt) => this.handleItemCheckedChange(role, evt.target.checked)}>{role.roleName}</Checkbox>
            </List.Item>
          )}
        />
      </Form>
    );
  }
}

export default GrantUserRole;
