const storyContext = require.context(process.env.PLATFORM_DIR, true, /.+\.story\.js$/);

const docGroupList = _.chain(storyContext.keys())
  .map(key => storyContext(key).default)
  .groupBy('group')
  .map((storyOfList, groupName) => ({
    name: groupName,
    title: groupName,
    storyOfList: _.chain(storyOfList)
      .groupBy('storyOf')
      .map((storyList, storyOfName) => ({
        name: storyOfName,
        title: storyOfName,
        storyList,
      }))
      .value()
  }))
  .value();

export default docGroupList;
