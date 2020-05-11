import React from 'react';
import { Row, Col } from 'antd';
import initDetail from './initDetail';
import styles from './index.less';

export default ({ elements, detail, Element }) => {
    const elementsMap = _.mapKeys(elements, 'id');

    return (
      <div>
        {_.map(detail, (row, rowIndex) => {
          const span = Math.floor(24 / row.length);

          return (
            <Row gutter={16} key={`row-${rowIndex}`} className={styles.row}>
              {
                _.map(row, (keyOrIndex, cellIndex) => (
                  <Col span={span} className={styles.cell} key={keyOrIndex}>
                    <Element {...elementsMap[keyOrIndex]} />
                  </Col>
                ))
              }
            </Row>
          );
        })}
      </div>
    );
}
