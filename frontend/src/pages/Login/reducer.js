import { fromJS } from 'immutable';
import moment from 'moment';
import strings from '../../localizeStrings';


import { FETCH_USERS_SUCCESS, FETCH_ROLES_SUCCESS, LOGIN_SUCCESS, STORE_USERNAME, STORE_PASSWORD, SHOW_LOGIN_ERROR, STORE_ENVIRONMENT_SUCCESS, SET_LANGUAGE, LOGOUT_SUCCESS, FETCH_USER_SUCCESS, ADMIN_LOGIN_SUCCESS, FETCH_ADMIN_USER_SUCCESS, SHOW_ADMIN_LOGIN_ERROR, FETCH_ENVIRONMENT_SUCCESS, ADMIN_LOGOUT_SUCCESS, CLEAR_USER } from './actions';
import { FETCH_UPDATES_SUCCESS } from '../LiveUpdates/actions';

import { FETCH_ALL_PROJECTS_SUCCESS } from '../Overview/actions';
import { FETCH_ALL_SUBPROJECT_DETAILS_SUCCESS } from '../Workflows/actions';
import { FETCH_ALL_PROJECT_DETAILS_SUCCESS } from '../SubProjects/actions';

export const defaultState = fromJS({
  users: [],
  username: '',
  password: '',
  loggedInUser: {
    role: {
      roleName: '',
      read: false,
      write: false,
      admin: false,
    }
  },
  environment: 'Test',
  productionActive: false,
  loginErrorMessage: '',
  showLoginError: false,
  loggedInAdminUser: {},
  adminLoggedIn: false,
  jwt: '',
  adminLoginFailed: false,
  roles: [],
  language: 'en-gb',
  loggedIn: false,
  tokenPresent: false,
});

const setLanguage = (state) => {
  moment.locale(state.get('language'));
  strings.setLanguage(state.get('language'));
}

setLanguage(defaultState)


export default function loginReducer(state = defaultState, action) {
  switch (action.type) {
    case FETCH_UPDATES_SUCCESS:
    case FETCH_USERS_SUCCESS:
      return state.set('users', fromJS(action.users));
    case FETCH_ALL_PROJECT_DETAILS_SUCCESS:
    case FETCH_ALL_SUBPROJECT_DETAILS_SUCCESS:
    case FETCH_ALL_PROJECTS_SUCCESS:
    case FETCH_ROLES_SUCCESS:
      return state.set('roles', fromJS(action.roles));
    case STORE_USERNAME:
      return state.set('username', action.username);
    case STORE_PASSWORD:
      return state.set('password', action.password);
    case FETCH_USER_SUCCESS:
      return state.merge({
        'loggedInUser': action.user,
        'jwt': action.jwt
      });
    case FETCH_ADMIN_USER_SUCCESS:
      return state.merge({
        'loggedInAdminUser': action.user,
        'jwt': action.jwt
      });

    case LOGIN_SUCCESS:
      return state.merge({
        loggedIn: true,
        tokenPresent: true
      });
    case ADMIN_LOGIN_SUCCESS:
      return state.merge({
        adminLoggedIn: true,
      });
    case SHOW_LOGIN_ERROR:
      return state.set('loginUnsuccessful', action.show);
    case SHOW_ADMIN_LOGIN_ERROR:
      return state.set('adminLoginFailed', action.show);
    case CLEAR_USER:
      return state.set('loggedInUser', defaultState.get('loggedInUser'));
    case STORE_ENVIRONMENT_SUCCESS:
    case FETCH_ENVIRONMENT_SUCCESS:
      return state.merge({
        environment: action.environment,
        productionActive: action.productionActive
      })
    case SET_LANGUAGE:
      const newState = state.set('language', action.language);
      setLanguage(newState);
      return newState;
    case ADMIN_LOGOUT_SUCCESS:
    case LOGOUT_SUCCESS: {
      const newDefaultState = defaultState.set('language', state.get('language'))
      return newDefaultState;
    }
    default:
      return state
  }
}