import React, { Component } from 'react';
import { connect } from 'dva';
import { Link }  from 'dva/router';
import { Collapse, Card } from 'antd';
import _ from 'lodash';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import Ellipsis from 'components/Ellipsis';
import { callHooks } from '../../common/hooks';

const Panel = Collapse.Panel;

const DefaultAppItem = ({ info }) => (
  <Card hoverable>
    <Card.Meta
      //avatar={<img alt={info.title} src={info.icon} />}
      title={<a href="#">{info.title}</a>}
      description={
        <Ellipsis className={info.item} lines={3}>
          {info.description}
        </Ellipsis>
      }
    />
  </Card>
  // <div>
  //   <img src={info.icon} alt={info.title} />
  //   <span>{info.title}</span>
  //   <span>{info.symbol}</span>
  //   <span>{info.version}</span>
  // </div>
);

const DefaultAppGroupPanel = (panel) => (
  <ul>
    {
      _.map(panel.modules, (m, index) => {
        const { name, info = {} } = m;
        const AppItem = info.Comp || DefaultAppItem;

        return (
          <li key={index} title={info.description} className={info.className} style={info.style}>
            <Link to={`/${name}`}>
              <AppItem {...m} />
            </Link>
          </li>
        )
      })
    }
  </ul>
);

@connect(({ module }) => ({
  loadedModules: module.loadedModules,
}))
export default class Index extends Component {
  state = {
    panels: [],
  }

  componentDidMount() {
    this.resolvePanels();
  }

  componentWillUpdate(nextProps) {
    if (this.props.loadedModules !== nextProps.loadedModules) {
      this.resolvePanels();
    }
  }

  resolvePanels() {
    const { loadedModules } = this.props;
    const injects = getInjects(loadedModules).index || [];
    const appGroups = _.chain(loadedModules)
      .reject('info.hide')
      .groupBy('info.group')
      .map((modules, groupName) => ({
        order: 1,
        group: groupName,
        Comp: DefaultAppGroupPanel,
        modules,
      }))
      .value();

    const panels = _.sortBy([...injects, ...appGroups], 'order');
    callHooks('dashboardIndex-panels', panels)
      .then(([ resultPanels ]) => {
        this.setState({
          panels: _.filter(resultPanels, item => item.modules && item.modules.length),
        });
      });
  }

  render() {
    const { panels } = this.state;

    return (
      <div>
        <Collapse bordered={false} defaultActiveKey={_.map(panels, 'group')}>
          {
            _.map(panels, (panel) => {
              const { Comp } = panel;
              return (
                <Panel header={panel.group} key={panel.group} {...panel}>
                  {Comp ? <Comp {...panel} /> : panel.comp}
                </Panel>
              );
            })
          }
        </Collapse>
      </div>
    )
  }
}

function getInjects(modules) {
  const injects = _.chain(modules)
    .filter('dashboardInject')
    .map('dashboardInject')
    .value();
  const injectKeys = _.chain(injects)
    .map(_.keys)
    .flatten()
    .value();

  return _.chain(injectKeys)
    .mapKeys(_.identity)
    .mapValues(key => {
      const partialinjects = _.map(injects, key);
      return _.flatten(partialinjects);
    })
    .value();
}
