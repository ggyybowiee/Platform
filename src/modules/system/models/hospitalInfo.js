const {
  vendor: {
    fp: { get },
    antd: { message },
  },
  utils: {
    request: { getApi, postApi, putApi },
  },
} = platform;

export default {
  namespace: 'sysHospitalInfo',

  state: {
    hospitalInfo: null,
  },

  subscriptions: {
    setup({ dispatch }) {  // eslint-disable-line
      dispatch({
        type: 'fetchHospitalInfo',
      });
    }
  },

  effects: {
    *fetchHospitalInfo(action, { call, put }) {
      const resp = yield call(getApi, '/hospital/hosInfo/current');
      yield put({
        type: 'setHospitalInfo',
        payload: resp,
      });
      // const resp = yield call(getApi, '/sys/sysConfig');
      // const sysConfig = _.mapKeys(resp.queryResult, 'configCode');

      // yield put({
      //   type: 'setHospitalInfo',
      //   payload: {
      //     code: sysConfig.hospitalCode && sysConfig.hospitalCode.configValue,
      //     name: sysConfig.hospitalName && sysConfig.hospitalName.configValue,
      //     icon: sysConfig.hospitalIcon && sysConfig.hospitalIcon.configValue,
      //     bannerImage: sysConfig.hospitalImagePath && sysConfig.hospitalImagePath.configValue,
      //     _source: {
      //       code: sysConfig.hospitalCode || {
      //         configCode: 'hospitalCode',
      //         status: '01',
      //       },
      //       name: sysConfig.hospitalName || {
      //         configCode: 'hospitalName',
      //         status: '01',
      //       },
      //       icon: sysConfig.hospitalIcon || {
      //         configCode: 'hospitalIcon',
      //         status: '01',
      //       },
      //       bannerImage: sysConfig.hospitalImagePath || {
      //         configCode: 'hospitalImagePath',
      //         status: '01',
      //       },
      //     },
      //   },
      // });
    },

    *saveHospitalInfo({ payload: values }, { select, call, put }) {
      const hospitalInfo = yield select(get('sysHospitalInfo.hospitalInfo'));
      const resp = yield call(putApi, '/hospital/hosInfo', {
        ...hospitalInfo,
        ...values,
        hosIconPath: undefined,
        hosImagePath: undefined,
        hosIconAttachmentSeqid: values.hosIconPath,
        hosImageAttachmentSeqid: values.hosImagePath,
      });
      yield put({
        type: 'setHospitalInfo',
        payload: resp,
      });
      message.success('保存成功');

      // const { _source, ...hospitalInfo } = yield select(get('sysHospitalInfo.hospitalInfo'));
      // const resp = yield call(postApi, '/sys/hospital/image', { name: values.name, icon: values.icon, path: values.bannerImage });
      // yield put({
      //   type: 'fetchHospitalInfo',
      // });
      // const { _source, ...hospitalInfo } = yield select(get('sysHospitalInfo.hospitalInfo'));
      // const fieldsConfig = ['code', 'icon', 'bannerImage'];
      // const fieldsToUpdate = _.chain(fieldsConfig)
      //   .filter(field => (hospitalInfo[field] !== values[field]))
      //   .map(field => ({ ..._source[field], configValue: values[field] }))
      //   .value();
      // const fieldsRespList = yield (yield Promise.all(
      //   _.map(fieldsToUpdate, field => call(field.seqId ? putApi : postApi, '/sys/sysConfig', field))
      // ));
      // const fieldsRespMap = _.mapKeys(fieldsRespList, 'configCode');

      // yield put({
      //   type: 'setHospitalInfo',
      //   payload: _.defaults({
      //     code: fieldsRespMap.hospitalCode && fieldsRespMap.hospitalCode.configValue,
      //     name: fieldsRespMap.hospitalName && fieldsRespMap.hospitalName.configValue,
      //     icon: fieldsRespMap.hospitalIcon && fieldsRespMap.hospitalIcon.configValue,
      //     bannerImage: fieldsRespMap.hospitalImagePath && fieldsRespMap.hospitalImagePath.configValue,
      //     _source: _.defaults({
      //       code: fieldsRespMap.hospitalCode,
      //       name: fieldsRespMap.hospitalName,
      //       icon: fieldsRespMap.hospitalIcon,
      //       bannerImage: fieldsRespMap.hospitalImagePath,
      //     }, _source)
      //   }, hospitalInfo),
      // });
    },
  },

  reducers: {
    setHospitalInfo(state, { payload: hospitalInfo }) {
      return {
        ...state,
        hospitalInfo,
      };
    },
  },
};
