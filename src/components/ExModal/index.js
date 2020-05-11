import React from 'react';
import ExModal from './index.tsx';
import JsonForm from '../JsonForm';
import SuperAction from '../SuperAction';
// import confirm from './index.tsx';

function getDefaultLayout(formItems) {
  return {
    type: 'grid',
    detail: _.map(formItems, formItem => [formItem.id || formItem.field.name]),
  };
}

export default {
  open: ExModal,
  form: ({ formInfo, title, values, onCancel, onSave, loading, ...otherProps }) => {
    const handleCancel = () => {
      modal.destroy();
      if (onCancel) {
        onCancel();
      }
    };

    const handleSave = (formValues, form) => {
      if (onSave) {
        // TODO: 错误请求不关闭弹窗的处理方式需要修改
        modal.update({
          loading: true,
          visible: true,
        });
        onSave(formValues, form).then((response) => {
          if(response === undefined || response === true || _.chain(response).get('response').isObject().value()) {
            modal.destroy();

            return;
          }

          modal.update({
            loading: false,
            visible: true,
          });
        });
      } else {
        modal.update({
          loading: false,
          visible: true,
        });
        modal.destroy();
      }
    };

    const modal = ExModal({
      title,
      content: loading => (
        <JsonForm
          {...formInfo}
          elements={_.every(formInfo.elements, item => !_.isNil(item)) ? formInfo.elements : _.map(formInfo.elements, elt => ({ ...elt, id: form.field.name }))}
          layout={formInfo.layout || getDefaultLayout(formInfo.elements)}
          data={values}
          loading={loading}
          onSubmit={handleSave}
          actions={(
            <SuperAction type="button" onTrigger={handleCancel}>
              取消
            </SuperAction>
          )}
        />
      ),
      width: 400,
      footer: false,
      ...otherProps,
    });
  },
};
