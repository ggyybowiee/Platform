import React, { Component } from 'react';
import classNames from 'classnames';
import { Tag, Icon } from 'antd';

import styles from './index.less';

const { CheckableTag } = Tag;

const TagSelectOption = ({ children, checked, onChange, value, onAfterChange }) => (
  <CheckableTag className={styles.tagSelect__item} checked={checked} key={value} onChange={state => onChange(value, state, onAfterChange)}>
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

class TagSelect extends Component {
  state = {
    expand: false,
    value: this.props.value || this.props.defaultValue || [],
  };

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (value) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  };

  onSelectAll = (checked) => {
    const { selecteAllType } = this.props;

    let checkedTags = [];

    if (checked && selecteAllType === 'all') {
      checkedTags = this.getAllTags();
    } else {
      checkedTags = [];
    }

    this.onChange(checkedTags);
    this.props.onAfterChange(checkedTags);
  };

  getAllTags() {
    let { children } = this.props;
    children = React.Children.toArray(children);
    const checkedTags = children
      .filter(child => this.isTagSelectOption(child))
      .map(child => child.props.value);
    return checkedTags || [];
  }

  handleTagChange = (value, checked, onAfterChange) => {
    let checkedTags = [...this.state.value];
    const { multiple } = this.props;

    const index = checkedTags.indexOf(value);
    if (checked && index === -1) {
      if (typeof multiple === 'undefined' || !multiple) {
        checkedTags = [value];
      } else {
        checkedTags.push(value);
      }
    } else if (!checked && index > -1) {
      checkedTags.splice(index, 1);
    }
    this.onChange(checkedTags);

    onAfterChange(checkedTags, finalValue => this.setState({ value: finalValue }));
  };

  handleExpand = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  handleExtraChange = (value) => {
    this.setState({
      value: [value],
      extraValue: value,
    });
  }

  isTagSelectOption = node => {
    return (
      node &&
      node.type &&
      (node.type.isTagSelectOption || node.type.displayName === 'TagSelectOption')
    );
  };

  render() {
    const { value, expand } = this.state;
    const { children, className, style, expandable, selecteAllType, allText = '全部', extra, onAfterChange } = this.props;

    const checkedAll = selecteAllType === 'all' ? this.getAllTags().length === value.length : value.length === 0;

    const cls = classNames(styles.tagSelect, className, {
      [styles.hasExpandTag]: expandable,
      [styles.expanded]: expand,
    });
    return (
      <div className={cls} style={style}>
        <CheckableTag checked={checkedAll} className={styles.tagSelect__item} key="tag-select-__all__" onChange={this.onSelectAll}>
          {allText}
        </CheckableTag>
        {value &&
          React.Children.map(children, (child) => {
            if (this.isTagSelectOption(child)) {
              return React.cloneElement(child, {
                key: `tag-select-${child.props.value}`,
                value: child.props.value,
                checked: value.indexOf(child.props.value) > -1,
                onChange: this.handleTagChange,
                onAfterChange,
              });
            }
            return child;
          })}
        <div className={styles.extra}>
          {extra && (
            extra(this.handleExtraChange)
          )}
        </div>
        {expandable && (
          <a className={styles.trigger} onClick={this.handleExpand}>
            {expand ? '收起' : '展开'} <Icon type={expand ? 'up' : 'down'} />
          </a>
        )}
      </div>
    );
  }
}

TagSelect.Option = TagSelectOption;

export default TagSelect;
