import { Input } from 'antd';

const { Search } = Input;

const SearchInput = props => (
  <Search {...props} />
);

SearchInput.properties = {
  placeholder: {
    showName: '占位文本',
    type: 'string',
  },
};

SearchInput.info = {
  name: '搜索文本',
  category: '文本',
};

SearchInput.structure = {
  type: 'string',
};

export default SearchInput;
