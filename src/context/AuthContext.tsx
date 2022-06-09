import {createContext} from 'react';
import {Usuario, LoginData, RegisterData} from '../interfaces/appInterfaces';

export interface AuthContextProps {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signIn: (loginData: LoginData) => void;
  signUp: (registerData: RegisterData) => void;
  logOut: () => void;
  removeError: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);
