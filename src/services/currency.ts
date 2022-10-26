import axios, { AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import { isLeft } from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/Array';

type CurrencyResponse = { symbols: CurrencyData, status: string };
type CurrencyData = { [key: string] : string };
type CurrencyMatrix = [string, string][];

const TOP_NOTCH_CURRENCIES = ['EUR', 'GBP', 'AUD', 'NZD', 'USD', 'CAD', 'CHF', 'JPY'] as const;

const fixerClient = axios.create({
  baseURL: "https://api.apilayer.com/fixer/",
  headers: { apiKey: process.env.API_LAYER_KEY},
  timeout: 8000,
})

const isTopCurrency = (key: string) => {
  return TOP_NOTCH_CURRENCIES.some((topSymbol) => {
    return topSymbol === key;
  })
};

const listByRelevanceTier = (currencies, predicate) => pipe(currencies,
  Object.entries,
  A.partition(predicate)
);

const fetchCurrenciesList = async() => {
  const currencyList: TE.TaskEither<Error, CurrencyData> = await pipe(
    TE.tryCatch(
      () => fixerClient.get('symbols'),
      (err) => new Error(`${err}`)
    ),
    TE.map((res: AxiosResponse<CurrencyResponse>) => res.data.symbols),
  )()

  return currencyList;
}


const fetchCurrenciesListByRelevance = async() => {
  const getListData = await fetchCurrenciesList();
  
  return pipe(getListData,
    TE.getOrElse((err) => console.error(err)),
    TE.chainW(
      isTopCurrency,
    ),
  )
}

const CurrencyService = {
  fetchCurrenciesList,
  fetchCurrenciesListByRelevance,
};

export default CurrencyService;

