import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { DebounceAll, before } from 'lodash-decorators';
import classnames from 'classnames';
import qs from 'qs';
import ReactToPrint from "react-to-print";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Tabs,
  message,
  Table,
} from 'antd';
import StandardTable from 'components/StandardTable';
import SimpleForm from 'components/SimpleForm';
import ExModal from 'components/ExModal';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import formatterService from 'services/formatter';
import { downloadTableAsXls } from 'utils/tableToExcel';
import Filters from './Filters';
import FilterForm from './FilterForm';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const TabPane = Tabs.TabPane;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

export default class TableLayout extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},

    filterValues: qs.parse(platform.app._history.location.search.substr(1)),
    // 用于强制更新filter from
    filterFormVersion: 1,
  };

  componentDidMount() {
    this.fetchList(this.props.initialParams, true);
  }

  componentWillUpdate(nextProps) {
    const nextTab = nextProps.tab;
    const currentTab = this.props.tab;
    if (nextTab === currentTab) {
      return;
    }
    if (!(nextTab && currentTab) || (nextTab.activeKey !== currentTab.activeKey)) {
      this.fetchList(null, true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (_.isEqual(prevState.filterValues, this.state.filterValues)) {
      return;
    }
    this.fetchList();
  }

  getColumns = (extraRowOprs = false) => {
    const { columns, rowOprs, extraFormData } = this.props;
    const innerOprsMap = {
      edit: ({ item }) => <Button key="inner-edit" shape="circle" icon="edit" onClick={() => this.openItemModalForm({ ...extraFormData, ...item})} />,
      delete: ({ item }) => <Button key="inner-delete" type="danger" shape="circle" icon="delete" onClick={() => this.deleteItem({ ...extraFormData, ...item })} />,
    };

    return _.chain(columns)
      .map(col => {
        const { formatter } = col;
        if (!formatter) {
          return col;
        }
        return { ...col, render(v) { return formatterService.format(formatter.type, v, formatter) } };
      })
      .concat((rowOprs && !extraRowOprs) ? [{
        title: '操作',
        dataIndex: 'rowOprs',
        key: 'rowOprs',
        align: 'center',
        render(value, item) {
          return (
            <div className={styles.rowOprs}>
              {
                _.map(rowOprs, opr => {
                  const Comp = _.isString(opr) ? innerOprsMap[opr] : opr;
                  return <Comp item={item} />;
                })
              }
            </div>
          )
        },
      }] : [])
      .value();
  }

  @DebounceAll(300)
  fetchList(otherParams, focus = false, forceUpdate) {
    const { serverPagination, curdHandles, extraParams, pagination } = this.props;
    if (!curdHandles) {
      return;
    }

    const fetchList = serverPagination ? curdHandles.fetchPaginationList : curdHandles.fetchList;
    if (!fetchList) {
      return;
    }

    const { filterConfig } = this.props;
    const { filterValues } = this.state;
    const queryParams = filterConfig && filterConfig.filters
      ? { ...Filters.queryParams(filterConfig.filters, filterValues), ...(otherParams || {}) }
      : otherParams;
    if (!forceUpdate && _.isEqual(this.queryParams, queryParams) && !focus) {
      return;
    }

    this.queryParams = queryParams;

    // TODO：增加loading

    fetchList({
      ...extraParams,
      ...pagination,
      ...queryParams,
    } || {});
  }

  deleteItem = (item) => {
    Modal.confirm({
      title: '警告',
      content: `确定要删除该${this.props.name || '资源'}？`,
      okType: 'danger',
      onOk: () => {
        const { curdHandles: { delete: onDelete } } = this.props;
        if (!onDelete) {
          return;
        }
        onDelete(item);
      },
    });
  }

  openItemModalForm = (item, { isCreate : isCreateConfig = false } = {}) => {
    const { name = '资源', modalItemFormConfigs, curdHandles: { create, update } } = this.props;
    const isCreate = !item || isCreateConfig;

    const onSave = (values) => {
      const save = isCreate ? create : update;
      return save(_.assign({}, item, values), item, values).then(() => console.log('fetching') || this.fetchList(null, null, true));
    }

    ExModal.form({
      title: `${isCreate ? '添加' : '修改'}${name}`,
      formInfo: modalItemFormConfigs[isCreate ? 'create' : 'edit'],
      values: item,
      onSave,
      width: 400,
      footer: false,
    });
  }

  // handleFilterValuesChange = (formProps, changedFieldValue, filterValues) => {
  //   this.setState({ filterValues });
  // }

  handleFilterValuesChange = (filterValues, currentChangedValue, props) => {
    const { beforeFilter } = this.props;
    let values = { ...filterValues };

    if (_.isFunction(beforeFilter)) {
      values = beforeFilter(values, currentChangedValue, props);
    }

    this.setState({
      filterValues: {
        ...this.state.filterValues,
        ...values,
      },
    });
  }

  handleFilterValuesInited = (filterValues) => {
    this.setState({
      filterValues: {
        ...this.state.filterValues,
        ...filterValues,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    // TODO: 前端filter和排序应该开放
    if (!this.props.serverPagination) {
      this.setState({
        sorter,
      });
      return true;
    }

    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { initialParams } = this.props;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      orderBy: pagination.orderBy,
      ...initialParams,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.orderBy = `${sorter.field}.${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }

    this.fetchList(params);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  setFilterValue = (key, value) => {
    this.setState({
      filterValues: { ...this.state.filterValues, [key]: value },
      filterFormVersion: this.state.filterFormVersion + 1,
    });
  }

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleExportBtnClick = () => {
    downloadTableAsXls('#table-to-export', this.props.download || document.title);
    // const tableElt = document.querySelector('#table-to-export table');
    // const headerLineStr =_.chain(tableElt.querySelectorAll('th'))
    //   .map('innerText')
    //   .join(',')
    //   .value();
    // const contentLinesStr = _.chain(tableElt.querySelectorAll('tbody tr'))
    //   .map(line => _.map(line.cells, cell => `"${cell.innerText}"`))
    //   .map(lineTds => _.join(lineTds, ','))
    //   .join('\n')
    //   .value();
    // const resultStr = `${headerLineStr}\n${contentLinesStr}`;

    // const link = document.getElementById('export-link');
    // link.href = tableToExcel(tableElt); // `data:text/csv;charset=utf-8,\uFEFF${resultStr}`;
    // link.click();
    // return resultStr;
  }

  renderFilterForm(filterFormConfig) {
    return (
      <FilterForm
        formConfig={filterFormConfig}
        values={this.state.filterValues}
        extraData={this.props.extraData}
        onChange={this.handleFilterValuesChange}
        onValuesInited={this.handleFilterValuesInited}
        key={this.state.filterFormVersion}
      />
    );
  }

  renderTableActions = (list) => {
    const { oprs = ['create'], extraFormData, isDisabled } = this.props;
    const { selectedRows } = this.state;

    const innerOprsMap = {
      create: (props) => (
        <Button key="create" icon="plus" type="primary" onClick={() => this.openItemModalForm({ ...extraFormData }, { isCreate: true })} {...props}>
          {this.props.buttonName || '新建'}
        </Button>
      ),
      print: (props) => (
        <ReactToPrint
          key="print"
          trigger={() => (
            <Button icon="printer" disabled={!_.size(list) || isDisabled} {...props}>
              打印
            </Button>
          )}
          content={() => this.printRef}
        />
      ),
      export: (props) => (
        <Button key="export" icon="export" onClick={this.handleExportBtnClick} {...props} disabled={_.isEmpty(list) || isDisabled}>
          导出
        </Button>
      ),
      searchCountAlert: (props) => (
        <span {...props}>搜索到符合条件的记录共有 <span style={{ fontWeight: 'bold' }}>{list && list.length}</span> 条</span>
      ),
    };
    return _.map(oprs, opr => {
      if (_.isString(opr)) {
        const Comp = innerOprsMap[opr];
        return <Comp />;
      }
      if (_.isFunction(opr)) {
        // TODO:
        return opr({ list, selectedRows, /*columns: finnalyColumns*/ });
      }
      if (_.isObject(opr) && opr.type && innerOprsMap[opr.type]) {
        const Comp = innerOprsMap[opr.type];
        return <Comp {...opr} />;
      }
      return opr;
    });
  }

  render() {
    const {
      title,
      data,
      columns,
      filterForm,
      filterConfig,
      filterMode = 'inline',
      oprsInline = false,
      modalItemFormConfigs,
      loading,
      rowKey,
      oprs = ['create'],
      tab = null,
      download,
      printConfig = {},
      ...otherProps
    } = this.props;
    const { selectedRows } = this.state;
    const sorter = this.state.sorter || this.props.defaultSorter;

    let list = filterConfig && filterConfig.filters
      ? Filters.filter(data.list, filterConfig.filters, this.state.filterValues, 'display')
      : data.list;

    list = sorter ? _.sortBy(list, sorter.field) : list;
    if (sorter && sorter.order === 'descend') {
      list = _.reverse(list);
    }

    const { linePrePage = 20, caption = '', subCaption = '' } = printConfig;
    const printList = _.chunk(list, linePrePage);
    const printTotalPage = printList.length;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const finnalyColumns = this.getColumns();
    let newColumns = _.cloneDeep(finnalyColumns);

    newColumns.map(item => item.defaultSortOrder = '');

    const filterFormElt = (
      <div className={styles.tableListForm}>{filterForm || (filterConfig && this.renderFilterForm(filterConfig.form))}</div>
    );

    const oprElts = this.renderTableActions(list);
    const hasExportExcel = _.some(oprs, item => (_.get(item, 'type') === 'export' || item === 'export'));
    const hasPrintOpr = _.some(oprs, item => (_.get(item, 'type') === 'print' || item === 'print'));

    const filterPane = (
      <div className={classnames(styles.oprsContainer, { [styles.oprsInline]: oprsInline })}>
        { filterMode !== 'header-pane' ? filterFormElt : <div /> }
        <div className={styles.tableListOperator}>
          { oprElts }
          {selectedRows.length > 0 && (
            <span>
              <Button>批量操作</Button>
              <Dropdown overlay={menu}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </span>
          )}
        </div>
      </div>
    ); //inner-tabs

    let table = (
      <StandardTable
        // ref={el => (this. = el)}
        selectedRows={selectedRows}
        loading={loading}
        data={{ ...data, list }}
        columns={finnalyColumns}
        rowKey={({ seqId, id }) => (`rowKey-${seqId || id || 'key'}`)}
        onSelectRow={this.handleSelectRows}
        onChange={this.handleStandardTableChange}
        {...otherProps}
      />
    );
    if (tab) {
      table = (
        <Tabs activeKey={tab.activeKey} onChange={tab.onChange}>
          {
            _.map(tab.tabs, item => (
              <TabPane {...item}>
                {filterMode === 'inner-tabs' ? filterPane : null}
                {table}
              </TabPane>
            ))
          }
        </Tabs>
      );
    }


    const tableToExport = (
      (hasExportExcel) ? (
        <div style={{ display: 'none' }}>
          <div id="table-to-export">
            <tr>
              <td style={{ textAlign: 'center' }}>{caption}</td>
              <td colspan={columns.length - 2} style={{ fontSize: 18, textAlign: 'center', fontWeight: 800 }}>{download}</td>
              <td style={{ textAlign: 'center' }}>{subCaption}</td>
            </tr>
            <Table
              rowKey={({ seqId, id }) => (`rowKey-${seqId || id || 'key'}`)}
              loading={loading}
              dataSource={list}
              columns={newColumns}
              pagination={false}
            />
          </div>

        </div>
      ) : null
    );

    const tableToPrint = (
      (hasPrintOpr) ? (
        <div style={{ display: 'none' }}>
          <div ref={el => (this.printRef = el)}>
            {_.map(printList, (item, index) => {
              let printColumns = _.cloneDeep(newColumns);
              const hasIndex = _.findIndex(printColumns, (item) => item.key === 'index');

              if (hasIndex > -1) {
                printColumns[hasIndex].render = (text, record, itemIndex) => index * linePrePage + itemIndex + 1;
              }

              return (
                <div key={index} className={styles.printPage}>
                  <h3 className={styles.pageTitle}>{download}</h3>
                  <div className={styles.hospitalInfo}>
                    <span>{caption}</span>
                    <span>{subCaption}</span>
                  </div>
                  <Table
                    rowKey={({ seqId, id }) => (`rowKey-${seqId || id || 'key'}`)}
                    loading={loading}
                    bordered
                    dataSource={item}
                    columns={printColumns}
                    pagination={false}
                  />
                  <div className={styles.pageNumber}>{index + 1} / {printTotalPage}</div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null
    );

    return (
      <PageHeaderLayout title={title}>
        { filterMode === 'header-pane' ? (
          <div className={styles.headerPane}>{filterFormElt}</div>
        ) : null }
        <Card bordered={false}>
          <div className={styles.tableList}>
            {filterMode !== 'inner-tabs' ? filterPane : null}
            {table}
            {tableToExport}
            {tableToPrint}
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

TableLayout.Filters = Filters;
