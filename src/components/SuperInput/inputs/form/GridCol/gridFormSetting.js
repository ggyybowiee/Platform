export default {
  "formSetting": {
    "isShowLabel": false,
    "isShowSubmit": false,
    "isAutoSubmit": true
  },
  "layout": {
    "type": "statictable",
    "detail": {
      "rows": [
          {
              "span": "0-span",
              "offset": "0-offset",
              "pull": "0-pull",
              "push": "0-push"
          },
          {
              "span": "1-span",
              "offset": "1-offset",
              "pull": "1-pull",
              "push": "1-push"
          },
          {
              "span": "2-span",
              "offset": "2-offset",
              "pull": "2-pull",
              "push": "2-push"
          },
          {
              "span": "3-span",
              "offset": "3-offset",
              "pull": "3-pull",
              "push": "3-push"
          },
          {
              "span": "4-span",
              "offset": "4-offset",
              "pull": "4-pull",
              "push": "4-push"
          },
          {
              "span": "5-span",
              "offset": "5-offset",
              "pull": "5-pull",
              "push": "5-push"
          },
          {
              "span": "6-span",
              "offset": "6-offset",
              "pull": "6-pull",
              "push": "6-push"
          }
      ],
      "columns": [
          {
              "title": "尺寸类型",
              "dataIndex": "sizeType",
              "dataKey": "field1",
              "renderScript": {
                  "source": "module.exports = (result, value, record, rowIndex) => (['全局', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'])[rowIndex]",
                  "code": "'use strict';\n\n(function () {\n  var exports = {};\n  var module = { exports: exports };\n  (function (module, exports) {\n    module.exports = function (result, value, record, rowIndex) {\n      return ['全局', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'][rowIndex];\n    };\n  })(module, exports);\n\n  return module.exports;\n})();"
              },
              "key": "sizeType",
              "isRenderElement": false
          },
          {
              "title": "占位格数",
              "dataIndex": "span",
              "dataKey": "field2",
              "key": "span",
              "isRenderElement": false
          },
          {
              "title": "左侧留白隔格数",
              "dataIndex": "offset",
              "key": "offset",
              "isRenderElement": false
          },
          {
              "title": "向左移动格数",
              "dataIndex": "pull",
              "key": "pull",
              "isRenderElement": false
          },
          {
              "title": "右移动格数",
              "dataIndex": "push",
              "key": "push",
              "isRenderElement": false
          }
      ]
    }
  },
  "elements": [
      {
          "field": {
              "label": "span",
              "name": "span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "0-span",
          "readonly": false
      },
      {
          "field": {
              "label": "xs.span",
              "name": "xs.span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "1-span",
          "readonly": false
      },
      {
          "field": {
              "label": "sm.span",
              "name": "sm.span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "2-span",
          "readonly": false
      },
      {
          "field": {
              "label": "md.span",
              "name": "md.span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "3-span",
          "readonly": false
      },
      {
          "field": {
              "label": "lg.span",
              "name": "lg.span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "4-span",
          "readonly": false
      },
      {
          "field": {
              "label": "xl.span",
              "name": "xl.span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "5-span",
          "readonly": false
      },
      {
          "field": {
              "label": "xxl.span",
              "name": "xxl.span"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "6-span",
          "readonly": false
      },
      {
          "field": {
              "label": "offset",
              "name": "offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "0-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "xs.offset",
              "name": "xs.offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "1-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "sm.offset",
              "name": "sm.offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "2-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "md.offset",
              "name": "md.offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "3-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "lg.offset",
              "name": "lg.offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "4-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "xl.offset",
              "name": "xl.offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "5-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "xll.offset",
              "name": "xll.offset"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "6-offset",
          "readonly": false
      },
      {
          "field": {
              "label": "pull",
              "name": "pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "0-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "xs.pull",
              "name": "xs.pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "1-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "sm.pull",
              "name": "sm.pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "2-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "md.pull",
              "name": "md.pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "3-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "lg.pull",
              "name": "lg.pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "4-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "xl.pull",
              "name": "xl.pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "5-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "xxl.pull",
              "name": "xxl.pull"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "6-pull",
          "readonly": false
      },
      {
          "field": {
              "label": "push",
              "name": "push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "0-push",
          "readonly": false
      },
      {
          "field": {
              "label": "xs.push",
              "name": "xs.push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "1-push",
          "readonly": false
      },
      {
          "field": {
              "label": "sm.push",
              "name": "sm.push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "2-push",
          "readonly": false
      },
      {
          "field": {
              "label": "md.push",
              "name": "md.push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "3-push",
          "readonly": false
      },
      {
          "field": {
              "label": "lg.push",
              "name": "lg.push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "4-push",
          "readonly": false
      },
      {
          "field": {
              "label": "xl.push",
              "name": "xl.push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "5-push",
          "readonly": false
      },
      {
          "field": {
              "label": "xxl.push",
              "name": "xxl.push"
          },
          "input": {
              "type": "integer",
              "max": "24",
              "min": "0"
          },
          "id": "6-push",
          "readonly": false
      }
  ]
};
