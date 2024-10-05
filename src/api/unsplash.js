import axios from 'axios';

const API_KEY = 'ePxGwFDLEuAjyfkhD87Akg8rKjZ1e_IuwlSWabtBmWo'

const unsplashClient = axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
      Authorization: `Client-ID ${API_KEY}`
    }
  });
  
  export default unsplashClient;
  