export default {
  "formSetting": {
      "isShowLabel": true,
      "isAutoSubmit": false,
      "isLabelInline": false,
      "formItemLayout": {
          "labelCol": {
              "span": 4
          },
          "wrapperCol": {
              "span": 16
          }
      }
  },
  "elements": [
      {
          "field": {
              "label": "系统",
              "name": "system",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "string",
              "disabled": false
          },
          "id": 0
      },
      {
          "field": {
              "label": "编码",
              "name": "configCode",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "string",
              "disabled": false
          },
          "id": 1
      },
      {
          "field": {
              "label": "启用",
              "name": "status",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "boolean",
              "disabled": false,
              "valueMap": {
                "true": "01",
                "false": "02"
              }
          },
          "id": 2
      },
      {
          "field": {
              "label": "类型",
              "name": "configType",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "string",
              "disabled": false
          },
          "id": 3
      },
      {
          "field": {
              "label": "描述",
              "name": "configDesc",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "textArea",
              "disabled": false
          },
          "id": 4
      },
      {
          "field": {
              "label": "值",
              "name": "configValue",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "javascript",
              "disabled": false
          },
          "id": 5
      }
  ],
  "layout": {
      "type": "grid",
      "detail": [
          [
              0
          ],
          [
              1
          ],
          [
              2
          ],
          [
              3
          ],
          [
              4
          ],
          [
              5
          ]
      ]
  }
}
