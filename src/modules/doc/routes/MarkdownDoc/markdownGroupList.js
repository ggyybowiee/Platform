import base64 from '../../services/base64';

const markdownContext = require.context(process.env.PLATFORM_DIR, true, /.+\.doc\.md$/);

const markdownGroupList = _.chain(markdownContext.keys())
  .map(key => {
    const str = base64.decode(markdownContext(key).substr(26));
    const matchedArr = str.match(/^---([\s\S]+?)---([\s\S]*)/m);
    if (!matchedArr) {
      return null;
    }
    const [, descStr, contentStr] = matchedArr;
    const orderMatch = descStr.match(/order:\s*(\d+)/);
    let titleMatch = descStr.match(/title:\s*([\s\S]+)/);
    if (titleMatch && titleMatch[1].indexOf('zh-CN') > -1) {
      titleMatch = titleMatch[1].match(/zh-CN:\s*([^\n]+)/);
    }
    const groupMatch = descStr.match(/group:\s*([^\n]+)/);
    return {
      order: orderMatch ? orderMatch[1] : 0,
      title: titleMatch ? titleMatch[1].trim() : '其他',
      group: groupMatch ? groupMatch[1].trim() : '其他',
      content: contentStr,
    };
  })
  .filter(_.identity)
  .groupBy('group')
  .map((markdowns, groupName) => ({
    name: groupName,
    title: groupName,
    markdowns,
  }))
  .value();

export default markdownGroupList;
