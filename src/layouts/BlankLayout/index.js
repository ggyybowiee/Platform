import React from 'react';
import { connect } from 'dva';

const Blank = props => {
  const urlParams = new URL(window.location.href);
  const redirect = urlParams.searchParams.get('redirect');

  if (redirect && _.get(this.props, 'auth.isLogined')) {
    urlParams.searchParams.delete('redirect');
    window.history.replaceState(null, 'redirect', urlParams.href);
  }

  return <div {...props} />;
};

export default connect((state) => ({
  auth: _.get(state, 'auth'),
}))(Blank);

