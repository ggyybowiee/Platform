export default resources => ({
    "formSetting": {
        "isShowLabel": false,
        "isAutoSubmit": false,
    },
    "elements": [
        {
            "field": {
                "label": "模块",
                "name": "moduleCode",
                "rules": [
                    {
                        "required": true
                    }
                ]
            },
            "input": {
                "type": "enum",
                "enumType": "radio",
                "options": _.map(resources, resource => ({
                  label: resource.resourceName,
                  value: resource.resourceCode,
                }))
            },
            "id": 0
        }
    ],
    "layout": {
        "type": "grid",
        "detail": [
            [
                0
            ]
        ]
    }
});
