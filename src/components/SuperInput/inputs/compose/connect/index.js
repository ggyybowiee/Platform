import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import dataTransform from 'services/dataTransform';
import SuperInput from '../../../SuperInput';

function mapConnectProps(state, connectProps) {
  return _.mapValues(connectProps, ({ path, dataTransforms }, key) => {
    const value = _.get(state, path);

    return dataTransform(dataTransforms)(value);
  });
}

class InputConnectWrap extends React.Component {
  render() {
    const { connectedProps, Comp, ...otherProps } = this.props;
    return (
      <Comp {...otherProps} {...connectedProps} />
    );
  }
}

class ConnectInput extends React.Component {
  state = {
    Comp: null,
  }

  constructor(props) {
    super(props);

    this.state.Comp = this.updateConnectedComp(props);
  }

  componentWillUpdate(prevProps) {
    if (!_.isEqual(prevProps.connectProps, this.props.connectProps)) {
      this.updateConnectedComp(prevProps);
    }
  }

  updateConnectedComp(props) {
    const { compType, connectProps, withClear } = props || this.props;
    const Comp = compType ? SuperInput.CompMap[withClear ? 'withClear' : compType] : SuperInput.DefaultComp;

    const StateComp = !_.isEmpty(connectProps)
      ? connect(state => ({ ...mapConnectProps(state, connectProps), Comp }))(InputConnectWrap)
      : Comp;
    this.setState({
      Comp: StateComp,
    });
    return StateComp;
  }

  render() {
    const {
      type,
      connectProps,
      compType,
      ...inputProps
    } = this.props;
    const { Comp } = this.state;

    return (
      <Comp {...inputProps} compType={compType} />
    );
  }
}

ConnectInput.info = {
  name: 'Connect：连接store',
  category: '特殊',
};

ConnectInput.validatorRules = [{
  type: 'any',
}];

ConnectInput.structure = {
  type: 'any',
};

export default ConnectInput;
