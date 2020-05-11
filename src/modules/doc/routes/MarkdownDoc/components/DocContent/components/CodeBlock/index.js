const {
  vendor: {
    react: React,
  },
} = platform;
const hljs = window.hljs

class CodeBlock extends React.PureComponent {
  constructor(props) {
    super(props)
    this.setRef = this.setRef.bind(this)
  }

  setRef(el) {
    this.codeEl = el
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    if (!window.hljs) {
      setTimeout(() => {
        window.hljs.highlightBlock(this.codeEl);
      }, 3000);
    } else {
      window.hljs.highlightBlock(this.codeEl);
    }
  }

  render() {
    return (
      <pre>
        <code ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </code>
      </pre>
    )
  }
}

CodeBlock.defaultProps = {
  language: ''
}

export default CodeBlock;
