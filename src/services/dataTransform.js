import _ from 'lodash';

export default (transformConfigs) => data => {
  return _.reduce(transformConfigs, (resultData, transformConfig) => {
    let transform;

    if (_.isFunction(transformConfig.type)) {
      transform = transformConfig.type;
    } else if(_[transformConfig.type]) {
      transform = _[transformConfig.type];
    }

    const args = _.isFunction(transformConfig.args) ? transformConfig.args() : (transformConfig.args || []);

    return transform(resultData, ...args);
  }, data);
}
