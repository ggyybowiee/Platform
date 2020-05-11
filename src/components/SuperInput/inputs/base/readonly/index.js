import React from 'react'

class Readonly extends React.Component {
  render() {
    const { value } = this.props
    let valueStr = value
    if (typeof value === 'object') {
      valueStr = JSON.stringify(value)
    }
    return (
      <div>{valueStr || '无'}</div>
    )
  }
}

Readonly.info = {
  name: '只读文本',
  category: '其他',
};

Readonly.structure = {
  type: 'string',
};

export default Readonly
