export const USD_RATIO_MOCK = (currency: string) => ({
  "info": {
    "quote": 2.33685,
    "timestamp": 1670880723
  },
  "query": {
    "amount": 1,
    "from": "USD",
    "to": currency
  },
  "result": 9999,
  "success": true
})

export const USD_RATIO_ERROR_MOCK = (currency: string) => ({
  "info": {
    "quote": 2.33685,
    "timestamp": 1670880723
  },
  "query": {
    "amount": 1,
    "from": "USD",
    "to": currency
  },
  "success": false
})