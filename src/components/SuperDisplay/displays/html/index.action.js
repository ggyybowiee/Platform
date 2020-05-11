import React from 'react';
import { Button } from 'antd';
import ExModal from 'components/ExModal';

const HtmlDisplay = ({
  value,
  buttonText = 'html',
  title = 'Html',
  mode,
  ...props,
}) => mode === 'dialog' ? (
  <Button onClick={() => ExModal.open({
    title,
    content: () => <div dangerouslySetInnerHTML={{ __html: value }} {...props} />,
    width: '80%',
  })}>{buttonText}</Button>
) : <div dangerouslySetInnerHTML={{ __html: value }} {...props} />;

HtmlDisplay.info = {
  name: 'html块',
  priority: 100,

};

HtmlDisplay.test = v => {
  // TODO: 优化是否为html代码块判断
  return /^\<.+\>/.test(v);
};

export default HtmlDisplay;
