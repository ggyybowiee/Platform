import HospitalSelect from './HospitalSelect';

export default {
  form: {
    formSetting: {
      isShowLabel: true,
      isAutoSubmit: false,
      formItemLayout: {
        labelCol: {
          span: 4
        },
        wrapperCol: {
          span: 16
        }
      }
    },
    elements: [{
      id: 1,
      field: {
        name: 'hosCode',
        label: '医院',
        rules: [{ required: true }]
      },
      input: {
        type: 'custom',
        Comp: HospitalSelect,
      }
    }, {
      id: 2,
      field: {
        name: 'hosImagePath',
        label: '医院横幅',
      },
      input: {
        type: 'image',
        uploadType: 'setting',
      }
    }, {
      id: 3,
      field: {
        name: 'hosIconPath',
        label: '标识',
      },
      input: {
        type: 'image',
        uploadType: 'setting',
      }
    },],
    layout: {
      type: 'grid',
      detail: [[1], [2], [3]]
    }
  }
};
