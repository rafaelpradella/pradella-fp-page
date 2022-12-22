export const USD_RATIO_MOCK = (currency: string) => ({
  "query": {
    "amount": 1,
    "from": "USD",
    "to": currency
  },
  "result": 9999,
  "success": true
})

export const USD_RATIO_ERROR_MOCK = {
  "success": false,
  "error": {
    "code": 402,
    "info": "You have entered an invalid \"to\" property. [Example: to=GBP]"
  }
}