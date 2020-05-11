import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
    if (!_.isEqual(nextProps.data, this.props.data)) {
      this.setState({
        current: 1,
      });
    }

  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList, current = 1, pageSize = 10 } = this.state;
    const { data: { list, pagination }, loading, columns, rowKey, oprs, enableSelect = false, ...otherProps } = this.props;
    const paginationProps = (pagination || pagination !== false) ? {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: (page, pageSize) => {
        this.setState({
          current: page,
          pageSize,
        })
      },
      onShowSizeChange: (current, size) => {
        this.setState({
          current: 1,
          pageSize: size,
        })
      },
      ...(pagination || {}),
    } : false;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    let newColumns = _.cloneDeep(columns);
    const hasIndex = _.findIndex(newColumns, (item) => item.key === 'index');
    if (hasIndex > -1) {
      newColumns[hasIndex].render = (text, record, index) => (current - 1) * pageSize + index + 1;
    }

    return (
      <div className={styles.standardTable}>
        {
          oprs ? (
            <div>
              {oprs}
            </div>
          ) : null
        }
        {
          enableSelect ? (
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <Fragment>
                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    {needTotalList.map(item => (
                      <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                        {item.title}总计&nbsp;
                        <span style={{ fontWeight: 600 }}>
                          {item.render ? item.render(item.total) : item.total}
                        </span>
                      </span>
                    ))}
                    <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                      清空
                    </a>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </div>
          ) : null
        }
        <Table
          ref={(ref) => (this.tableRef = ref)}
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={enableSelect && rowSelection}
          dataSource={list}
          columns={newColumns}
          pagination={{ ...paginationProps, current }}
          onChange={this.handleTableChange}
          {...otherProps}
        />
      </div>
    );
  }
}

export default StandardTable;
