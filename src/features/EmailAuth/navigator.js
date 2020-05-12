import {createStackNavigator} from 'react-navigation-stack';

import SignInScreen from './screens/SignIn';
import RecoverPasswordScreen from './screens/PasswordRecover';
import SignUpScreen from './screens/SignUp';
import ProtectedScreen from './screens/ProtectedScreen';
import ConfirmationRequiredScreen from './screens/ConfirmationRequired';
import Home from './screens/';
import Onboarding from './Onboarding';
import TermsAndConditions from './TermsAndConditions';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import ConfirmCode from './screens/ConfirmCode';

export default (EmailAuthNavigator = createStackNavigator(
  {
    Home: {screen: Home},
    SignIn: {screen: SignInScreen},
    RecoverPassword: {screen: RecoverPasswordScreen},
    SignUp: {screen: SignUpScreen},
    ProtectedRoute: {screen: ProtectedScreen},
    ConfirmationRequired: {screen: ConfirmationRequiredScreen},
    Onboarding: {screen: Onboarding},
    TermsAndConditions: {screen: TermsAndConditions},
    ForgotPassword: {screen: ForgotPassword},
    ResetPassword: {screen: ResetPassword},
    ConfirmCode: {screen: ConfirmCode},
  },
  {
    initialRouteName: 'ConfirmCode',
  },
));
