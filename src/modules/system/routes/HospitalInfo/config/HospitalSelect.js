import { Button } from 'antd';
import ExModal from 'components/ExModal';
import HospitalSelectForm from './HospitalSelectForm';

const {
  vendor: {
    dva: { connect },
  },
  utils: {
    request: { getApi },
  },
} = platform;

const hosList = [{
  name: '北京大学深圳医院',
  province: '广东省',
  city: '深圳',
  hosCode: '0001',
}, {
  name: '北京大学深圳医院2',
  province: '广东省',
  city: '深圳',
  hosCode: '0002',
}, {
  name: '北京大学深圳医院3',
  province: '广东省',
  city: '深圳',
  hosCode: '0003',
}, {
  name: '北京大学深圳医院4',
  province: '广东省',
  city: '深圳',
  hosCode: '0004',
}, {
  name: '北京大学深圳医院5',
  province: '广东省',
  city: '深圳',
  hosCode: '0005',
}];

export default class HospitalSelect extends React.Component {
  state = {
    hosList: [],
  }

  async componentDidMount() {
    const resp = await getApi('/hospital/hosInfo');
    this.setState({
      hosList: _.map(resp.queryResult, item => ({
        name: item.hosName,
        hosCode: item.hosCode,
        province: item.address && item.address.split('-')[0],
        city: item.address && item.address.split('-')[1],
      }))
    });
  }

  openSelectModal = () => {
    const { value } = this.props;
    const { hosList } = this.state;

    let selectedHosCode = null;
    const handleSave = () => {
      // TODO: 对接接口
      this.props.onChange(selectedHosCode);
    };

    const hos = _.find(hosList, {
      hosCode: value,
    }) || {};

    ExModal.open({
      title: '选择医院',
      content: () => (
        <HospitalSelectForm
          currentHospital={hos}
          hospitals={hosList}
          onSelectedRowChange={this.handleSelectedRowChange}
          selectedHosCode={this.props.value}
          onSelect={hosCode => (selectedHosCode = hosCode)}
        />
      ),
      width: '60%',
      onOk: handleSave,
    });
  }

  render() {
    const {
      value,
    } = this.props;
    const { hosList } = this.state;

    const hospital = _.find(hosList, {
      hosCode: value,
    }) || {};

    return (
      <div>
        <div>{hospital.province}-{hospital.city}</div>
        <div>{hospital.name}</div>
        <div>
          <Button onClick={this.openSelectModal}>从客户列表中选择</Button>
        </div>
      </div>
    );
  }
}
