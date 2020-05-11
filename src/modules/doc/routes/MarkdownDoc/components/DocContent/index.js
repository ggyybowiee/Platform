import Markdown from 'react-markdown';
import CodeBlock from './components/CodeBlock';
import styles from './index.less';

const {
  vendor: {
    react: React,
  },
} = platform;

export default class DocContent extends React.Component {
  render() {
    const { doc } = this.props;

    return (
      <div className={styles.doc}>
        <Markdown source={doc ? doc.content : ''} escapeHtml={false} renderers={{code: CodeBlock}} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.2/codemirror.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/github.min.css" />
      </div>
    );
  }
}
