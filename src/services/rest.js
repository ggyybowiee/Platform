import { mapValues, merge } from 'lodash/fp';
import Rest from '../utils/Rest';

const context = require.context('./', false, /\.js$/);

const prefix = 'ITAuth';

const files = context
                .keys()
                .filter(item => item !== './index.js')
                .map(key => context(key).default);

function createRest(url) {
  return new Rest(`${prefix}${url}`);
}

const apis = files.reduce((start, end) =>  merge(start)(end));

export default (() => mapValues(url => createRest(url))(apis))();
