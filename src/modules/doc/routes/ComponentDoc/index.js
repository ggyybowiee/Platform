import styles from './index.less';
import DocMenu from './components/DocMenu';
import DocStory from './components/Story';
import docGroupList from './storyGroupList';

const {
  vendor: {
    react: React,
    dva: { connect },
    antd: { Row, Col },
  },
  components: {
    SuperInput,
  },
} = platform;

@connect(() => ({
}))
export default class DocMainPage extends React.Component {
  state = {
    selectedStory: null,
  }

  handleSelectStory = (story) => {
    this.setState({
      selectedStory: story,
    });
  }

  render() {
    const { selectedStory } = this.state;

    return (
      <Row>
        <Col span={8}>
          <DocMenu selectedStory={selectedStory} docGroupList={docGroupList} onSelectStory={this.handleSelectStory} />
        </Col>
        <Col span={16}>
          <DocStory story={selectedStory} />
        </Col>
      </Row>
    );
  }
}
