function register(moduleDefine) {
  window.platform.app.registerModule(moduleDefine);
}

function tryRegister(moduleDefine) {
  setTimeout(() => {
    if (window.platform.app && window.platform.app.registerModule) {
      register(moduleDefine);
    } else {
      tryRegister(moduleDefine);
    }
  }, 300);
}

export default function (moduleDefine) {
  console.log(`%c 模块 "${moduleDefine.name}" 加载完毕`, 'background: #f6ffed; border: 1px solid #b7eb8f; color: #555');
  tryRegister(moduleDefine);
};
