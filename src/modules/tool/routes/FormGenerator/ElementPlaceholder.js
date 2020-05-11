import React, { PureComponent } from 'react';
import { Card, Popover, Badge, Tag } from 'antd';
import _ from 'lodash';
import styles from './index.less';

const {
  components: {
    SuperInput,
  },
} = platform;

export default ({ element: { field, input } }) => (
  <div className={styles.elementPlaceholder}>
    <SuperInput {...input} />
    <Card className={styles.card}>
      {
        _.find(field.rules, { required: true }) && (
          <Popover
            title="验证"
            content={
              <ul style={{ paddingLeft: 20 }}>
                {
                  _.map(field.rules, (rule) => (
                    <li>{rule.message}</li>
                  ))
                }
              </ul>
            }
          >
            <span className={styles.badge}>
              <Badge status="error" />
            </span>
          </Popover>
        )
      }
      <Tag>{field.label}</Tag>
      <Tag>{field.name}</Tag>
      <Tag>{input.type}</Tag>
    </Card>
  </div>
);
