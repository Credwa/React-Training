import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-73b04.firebaseio.com/'
});

export default instance;
