import axios from "axios"

const apiMaps = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api/geocode/",
});

export default apiMaps