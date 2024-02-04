import axios from "axios";

const baseApi = axios.create({
  baseURL: "https://5fc9346b2af77700165ae514.mockapi.io",
});

export default baseApi;
