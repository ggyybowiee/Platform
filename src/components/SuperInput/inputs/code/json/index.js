/**
 * Created by Simon on 2017/6/27 0027.
 */
import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import _ from 'lodash';

import 'brace/mode/json';
import 'brace/theme/ambiance';

class Json extends React.Component {
  // handleChange = v => {
  //   this.props.onChange && this.props.onChange(v ? JSON.parse(v) : null)
  // }

  render() {
    const { value, onChange, height = 300, ...props } = this.props;
    return (
      <AceEditor
        mode="json"
        theme="ambiance"
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{
          height,
          width: '100%',
        }}
        onChange={onChange}
        name={props.id}
        value={value || props.defaultValue}
        editorProps={{$blockScrolling: true}}
      />
    );
  }
}

Json.validatorRules = [{ type: 'string' }];

Json.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },

  style: {
    showName: '样式',
    type: 'json',
    defaultValue: JSON.stringify({ height: 100 }, null, '\t'),
  },
};

Json.info = {
  name: 'JSON',
  category: '代码',
};

Json.structure = {
  type: 'string',
};

export default Json;
