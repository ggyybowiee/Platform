import FormGenerator from './routes/FormGenerator';
import Scaffold from './routes/Scaffold';
import IconManagement from './routes/IconManagement';
import ModuleConfig from './routes/ModuleConfig';

export default {
  '/tool/formGenerator': { component: FormGenerator },
  '/tool/scaffold': { component: Scaffold },
  '/tool/icons': { component: IconManagement },
  '/tool/moduleConfig': { component: ModuleConfig },
};
