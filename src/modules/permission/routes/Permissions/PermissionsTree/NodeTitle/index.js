import React, { Component } from 'react';
import { Popover, Icon, Checkbox } from 'antd';
import { getResourceTypeName } from '../../../../utils.ts';
import styles from './index.less';

const mockPermissions = [{
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

const isPermissionChecked = (node, permission) => {
  return _.some(node.resourcePermissionRelations, resPerRelation =>
    (resPerRelation.permission.code === permission.code)
  );
}

export default ({ title, node, permissions = mockPermissions, onEdit, onDelete, onAddChild, onPermissionCheckedChange }) => {
  const content= (
    <div>
      <div  className={styles.operations}>
        <Icon type="edit" onClick={onEdit} />
        <Icon type="plus-circle-o" onClick={onAddChild} />
        <Icon type="delete" onClick={onDelete} />
      </div>
      <div className={styles.permissions}>
        {
          _.map(permissions, (p, index) => (
            <Checkbox key={index} checked={isPermissionChecked(node, p)} onChange={(evt) => onPermissionCheckedChange(p, evt.target.checked)}>{p.name}</Checkbox>
          ))
        }
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="hover" placement="right">{title}</Popover>
  );
};
