# 简介

# 安装

```bash
$ npm i
```

# 使用mock数据启动

```bash
$ npm start
```

# 正常启动

```bash
$ npm run start:no-proxy
```

# 构建

```bash
$ npm run build
```

# 配置模块

## 配置方式：
在html里加载js文件或者script标签，内容如下：
```
  window.moduleConfig = {
    [模块名]: {
      [配置项名]: [配置值]
    },
    // 例子:
    message: {
      messageTranform: (msg) => ({
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: '你推荐的 曲妮妮 已通过第三轮面试',
        datetime: '2017-08-08',
        type: '通知',
        code: 'notify',
      })
    }
  }
```
## 内置模块配置项：
- **Auth**:
  - path
    - 登录提交路径，字符串
    - 默认：'/auth/tokens'
  - fieldsMap
    - 登录字段配置，对象，key为提交字段，value为页面绑定字段，可选（username, password）
    - 默认：{ userCode: 'username', password: 'password' }
- **Message**
  - messageTranform
    - 消息转换器，函数
    - 函数签名：(msg) => ({ id, avatar, title, datetime, code })

## 构建说明
### 模块构建
- 如果模块仓库是一个本地目录，模块构建以后，需要调用 ```node ./node_modules/platform/scripts/registerModulesHubConfig.js --dir=[本地仓库名称] [模块名]```, 例如：```node ./scripts/registerModulesHubConfig.js --dir=E:\\platform-modules-hub ldmCloud```
- 如果模块仓库是后端提供的，模块构建以后，需要调用 ```node ./node_modules/platform/scripts/registerModulesHubConfig.js --url=[仓库restful地址] [模块名]``` **(暂时没有实现)**

## 其他说明
- **Redux dev/tool** 未打开
  - 由于dva默认production环境下不开启，故而打包vendor时，未开启
  - 解决：修改 **node_modules/dva-core/lib/createStore.js**，搜索**__REDUX_DEVTOOLS_EXTENSION__**，删除**process.env.NODE_ENV !== 'production' &&**，然后重新buildDlls,重新运行即可
