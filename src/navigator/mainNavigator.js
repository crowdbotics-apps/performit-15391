import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import SplashScreen from '../features/SplashScreen';
//@BlueprintImportInsertion
import EmailAuthNavigator from '../features/EmailAuth/navigator';

/**
 * new navigators can be imported here
 */

const AppNavigator = {
  SplashScreen: {
    screen: SplashScreen,
  },
  //@BlueprintNavigationInsertion
  EmailAuth: {screen: EmailAuthNavigator},

  /** new navigators can be added here */
};

const DrawerAppNavigator = createStackNavigator(
  {
    ...AppNavigator,
  },
  {
    initialRouteName: 'EmailAuth',
  },
);

const AppContainer = createAppContainer(DrawerAppNavigator);

export default AppContainer;
