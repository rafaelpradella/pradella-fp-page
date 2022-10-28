import axios, { AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/Array';

import fixerClient from './fixer.client';
//import CURRENCY_MOCK from './currency.mock';

export type CurrencyResponse = { currencies: CurrencyData, success: boolean };
export type CurrencyData = { [key: string] : string };
export type CurrencyMatrix = [string, string][];

const TOP_NOTCH_CURRENCIES = ['EUR', 'GBP', 'AUD', 'NZD', 'USD', 'CAD', 'CHF', 'JPY', 'BTC'] as const;

const isTopCurrency = (key: string[]) => {
  return TOP_NOTCH_CURRENCIES.some((topSymbol) => {
    return topSymbol === key[0];
  });
};

const listByRelevanceTier = (currencies: E.Either<Error, CurrencyMatrix>) => 
  pipe(
    currencies,
    E.map((currencies) => A.partition(isTopCurrency)(currencies)),
  );

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

