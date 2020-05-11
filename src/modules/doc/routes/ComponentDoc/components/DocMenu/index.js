import styles from './index.less';

const {
  vendor: {
    react: React,
    antd: { Collapse, Radio },
  },
} = platform;

const Panel = Collapse.Panel;

export default class DocMenu extends React.Component {

  selectStory = (story) => {
    this.props.onSelectStory(story);
  }

  render() {
    const { docGroupList, selectedStory } = this.props;

    return (
      <Collapse>
        {
          _.map(docGroupList, group => (
            <Panel header={group.title} key={group.name}>
              <Collapse bordered={false}>
                {
                  _.map(group.storyOfList, storyOf => (
                    <Panel header={storyOf.title} key={storyOf.title}>
                      {
                        _.map(storyOf.storyList, (story) => (
                          <p className={styles.story}>
                            <Radio checked={selectedStory === story} onClick={() => this.selectStory(story)}>{story.title}</Radio>
                          </p>
                        ))
                      }
                    </Panel>
                  ))
                }
              </Collapse>
            </Panel>
          ))
        }
      </Collapse>
    );
  }
}
