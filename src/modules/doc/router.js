import ComponentDoc from './routes/ComponentDoc';
import MarkdownDoc from './routes/MarkdownDoc';
// import PcnRecords from './routes/PcnRecords';
// import MaterielNew from './routes/Materiel/MaterielNew/MaterielNew';
// import MaterielExamine from './routes/Materiel/MaterielExamine/MaterielExamine';
// import SupplierNew from './routes/Supplier/SupplierNew/SupplierNew';
// import SupplierScore from './routes/Supplier/SupplierScore/SupplierScore';

export default {
  '/doc/components': { component: ComponentDoc },
  '/doc/markdown': { component: MarkdownDoc },
};
