import { all, takeEvery, takeLatest } from 'redux-saga/effects';
import * as actionTypes from 'store/actions/actionTypes';
import AuthSagas from './auth.saga';

export function* watchAuth() {
  yield all([
    takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, AuthSagas.logoutSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, AuthSagas.checkAuthTimeoutSaga),
    takeLatest(actionTypes.AUTH_USER, AuthSagas.authUserSaga),
    takeEvery(actionTypes.AUTH_CHECK_STATE, AuthSagas.authCheckStateSaga)
  ]);

  // yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, AuthSagas.logoutSaga);
  // yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, AuthSagas.checkAuthTimeoutSaga);
  // yield takeEvery(actionTypes.AUTH_USER, AuthSagas.authUserSaga);
  // yield takeEvery(actionTypes.AUTH_CHECK_STATE, AuthSagas.authCheckStateSaga);
}
