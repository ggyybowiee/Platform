import Login from './routes/Login';
import Register from './routes/Register';
import RegisterResult from './routes/RegisterResult';
import ResetPassword from './routes/ResetPassword';

export default {
  '/auth/login': { component: Login },
  '/auth/Register': { component: Register },
  '/auth/RegisterResult': { component: RegisterResult },
  '/auth/resetPassword': { name: '重置密码', component: ResetPassword },
};
