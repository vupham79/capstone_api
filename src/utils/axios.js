import axios from "axios";
require("dotenv").config();

export default ({
  headers,
  method = "GET",
  url,
  data,
  params,
  baseURL = process.env.facebookAPI,
}) => {
  return axios({
    headers,
    method,
    url,
    data,
    params,
    baseURL,
  });
};
