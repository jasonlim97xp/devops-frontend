import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import loginContainer from './loginContainer';
import registerContainer from './registerContainer';
import homeContainer from './homeContainer';

const AppStack = createStackNavigator(
  {
    home: homeContainer
  }, {
  initialRouteName: 'home',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#fbc02d'
    },
    headerTintColor: '#000000',
    headerTintStyle: {
      textAlign: 'center',
      flex: 1
    }
  }
}
);
const AuthStack = createStackNavigator(
  {
    login: loginContainer,
    register: registerContainer
  }, {
  initialRouteName: 'login',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#fbc02d'
    },
    headerTintColor: '#000000',
    headerTintStyle: {
      textAlign: 'center'
    }
  }
}
);

class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this._loadData();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator />
        <StatusBar backgroundColor="#fbc02d" barStyle="dark-content" />
      </View>
    )
  }

  _loadData = async () => {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    this.props.navigation.navigate(isLoggedIn != "1" ? 'Auth' : 'App');
  }
}
export default createAppContainer(createSwitchNavigator(
  {
    Load: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
  },
  { initialRouteName: 'Load' }
));
