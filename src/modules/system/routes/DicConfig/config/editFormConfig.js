export default {
  "formSetting": {
      "isShowLabel": true,
      "isAutoSubmit": false,
      "isLabelInline": false,
      "formItemLayout": {
          "labelCol": {
              "span": 6
          },
          "wrapperCol": {
              "span": 16
          }
      }
  },
  "elements": [
      {
          "field": {
              "label": "字典项编码",
              "name": "dicCode",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "string",
              "disabled": true
          },
          "id": 0
      },
      {
          "field": {
              "label": "字典项名称",
              "name": "dicName",
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
              "label": "字典项说明",
              "name": "description",
              "field": {
                  "rules": null
              }
          },
          "input": {
              "type": "string",
              "disabled": false
          },
          "id": 2
      },
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
          ]
      ]
  }
}
