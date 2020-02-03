/*
 * handles side effects
 */
import { delay } from 'redux-saga/effects';
import { put } from 'redux-saga/effects';
import * as actions from 'store/actions/auth.action';
import axios from 'axios';

export default {
  logoutSaga: function*(action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');
    yield put(actions.logoutSuccess());
  },

  checkAuthTimeoutSaga: function*(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
  },

  authUserSaga: function*(action) {
    yield put(actions.authStart());
    const authData = {
      email: action.email,
      password: action.password,
      returnSecureToken: true
    };

    const baseURL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
    let url = action.isSignUp
      ? `${baseURL}signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`
      : `${baseURL}signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;

    try {
      const response = yield axios.post(url, authData);

      const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
      yield localStorage.setItem('token', response.data.idToken);
      yield localStorage.setItem('expiration', expirationDate);
      yield localStorage.setItem('userId', response.data.localId);
      yield put(actions.authSuccess(response.data));
      yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch (error) {
      console.log(error.response);
      yield put(actions.authFailed(error.response.data.error));
    }
  },

  authCheckStateSaga: function*(action) {
    const token = yield localStorage.getItem('token');

    if (!token) {
      yield put(actions.logout());
    } else {
      const expirationDate = yield new Date(localStorage.getItem('expiration'));
      if (expirationDate <= new Date()) {
        yield put(actions.logout());
      } else {
        yield put(actions.authSuccess(token, localStorage.getItem('userId')));
        let time = (expirationDate.getTime() - new Date().getTime()) / 1000;
        yield put(actions.checkAuthTimeout(time));
      }
    }
  }
};
