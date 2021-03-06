import React from 'react';
import {mapping, dark} from '@eva-design/eva';
import {ApplicationProvider, Layout, Text, IconRegistry} from 'react-native-ui-kitten';
import {Provider as ReduxProvider} from 'react-redux';

import MainScreen from './src/features/SplashScreen';
import {store} from './src/redux/store';
import NavigatorProvider from './src/navigator/mainNavigator';
import {setupHttpConfig} from './src/utils/http';
import {crowdboticsTheme} from './src/config/crowdboticsTheme';
import * as NavigationService from './src/navigator/NavigationService';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import SplashScreen from 'react-native-splash-screen'

export default class App extends React.Component {
  state = {
    isLoaded: false,
  };

  async componentWillMount() {
    /**
     * add any aditional app config here,
     * don't use blocking requests here like HTTP requests since they block UI feedback
     * create HTTP requests and other blocking requests using redux saga
     */
    await this.loadAssets();
    setupHttpConfig();
  }

  componentDidMount() {
    /**
     * Read above commments above adding async requests here
     */
    SplashScreen && SplashScreen.hide();
  }

  loadAssets = async () => {
    // add any loading assets here
    this.setState({isLoaded: true});
  };

  renderLoading = () => (
    <Layout style={[styles.flex]}>
      <Text>Loading</Text>
    </Layout>
  );

  renderApp = () => (
    <ReduxProvider store={store}>
      <IconRegistry icons={EvaIconsPack}/>
      <ApplicationProvider mapping={mapping} theme={crowdboticsTheme}>
        <NavigatorProvider
          style={[styles.flex]}>
          <Layout style={[styles.flex]}>
            <MainScreen />
          </Layout>
        </NavigatorProvider>
      </ApplicationProvider>
    </ReduxProvider>
  );

  render = () =>
    this.state.isLoaded ? this.renderApp() : this.renderLoading();
}

const styles = {flex: {flex: 1}};
