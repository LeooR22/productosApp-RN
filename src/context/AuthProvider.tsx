import React, {FC, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import productsApi from '../api/productsApi';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  Usuario,
} from '../interfaces/appInterfaces';
import {AuthContext, authReducer} from './';

export interface AuthState {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
}

const AUTH_INITIAL_STATE: AuthState = {
  status: 'checking',
  user: null,
  token: null,
  errorMessage: '',
};

type Props = {
  children?: React.ReactNode;
};

export const AuthProvider: FC<Props> = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    //No token, no autenticado
    if (!token) return dispatch({type: '[Auth] - notAuthenticated'});

    // hay token

    const resp = await productsApi.get<LoginResponse>('/auth');

    if (resp.status !== 200) {
      return dispatch({type: '[Auth] - notAuthenticated'});
    }

    await AsyncStorage.setItem('token', resp.data.token);
    dispatch({
      type: '[Auth] - signUp',
      payload: {user: resp.data.usuario, token: resp.data.token},
    });
  };

  const signIn = async ({correo, password}: LoginData) => {
    try {
      const {data} = await productsApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });
      dispatch({
        type: '[Auth] - signUp',
        payload: {user: data.usuario, token: data.token},
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (err: any) {
      console.log(err.response.data.msg);
      dispatch({
        type: '[Auth] - addError',
        payload: err.response.data.msg || 'Informacion incorrecta',
      });
    }
  };

  const signUp = async ({correo, nombre, password}: RegisterData) => {
    try {
      const {data} = await productsApi.post<LoginResponse>('/usuarios', {
        correo,
        password,
        nombre,
      });

      dispatch({
        type: '[Auth] - signUp',
        payload: {user: data.usuario, token: data.token},
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (err: any) {
      dispatch({
        type: '[Auth] - addError',
        payload: err.response.data.errors[0].msg || 'Revise la informacion',
      });
    }
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('token');

    dispatch({type: '[Auth] - logout'});
  };
  const removeError = () => {
    dispatch({type: '[Auth] - removeError'});
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
