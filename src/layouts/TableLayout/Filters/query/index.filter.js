export default {
  phase: 'queryParams',
  filter: ({ params, filterField, filterValue, config: { bindField } }) => {
    const otherParams = bindField ? bindField(filterValue, filterField, params) : { [filterField]: filterValue };
    return { ...(params || {}), ...otherParams };
  },
};
