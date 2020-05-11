import HospitalInfo from './routes/HospitalInfo';
import DicConfig from './routes/DicConfig';
import SystemConfig from './routes/SystemConfig';
// import PcnRecords from './routes/PcnRecords';
// import MaterielNew from './routes/Materiel/MaterielNew/MaterielNew';
// import MaterielExamine from './routes/Materiel/MaterielExamine/MaterielExamine';
// import SupplierNew from './routes/Supplier/SupplierNew/SupplierNew';
// import SupplierScore from './routes/Supplier/SupplierScore/SupplierScore';

export default {
  '/system/hosInfo': { key: 'hospital-info', name: '医院信息配置', component: HospitalInfo },
  '/system/dicInfo': { key: 'dic-config', name: '字典表配置', component: DicConfig },
  '/system/sysConfig': { key: 'sys-config', name: '系统配置', component: SystemConfig },
};
