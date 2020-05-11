import styles from './index.less';

const {
  vendor: {
    react: React,
    antd: { Collapse, Radio },
  },
} = platform;

const Panel = Collapse.Panel;

export default class DocMenu extends React.Component {

  selectDoc = (doc) => {
    this.props.onSelectDoc(doc);
  }

  render() {
    const { markdownGroupList, selectedDoc } = this.props;

    return (
      <Collapse>
        {
          _.map(markdownGroupList, group => (
            <Panel header={group.title} key={group.name}>
              {
                _.map(group.markdowns, doc => (
                  <p className={styles.doc}>
                    <Radio checked={selectedDoc === doc} onClick={() => this.selectDoc(doc)}>{doc.title}</Radio>
                  </p>
                ))
              }
            </Panel>
          ))
        }
      </Collapse>
    );
  }
}
