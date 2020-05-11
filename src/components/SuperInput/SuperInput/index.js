import React from 'react';
import { Input, Modal, Icon } from 'antd';
import classnames from 'classnames';
import styles from './index.css';

class SuperInput extends React.Component {
  state = {
    modalVisible: false,
  }

  handleOpenModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  handleCloseModal = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleCacheValue = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    const {
      type,
      modalMode = false,
      className,
      wrapStyle,
      ...inputProps
    } = this.props;
    const Comp = type ? SuperInput.CompMap[type] : SuperInput.DefaultComp;
    const { modalVisible } = this.state;

    const comp = (
      <div ref={ref => (this.ref = ref)} className={classnames('super-input', className)} style={wrapStyle}>
        <Comp {...inputProps} handleCacheValue={this.handleCacheValue} />
      </div>
    );

    if (!modalMode) {
      return comp;
    }

    return (
      <div className="super-input-modal-container">
        <Icon type={type} onClick={this.handleOpenModal} className={styles.openModalIcon} />
        <Modal visible={modalVisible} onCancel={this.handleCloseModal} onOk={this.handleCloseModal}>
          {comp}
        </Modal>
      </div>
    );
  }
}

SuperInput.CompMap = {};

SuperInput.DefaultComp = attr => (<Input {...attr} />);

export default SuperInput;
