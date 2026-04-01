import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const getEntries = () => API.get('/entries');
export const addEntry = (data) => API.post('/entries', data);