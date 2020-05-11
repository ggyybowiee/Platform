import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Exception from 'components/Exception';

@connect(state => ({
  loadedModules: _.get(state, 'module.loadedModules'),
}))
class NotFoundException extends React.Component {

  render() {
    const { loadedModules, location, empty } = this.props;
    const pathnameMatched = location.pathname.match(/\/([^\/]+)\//);
    const renderingModule = pathnameMatched && pathnameMatched[1];

    if (!loadedModules[renderingModule] && _.isNil(empty)) {
      return (
      <Exception type="module-loading" style={{ minHeight: 500, height: '80%' }} linkElement={() => <span />} />
      );
    }

    return (
      <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
    );
  }
}

export default (props) => (
  <NotFoundException {...props} />
)
