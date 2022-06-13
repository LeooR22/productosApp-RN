import 'react-native-gesture-handler';

import React, {FC, ReactNode} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {Navigator} from './src/navigator/Navigator';
import {AuthProvider, ProductsProvider} from './src/context';

interface Props {
  children: ReactNode;
}

const AppState: FC<Props> = ({children}) => {
  return (
    <AuthProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </AuthProvider>
  );
};

export const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
};
