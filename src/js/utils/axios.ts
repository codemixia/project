import axios from 'axios';
import ENV from '_constants/env';

axios.defaults.baseURL = ENV.API_URL;
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

export default axios;
