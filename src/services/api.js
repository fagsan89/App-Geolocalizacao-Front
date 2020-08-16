import axios from "axios"

const api = axios.create({
  baseURL: "http://127.0.0.1:4000",
});

const URL_API = 'http://127.0.0.1:4000'

export const get = async (url) => {

  return await axios.get(URL_API+ url)
  .then(res => res)
  .catch(err => err)
  
}

export const post = async (url, data) => {

  return await axios.post(URL_API + url, data)
  .then(res => res)
  .catch(err => err)
  
}

export const put = async (url, data) => {

  return await axios.put(URL_API + url, data)
  .then(res => res)
  .catch(err => err)
  
}

export const del = async (url) => {

  return await axios.delete(URL_API + url)
  .then(res => res)
  .catch(err => err)
  
}

export default api