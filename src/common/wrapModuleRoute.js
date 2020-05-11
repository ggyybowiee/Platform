import React, { Component } from 'react';
import { get, isEmpty } from 'lodash/fp';
import { connect } from 'dva';

export default (RouteComp, moduleName) => {
  @connect(state => ({
    currentModule: state.module.currentModule,
  }))
  class ModuleRouteWrap extends Component {
    componentDidMount() {
      const { currentModule, dispatch } = this.props;

      if (moduleName !== (currentModule && currentModule.name)) {
        dispatch({
          type: 'module/turnCurrentModule',
          payload: moduleName,
        });
      }

      if (moduleName !== (currentModule && currentModule.name) || !isEmpty(RouteComp.fragments)) {
        dispatch({
          type: 'module/setPageFragments',
          payload: {
            moduleName,
            pageFragments: RouteComp.fragments,
          },
        });
      }
    }

    render() {
      return (
        <RouteComp {...this.props} />
      );
    }
  }

  return ModuleRouteWrap;
}
