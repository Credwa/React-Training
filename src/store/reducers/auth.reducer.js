import { updateObject } from 'services/utils';
import * as actionTypes from 'store/actions/actionTypes';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
};

const authStart = (state, action) => updateObject(state, { error: null, loading: true });

const authSuccess = (state, action) =>
  updateObject(state, { loading: false, error: null, token: action.idToken, userId: action.userId });

const authFail = (state, action) => updateObject(state, { error: action.error, loading: false });

const setAuthRedirectPath = (state, action) => updateObject(state, { authRedirectPath: action.path });

const authLogout = (state, action) => updateObject(state, { token: null, userId: null });

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);

    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);

    case actionTypes.AUTH_FAIL:
      return authFail(state, action);

    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);

    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);

    default:
      return state;
  }
};
