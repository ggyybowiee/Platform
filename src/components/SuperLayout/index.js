import React from 'react';
import LayoutSelector from './LayoutSelector';

const context = require.context('./layouts/', true, /^\.\/(\w+)\/index.js/);

const layouts = _.chain(context.keys())
  .mapKeys((path) => path.match(/^\.\/(\w+)\/index.js/)[1].toLowerCase())
  .mapValues(path => context(path).default)
  .value();

const SuperLayout = ({ type, mode = 'render', elements, detail, ...otherProps }) => {
  const layout = layouts[type];
  if (!layout) {
    return <div>不支持的布局!!</div>
  }

  const Comp = layout[mode === 'design' ? 'Design' : 'Render'];

  const resultDetail = detail || SuperLayout.initDetail(type, elements);

  return (
    <Comp {...otherProps} elements={elements} detail={resultDetail} />
  );
};

SuperLayout.layouts = layouts;

SuperLayout.LayoutSelector = LayoutSelector;

SuperLayout.initDetail = (layoutType, elements) =>
  layouts[layoutType] && layouts[layoutType].initDetail
  ? layouts[layoutType].initDetail(elements)
  : []; // TODO: 默认空数组是否会有bug？

export default SuperLayout;
