import React from 'react';

export default ({ type, ...props }) => {
  const Comp = ActionCompsMap[type];

  return (
    <Comp {...props} />
  );
};

