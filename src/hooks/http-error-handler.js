import { useEffect, useState } from 'react';

export default httpClient => {
  const [error, setError] = useState(null);

  const reqInterceptor = httpClient.interceptors.request.use(req => {
    setError(null);
    return req;
  });

  const resInterceptor = httpClient.interceptors.response.use(
    res => res,
    err => {
      console.log(err);
      setError(err);
    }
  );

  useEffect(
    () => () => {
      httpClient.interceptors.request.eject(reqInterceptor);
      httpClient.interceptors.response.eject(resInterceptor);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reqInterceptor, resInterceptor]
  );

  const errorConfirmedHandler = () => {
    setError(null);
  };

  return [error, errorConfirmedHandler];
};
