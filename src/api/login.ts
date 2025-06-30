import axios from 'axios';
const BASE_URL = 'http://localhost:5262/api';

export const login = async (emailOrUserName: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/Users/signin`, { emailOrUserName, password });
  return response.data;
};
