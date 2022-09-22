import axios from 'axios';
import { baseApiUrl } from 'constants/apiUrls';

const customFetch = axios.create({
  baseURL: baseApiUrl,
  withCredentials: true, // this is necessary for cookies
});

export default customFetch;
