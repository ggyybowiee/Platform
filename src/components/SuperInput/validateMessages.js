export default {
  default: () => '字段错误',
  required: () => '必填',
  enum: (field, options) => `必须是以下其中一个: ${options}`,
  whitespace: () => '不能全部是空白字符',
  date: {
    format: (field, type, format) => `无效的日期格式：${format}`,
    parse: () => '日期格式不正确，无法转化为日期',
    invalid: () => '日期无效',
  },
  types: {
    string: () => '必须是一个文本',
    method: () => '必须是一个函数',
    array: () => '必须是一个数组',
    object: () => '必须是一个对象',
    number: () => '必须是一个数值',
    date: () => '必须是一个日期时间',
    boolean: () => '必须是一个布尔值，是或不是',
    integer: () => '必须是一个整数',
    float: () => '必须是一个浮点数',
    regexp: () => '必须是一个正则表达式',
    email: () => '必须是一个有效的邮箱',
    url: () => '必须是一个有效的url',
    hex: () => '必须是一个有效的16进制数值',
  },
  string: {
    len: (field, len) => `长度必须是：${len}`,
    min: (field, min) => `最少${min}个字符`,
    max: (field, max) => `最多${max}个字符`,
    range: (field, min, max) => `长度必须在${min}到${max}之间`,
  },
  number: {
    len: (field, len) => `长度必须是：${len}`,
    min: (field, min) => `必须大于${min}`,
    max: (field, max) => `必须小于${max}`,
    range: (field, min, max) => `大小必须在${min}到${max}范围内`,
  },
  array: {
    len: (field, len) => `必须有${len}个`,
    min: (field, min) => `最少要有${min}个`,
    max: (field, max) => `不能超过${max}个`,
    range: (field, min, max) => `数量必须在${min}到${max}之间`,
  },
  pattern: {
    mismatch: () => '不符合规则',
  },
  clone() {
    const cloned = JSON.parse(JSON.stringify(this));
    cloned.clone = this.clone;
    return cloned;
  },
};
