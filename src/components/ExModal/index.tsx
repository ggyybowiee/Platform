import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Icon } from 'antd';
import Dialog, { ModalFuncProps } from 'antd/es/modal';
import { getConfirmLocale } from 'antd/es/modal/locale';
import ActionButton from 'antd/es/modal/ActionButton';

interface DefaultDialogProps extends ModalFuncProps {
  afterClose?: () => void;
  close: (...args: any[]) => void;
  loading: boolean,
  footer?: any;
  closable?: boolean,
  mask?: boolean,
  destroyOnClose?: boolean,
  height?: number,
  bodyStyle?: object,
}

const IS_REACT_16 = !!ReactDOM.createPortal;

const DefaultDialog = (props: DefaultDialogProps) => {
  const { onCancel, onOk, close, zIndex, afterClose, visible, keyboard, closable, mask, destroyOnClose } = props;
  const iconType = props.iconType || 'question-circle';
  const okType = props.okType || 'primary';
  const prefixCls = props.prefixCls || 'ant-confirm';
  // 默认为 true，保持向下兼容
  const okCancel = ('okCancel' in props) ? props.okCancel! : true;
  const width = props.width || 416;
  const height = props.height || 416;
  const style = props.style || {};
  const bodyStyle = props.bodyStyle || {};
  // 默认为 false，保持旧版默认行为
  const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;
  const runtimeLocale = getConfirmLocale();
  const okText = props.okText ||
    (okCancel ? runtimeLocale.okText : runtimeLocale.justOkText);
  const cancelText = props.cancelText || runtimeLocale.cancelText;

  const classString = classNames(
    prefixCls,
    `${prefixCls}-${props.type}`,
    props.className,
  );

  const cancelButton = okCancel && (
    <ActionButton actionFn={onCancel} closeModal={close}>
      {cancelText}
    </ActionButton>
  );

  const locale = getConfirmLocale();
  console.log(locale);

  return (
    <Dialog
      onCancel={close.bind(this, { triggerCancel: true })}
      onOk={() => {
        if (onOk && onOk() === false) {
          return;
        }
        close.bind(this, { triggerCancel: true })();
      }}
      visible={visible}
      title={props.title}
      transitionName="zoom"
      footer={props.footer}
      maskTransitionName="fade"
      maskClosable={maskClosable}
      style={style}
      bodyStyle={bodyStyle}
      mask={mask}
      width={width}
      height={height}
      zIndex={zIndex}
      closable={closable}
      afterClose={afterClose}
      destroyOnClose={destroyOnClose}
      keyboard={keyboard}
      okText={props.okText || locale.okText}
      cancelText={props.cancelText || locale.cancelText}
    >
      {props.content(props.loading)}
    </Dialog>
  );
};

export default function open(config: ModalFuncProps) {
  let div = document.createElement('div');
  document.body.appendChild(div);
  function close(...args: any[]) {
    if (IS_REACT_16) {
      render({ ...config, close, visible: false, afterClose: destroy.bind(this, ...args) });
    } else {
      destroy(...args);
    }
  }
  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args && args.length &&
      args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }

  function loading(loading) {
    render({ ...config, visible: true, loading, close })
  }

  function update(newConfig: ModalFuncProps) {
    const currentConfig = {
      ...config,
      ...newConfig,
      close,
    };
    render(currentConfig);
  }

  function render(props: any) {
    ReactDOM.render(<DefaultDialog {...props} />, div);
  }
  render({ ...config, visible: true, close });
  return {
    destroy: close,
    update,
    loading,
  };
}
