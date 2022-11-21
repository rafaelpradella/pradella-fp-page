import axios from "axios";

const REQ_HEADERS = {
  apikey: process.env.NEXT_PUBLIC_API_LAYER_KEY,
} as const;

const fixerClient = axios.create({
  baseURL: "https://api.apilayer.com/currency_data",
  headers: REQ_HEADERS,
  timeout: 8000,
})

export default fixerClient;