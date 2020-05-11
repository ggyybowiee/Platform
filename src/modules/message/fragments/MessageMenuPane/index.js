import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import NoticeIcon from 'components/NoticeIcon';

@connect(state => ({
  messageTypes: _.get(state, 'message.messageTypes'),
  messagesMap: _.get(state, 'message.messagesMap'),
}))
class MessageMenuPane extends React.Component {
  handleClearClick = (title, { messageType }) => {
    this.props.dispatch({
      type: 'message/clearNotices',
      payload: messageType.code,
    });
  }

  render() {
    const { messageTypes, messagesMap } = this.props;
    const currentUser = {};

    const onNoticeVisibleChange = null;
    const fetchingNotices = null;

    return (
      <NoticeIcon
        className="header-right-action"
        count={_.chain(messagesMap).map('length').sum().value()}
        onItemClick={(item, tabProps) => {
          console.log(item, tabProps); // eslint-disable-line
        }}
        onClear={this.handleClearClick}
        onPopupVisibleChange={onNoticeVisibleChange}
        loading={fetchingNotices}
        popupAlign={{ offset: [20, -16] }}
      >
        {
          _.map(messageTypes, messageType => (
            <NoticeIcon.Tab
              list={messagesMap[messageType.code]}
              title={messageType.title}
              emptyText={`你已查看所有${messageType.title}`}
              emptyImage={messageType.icon}
              messageType={messageType}
            />
          ))
        }
      </NoticeIcon>
    );
  }
}

export default MessageMenuPane;
