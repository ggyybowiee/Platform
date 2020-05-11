import React from 'react';
import moment from 'moment';
import Uploader from '../../../components/Uploader';

const curryingUpload = (listType, multiple) => ({ category, ...props }) => (
  <Uploader
    category={`${category}/${moment().format('YYYY-MM-DD')}`}
    multiple={multiple}
    listType={listType}
    {...props}
  />
);

export default curryingUpload;
