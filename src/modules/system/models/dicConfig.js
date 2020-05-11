import createSimpleRestModel from 'utils/createSimpleRestModel';

export default createSimpleRestModel({
  namespace: 'dicConfig',
  idField: 'seqId',
  displayField: 'description',

  getUrls(type, record) {
    if (type === 'delete') {
      return `/sys/sysDic/${record.seqId}`;
    }
    return '/sys/sysDic';
  },

  resolves: {
    fetchList: (resp) => {
      return {
        list: resp.queryResult
      };
    },
  },
});

