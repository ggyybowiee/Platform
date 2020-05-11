import styles from './index.less';
import DocMenu from './components/DocMenu';
import DocContent from './components/DocContent';
import markdownGroupList from './markdownGroupList';

const {
  vendor: {
    react: React,
    antd: { Row, Col },
  },
  components: {
    SuperInput,
  },
} = platform;

export default class DocMainPage extends React.Component {
  state = {
    selectedDoc: null,
  }

  handleSelectDoc = (story) => {
    this.setState({
      selectedDoc: story,
    });
  }

  render() {
    const { selectedDoc } = this.state;

    return (
      <Row>
        <Col span={8}>
          <DocMenu selectedDoc={selectedDoc} markdownGroupList={markdownGroupList} onSelectDoc={this.handleSelectDoc} />
        </Col>
        <Col span={16}>
          <DocContent doc={selectedDoc} />
        </Col>
        {/* <prev>
          {window.a = markdownGroupList[0].content}
        </prev>
        <div dangerouslySetInnerHTML={{ __html: marked(markdownGroupList[0].content) }}></div> */}
      </Row>
    );
  }
}
