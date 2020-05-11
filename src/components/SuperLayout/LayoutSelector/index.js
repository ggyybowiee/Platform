import React, { PureComponent } from 'react';
import { Card, Popover, Badge, Tag } from 'antd';
import _ from 'lodash';
import SuperLayout from 'components/SuperLayout';
import SuperInput from 'components/SuperInput';
import styles from './index.less';

const handleLayoutChange = async (layoutName, elements, onChange) => {
  const layout = SuperLayout.layouts[layoutName];
  const detail = await SuperLayout.initDetail(layoutName, elements);
  if (!layout.initDetail) {
    onChange({
      elements,
      layout: {
        type: layoutName,
        detail,
      },
    });
  }
  onChange({
    elements,
    layout: {
      type: layoutName,
      detail,
    },
  });
};

export default ({ elements, layout, onChange }) => (
  <div className={styles.layoutSelector}>
    <SuperInput type="enum" enumType="select" options={_.map(SuperLayout.layouts, (layout, layoutName) => ({
      label: layout.showName,
      value: layoutName,
    }))} value={layout} onChange={(value) => handleLayoutChange(value, elements, onChange)} />
  </div>
);
