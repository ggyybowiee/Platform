import services from '../../../../../../services';
import styles from './index.less';

const {
  transformEsCode,
} = services;

const {
  vendor: {
    react: React,
    antd: { Icon, Spin, Tooltip },
    classnames,
  },
  components: {
    SuperInput,
  },
} = platform;

export default class Story extends React.Component {
  state = {
    code: null,
    showCode: false,
    previewRender: null,
    loadingPreview: false,
  }

  componentDidMount() {
    this.transformEsCode();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.story) {
      return;
    }
    if (!prevProps.story) {
      this.transformEsCode(this.props.story.code);
      return;
    }
    if (this.props.story.code !== prevProps.story.code) {
      this.transformEsCode(this.props.story.code);
      return;
    }
  }

  transformEsCode(newCode) {
    const code = newCode ? newCode : this.state.code;
    if (!code) {
      return;
    }

    if (newCode) {
      setTimeout(() => {
        this.setState({
          code: newCode,
        });
      }, 0);
    }

    transformEsCode(code).then(moduleObject => {
      if (!moduleObject || !moduleObject.render) {
        console.error('Story.code invalid!');
        this.setState({
          loadingPreview: false,
        });
        return;
      }
      this.setState({
        previewRender: moduleObject.render,
        loadingPreview: false,
      });
    });

    this.setState({
      loadingPreview: true,
    });
  }

  selectStory = (story) => {
    this.props.onSelectStory(story);
  }

  toggleCode = () => {
    this.setState({
      showCode: !this.state.showCode,
    });
  }

  freshCode = () => {
    this.transformEsCode();
  }

  handleCodeChange = (value) => {
    this.setState({
      code: value,
    });
  }

  render() {
    const { story } = this.props;
    const { code, showCode, previewRender, loadingPreview } = this.state;

    if (!story) {
      return (
        <p></p>
      );
    }

    return (
      <div className={classnames(styles.previewContainer, { [styles.previewLoading]: loadingPreview })}>
        <div className={styles.preview}>
          <div className={styles.previewContent}>
            {previewRender && previewRender()}
          </div>
          { loadingPreview ? <Spin className={styles.loadingSpin} /> : null }
        </div>
        <div className={styles.desc}>
          <header>{story.title}</header>
          <main>
            {story.desc}
            <img
              src={
                showCode
                ? 'https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg'
                : 'https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg'
              }
              className={styles.codeToggleBtn}
              onClick={this.toggleCode}
            />
          </main>
        </div>
        {
          showCode
            ? (
              <div className={styles.code}>
                <header>
                  代码
                  <Tooltip placement="top" title="刷新预览">
                    <Icon type="shake" className={styles.freshCodeBtn} onClick={this.freshCode} />
                  </Tooltip>
                </header>
                <main>
                  <SuperInput type="javascript" value={code} onChange={this.handleCodeChange} />
                </main>
              </div>
            ) : null
        }
      </div>
    );
  }
}
