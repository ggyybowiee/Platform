const fs = require('fs');
const babel = require('babel-core');
const transformEsCode = require('./codeTransformServer/lib/transform');
const babelConfig =  {
  "presets": [
    "es2015",
    "react",
    "stage-0"
  ],
  "plugins": []
};

import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'POST /api/transformEsCode': (req, res) => {
    try {
      res.send({
        code: transformEsCode(req.body.code),
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  'POST /ITAuth/tokens': {
    $desc: '登录',
    $body: {
      "seqId": null,
      "userCode": "123",
      "tokenContent": "nizb2D6zB/wPA9xJGciDSv/JvgQ86/XO+Sj0VxdOrFmbhr6rL3awtoToydIw6oys",
      "expiredate": "2018-05-19T14:24:18.514+0800",
      "isvalid": null,
      "ipaddress": null,
      "ismobile": null,
      "userName": "演示账号",
      "roles": [
        {
          "seqId": 1,
          "roleCode": "adminas",
          "roleName": "管理员",
          "createTime": "2017-01-16T15:30:19.000+0800",
          "createPerson": "string",
          "updateTime": "2017-01-16T15:30:19.000+0800",
          "updatePerson": "string"
        },
        {
          "seqId": 2,
          "roleCode": "coms",
          "roleName": "手术室护士",
          "createTime": "2017-04-11T11:21:28.000+0800",
          "createPerson": "test",
          "updateTime": "2017-04-11T11:21:28.000+0800",
          "updatePerson": "test"
        },
        {
          "seqId": 3,
          "roleCode": "lachesis-sales",
          "roleName": "联新销售人员",
          "createTime": "2017-04-26T12:30:58.000+0800",
          "createPerson": "test",
          "updateTime": "2017-04-26T12:30:58.000+0800",
          "updatePerson": "test"
        },
        {
          "seqId": 4,
          "roleCode": "nurse",
          "roleName": "病区护士",
          "createTime": "2017-05-05T20:48:46.000+0800",
          "createPerson": "test",
          "updateTime": "2017-05-05T20:48:46.000+0800",
          "updatePerson": "test"
        },
        {
          "seqId": 5,
          "roleCode": "doctor",
          "roleName": "普通医生",
          "createTime": "2017-05-07T14:46:29.000+0800",
          "createPerson": "test",
          "updateTime": "2017-05-07T14:46:29.000+0800",
          "updatePerson": "test"
        },
        {
          "seqId": 6,
          "roleCode": "leadNurse",
          "roleName": "护士长",
          "createTime": "2018-01-02T13:26:44.000+0800",
          "createPerson": "test",
          "updateTime": "2018-01-03T13:26:51.000+0800",
          "updatePerson": "test"
        },
        {
          "seqId": 7,
          "roleCode": "pharmacist",
          "roleName": "药剂师",
          "createTime": "2018-01-25T15:39:42.000+0800",
          "createPerson": "admin",
          "updateTime": null,
          "updatePerson": ""
        },
        {
          "seqId": 8,
          "roleCode": "security",
          "roleName": "安保人员",
          "createTime": "2018-04-28T14:29:40.000+0800",
          "createPerson": "test",
          "updateTime": "2018-04-28T14:29:40.000+0800",
          "updatePerson": "test"
        }
      ],
      "sysUserRoleMapping": [
        {
          "seqId": 39,
          "userCode": "123",
          "roleCode": "adminas",
          "expireTime": null,
          "startTime": null,
          "createTime": "2017-05-11T16:10:29.000+0800",
          "createPerson": "test",
          "updateTime": "2017-05-11T16:10:29.000+0800",
          "updatePerson": "test",
          "userName": "演示账号",
          "roleName": "管理员"
        },
        {
          "seqId": 34,
          "userCode": "123",
          "roleCode": "coms",
          "expireTime": null,
          "startTime": null,
          "createTime": "2017-05-07T14:48:58.000+0800",
          "createPerson": "test",
          "updateTime": "2017-01-16T15:30:19.000+0800",
          "updatePerson": "test",
          "userName": "演示账号",
          "roleName": "手术室护士"
        },
        {
          "seqId": 32,
          "userCode": "123",
          "roleCode": "lachesis-sales",
          "expireTime": null,
          "startTime": null,
          "createTime": "2017-05-07T14:47:44.000+0800",
          "createPerson": "test",
          "updateTime": "2017-05-07T14:47:44.000+0800",
          "updatePerson": "test",
          "userName": "演示账号",
          "roleName": "联新销售人员"
        },
        {
          "seqId": 129,
          "userCode": "123",
          "roleCode": "nurse",
          "expireTime": null,
          "startTime": null,
          "createTime": "2018-02-26T14:22:28.000+0800",
          "createPerson": "0027",
          "updateTime": "2018-02-26T14:25:09.000+0800",
          "updatePerson": "0027",
          "userName": "演示账号",
          "roleName": "病区护士"
        },
        {
          "seqId": 31,
          "userCode": "123",
          "roleCode": "doctor",
          "expireTime": null,
          "startTime": null,
          "createTime": "2017-05-07T14:47:43.000+0800",
          "createPerson": "test",
          "updateTime": "2017-05-07T14:47:43.000+0800",
          "updatePerson": "test",
          "userName": "演示账号",
          "roleName": "普通医生"
        },
        {
          "seqId": 63,
          "userCode": "123",
          "roleCode": "leadNurse",
          "expireTime": null,
          "startTime": null,
          "createTime": "2018-01-03T13:24:13.000+0800",
          "createPerson": "test",
          "updateTime": "2018-01-03T13:24:16.000+0800",
          "updatePerson": "test",
          "userName": "演示账号",
          "roleName": "护士长"
        },
        {
          "seqId": 68,
          "userCode": "123",
          "roleCode": "pharmacist",
          "expireTime": null,
          "startTime": null,
          "createTime": "2018-02-07T11:14:46.000+0800",
          "createPerson": "admin",
          "updateTime": null,
          "updatePerson": "",
          "userName": "演示账号",
          "roleName": "药剂师"
        },
        {
          "seqId": 145,
          "userCode": "123",
          "roleCode": "security",
          "expireTime": null,
          "startTime": null,
          "createTime": "2018-05-09T13:17:19.000+0800",
          "createPerson": "123",
          "updateTime": "2018-05-09T13:15:47.000+0800",
          "updatePerson": "test",
          "userName": "演示账号",
          "roleName": "安保人员"
        }
      ]
    },
  },
  // GET POST 可省略
  'GET /ITAuth/records': [
    {
      id: '1',
      theme: '南孚电池变更',
      proposer: '周杰伦',
      applyDate: '2018-05-09 16:30:45',
      priority: '紧急',
      status: '品质审批',
      suggestion: '生产同意',
    },
    {
      id: '2',
      theme: '南孚电池变更',
      proposer: '周杰伦',
      applyDate: '2018-05-09 16:30:45',
      priority: '紧急',
      status: '品质审批',
      suggestion: '生产同意',
    },
    {
      id: '3',
      theme: '南孚电池变更',
      proposer: '周杰伦',
      applyDate: '2018-05-09 16:30:45',
      priority: '紧急',
      status: '品质审批',
      suggestion: '生产同意',
    },
    {
      id: '4',
      theme: '南孚电池变更',
      proposer: '周杰伦',
      applyDate: '2018-05-09 16:30:45',
      priority: '紧急',
      status: '品质审批',
      suggestion: '生产同意',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
