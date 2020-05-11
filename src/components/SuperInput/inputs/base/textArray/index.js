/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';
import EditableTagGroup from '../../../components/EditableTagGroup';
import SelectTags from '../../../components/SelectTags';

class ArrayInput extends React.Component {
  render() {
    const { mode = 'tags', ...props } = this.props;
    const Comp = mode === 'select' ? SelectTags : EditableTagGroup;

    return (
      <Comp {...props} />
    );
  }
}

ArrayInput.validatorRules = [{
  type: 'array',
}]

ArrayInput.info = {
  name: '字符串',
  category: '集合',
};

ArrayInput.structure = {
  // TODO
  type: 'string',
};

export default ArrayInput;
