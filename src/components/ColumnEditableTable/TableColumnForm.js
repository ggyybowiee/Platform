import React from 'react';
import JsonForm from 'components/JsonForm';

const CONFIG = {
  "elements": [
   {
    "field": {
     "label": "title",
     "name": "title"
    },
    "input": {
     "type": "string",
     "placeholder": "标题"
    },
    "id": 0,
    "readonly": false
   },
   {
    "field": {
     "label": "dataIndex",
     "name": "dataIndex"
    },
    "input": {
     "type": "string",
     "placeholder": "值索引"
    },
    "id": 1,
    "readonly": false
   },
   {
    "field": {
     "label": "key",
     "name": "key"
    },
    "input": {
     "type": "string",
     "placeholder": "列唯一标识"
    },
    "id": 2,
    "readonly": false
   },
   {
    "field": {
     "label": "是否渲染元素",
     "name": "isRenderElement",
     "initialValue": false
    },
    "input": {
     "type": "boolean",
    },
    "id": 3,
    "readonly": false
   },
   {
    "field": {
     "label": "渲染函数",
     "name": "renderScript",
     "initialValue": false
    },
    "input": {
     "type": "cmdModuleDefine",
    },
    "id": 4,
    "readonly": false
   }
  ],
  "formSetting": {
    "formItemLayout": {
      "labelCol": {
        "span": 7,
      },
      "wrapperCol": {
        "span": 12,
      }
    }
  },
  "layout": {
    "type": "grid",
    "detail": [
      [ 0 ], [ 1 ], [ 2 ], [ 3 ], [ 4 ]
    ]
  }
 };

export default ({ column, onSubmit }) => (
  <JsonForm {...CONFIG} data={column} onSubmit={onSubmit} />
);
