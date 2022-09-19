import axios from 'axios';

const customFetch = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // this is necessary for cookies
});

export default customFetch;
