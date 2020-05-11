import React from 'react';
import { Row, Col, Card, Icon, Popconfirm, Badge, Tag, Button, Popover } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

export default ({ elements, Element }) => {

    return (
      <div>
        {
          _.map(elements, elt => (
            <div className={classnames(styles.item, elt.className)} key={elt.id} style={elt.style}>
              <Element {...elt} />
            </div>
          ))
        }
      </div>
    );
}
