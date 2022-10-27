import axios, { AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/Array';

import CURRENCY_MOCK from './currency.mock';
import { Separated } from 'fp-ts/lib/Separated';

type CurrencyResponse = { currencies: CurrencyData, success: boolean };
type CurrencyData = { [key: string] : string };
type CurrencyMatrix = [string, string][];

const TOP_NOTCH_CURRENCIES = ['EUR', 'GBP', 'AUD', 'NZD', 'USD', 'CAD', 'CHF', 'JPY', 'BTC'] as const;

const fixerClient = axios.create({
  baseURL: "https://api.apilayer.com/currency_data",
  headers: { apiKey: process.env.API_LAYER_KEY},
  timeout: 8000,
})

const isTopCurrency = (key: string[]) => {
  return TOP_NOTCH_CURRENCIES.some((topSymbol) => {
    return topSymbol === key[0];
  });
};

const listByRelevanceTier = (currencies: E.Either<Error, CurrencyData>)
  : E.Either<Error, Separated<CurrencyMatrix, CurrencyMatrix>> =>
  E.isLeft(currencies)
    ? currencies
    : E.right(
      A.partition(isTopCurrency)(currencies?.right)
    )

const fetchCurrenciesList = async() => {
  const currencyList: E.Either<Error, CurrencyMatrix> = await pipe(
    TE.tryCatch(
      () => fixerClient.get('/list'),
      (err) => new Error(`${err}`)
    ),
    TE.map((res: AxiosResponse<CurrencyResponse>) => res?.data?.currencies),
    TE.map(Object.entries),
  )()

  return currencyList;
}

const fetchCurrenciesListByRelevance = async() => {
  const listData = await fetchCurrenciesList();
  return listByRelevanceTier(listData);
}

const CurrencyService = {
  fetchCurrenciesList,
  fetchCurrenciesListByRelevance,
};

export default CurrencyService;

