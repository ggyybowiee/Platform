import StoryPreview from './components/StoryPreview';
import StoryApi from './components/StoryApi';
import styles from './index.less';

const {
  vendor: {
    react: React,
    antd: { Card },
  },
} = platform;

export default class Story extends React.Component {

  selectStory = (story) => {
    this.props.onSelectStory(story);
  }

  render() {
    const { story } = this.props;

    let Api = story && story.Api;
    if (story && story.apiGlobalPath) {
      Api = _.get(window, story.apiGlobalPath);
    }

    return (
      <div className={styles.story}>
        <Card title="效果预览">
          <StoryPreview story={story} />
        </Card>
        <Card title="Api">
          <StoryApi api={Api} />
        </Card>
      </div>
    );
  }
}
