/**
 * Created by Simon on 2017/6/25 0025.
 */
import React from 'react';

import { Tag, Input, Tooltip, Button } from 'antd';

class EditableTagGroup extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  handleClose = (removedTag) => {
    const tags = this.props.value.filter(tag => tag !== removedTag);
    if (this.props.onChange) {
      this.props.onChange(tags);
    }
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { value: tags = [] } = this.props;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    if (this.props.onChange) {
      this.props.onChange(tags);
    }

    this.setState({
      inputValue: '',
      inputVisible: false,
    });
  }

  saveInputRef = (input) => {
    this.input = input;
  }

  render() {
    const { inputVisible, inputValue } = this.state;
    const {
      value: tags,
    } = this.props;

    const tagsElts = (tags || []).map((tag) => {
      const isLongTag = tag.length > 20;
      const tagElem = (
        <Tag key={tag} closable afterClose={() => this.handleClose(tag)}>
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </Tag>
      );
      return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
    });

    return (
      <div>
        {tagsElts}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 添加</Button>}
      </div>
    );
  }
}

export default EditableTagGroup;
