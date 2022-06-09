import {Usuario} from '../interfaces/appInterfaces';
import {AuthState} from './';

type AuthActionType =
  | {
      type: '[Auth] - signUp';
      payload: {token: string; user: Usuario};
    }
  | {type: '[Auth] - addError'; payload: string}
  | {type: '[Auth] - removeError'}
  | {type: '[Auth] - notAuthenticated'}
  | {type: '[Auth] - logout'};

export const authReducer = (
  state: AuthState,
  action: AuthActionType,
): AuthState => {
  switch (action.type) {
    case '[Auth] - addError':
      return {
        ...state,
        user: null,
        status: 'not-authenticated',
        token: null,
        errorMessage: action.payload,
      };

    case '[Auth] - removeError':
      return {
        ...state,
        errorMessage: '',
      };

    case '[Auth] - signUp':
      return {
        ...state,
        status: 'authenticated',
        token: action.payload.token,
        user: action.payload.user,
        errorMessage: '',
      };

    case '[Auth] - logout':
    case '[Auth] - notAuthenticated':
      return {
        ...state,
        status: 'not-authenticated',
        token: null,
        user: null,
      };

    default:
      return state;
  }
};
