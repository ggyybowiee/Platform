import base64 from './base64';

const {
  utils: {
    request: { postApi },
  },
} = platform;

export default {
  async transformEsCode(esCode, moduleObject = {}) {
    const resp = await postApi('/transformEsCode', { code: esCode });
    const jsCode = resp.code;
    const moduleJsCode = `(function (module) {${jsCode}})`;
    const moduleFunction = eval(moduleJsCode);
    moduleFunction(moduleObject);
    return moduleObject;
  },
  base64,
};
