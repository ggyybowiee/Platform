export default {
  "formSetting": {
      "isShowLabel": true,
      "isShowSubmit": false,
      "isAutoSubmit": true
  },
  "elements": [
      {
          "field": {
              "label": "栅格间隔",
              "name": "gutter"
          },
          "input": {
              "type": "float",
              "min": "0"
          },
          "id": 0,
          "readonly": false
      },
      {
          "field": {
              "label": "垂直对齐方式",
              "name": "align"
          },
          "input": {
              "type": "enum",
              "options": [
                  {
                      "label": "top",
                      "value": "top"
                  },
                  {
                      "label": "middle",
                      "value": "middle"
                  },
                  {
                      "label": "bottom",
                      "value": "bottom"
                  }
              ]
          },
          "id": 1,
          "readonly": false
      },
      {
          "field": {
              "label": "水平排列方式",
              "name": "justify"
          },
          "input": {
              "type": "enum",
              "options": [
                  {
                      "label": "start",
                      "value": "start"
                  },
                  {
                      "label": "end",
                      "value": "end"
                  },
                  {
                      "label": "center",
                      "value": "center"
                  },
                  {
                      "label": "space-around",
                      "value": "space-around"
                  },
                  {
                      "label": "space-between",
                      "value": "space-between"
                  }
              ]
          },
          "id": 2,
          "readonly": false
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
      ]
    ]
  }
};
