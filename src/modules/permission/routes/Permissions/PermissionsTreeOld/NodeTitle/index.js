import React, { Component } from 'react';
import { Popover, Icon } from 'antd';

export default ({ node, onEdit, onDelete, onAddChild }) => {
  const content= (
    <div>
      <Icon type="edit" onClick={onEdit} />
      <Icon type="plus-circle-o" onClick={onAddChild} />
      <Icon type="delete" onClick={onDelete} />
    </div>
  );

  return (
    <Popover content={content} trigger="hover" placement="right">{node.title}</Popover>
  );
};
