import axios, { AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { partition } from 'fp-ts/Array';

import fixerClient from './fixer.client';
import { Separated } from 'fp-ts/lib/Separated';
import CURRENCY_MOCK from '@mocks/currency.mock';

export type CurrencyResponse = { currencies: CurrencyData, success: boolean };
export type CurrencyData = { [key: string] : string };
export type CurrencyMatrix = [string, string][];

interface Query {
  from: string;
  to: string;
  amount: number;
}

interface Info {
  timestamp: number;
  quote: number;
}

type RatioSuccessResponse = {
  success: boolean;
  query: Query;
  info: Info;
  result: number;
}

type RatioFailedResponse = {
  success: boolean,
  error: {
    code: number,
    info: string,
  },
}

export type ConversionRatioResponse = RatioSuccessResponse | RatioFailedResponse;

const TOP_NOTCH_CURRENCIES = ['EUR', 'GBP', 'AUD', 'NZD', 'USD', 'CAD', 'CHF', 'JPY', 'BTC'] as const;

const isTopCurrency = (key: string[]) => {
  return TOP_NOTCH_CURRENCIES.some((topSymbol) => {
    return topSymbol === key[0];
  });
};

const listByRelevanceTier = (currencies: E.Either<Error, CurrencyMatrix>): E.Either<Error, Separated<CurrencyMatrix, CurrencyMatrix>> => 
  pipe(
    currencies,
    E.map(partition(isTopCurrency)),
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

 const fetchCurrencyToUSDRatio = (currency: string): TE.TaskEither<Error, ConversionRatioResponse> => {
  const convertParams = { amount: 1, from: 'USD', to: currency };

  return pipe(
    TE.tryCatch(
      () => fixerClient.get('/convert', { params: convertParams }),
      (err) => new Error(`${err}`)),
    TE.map(({ data }) => data?.result),
  )
}

const fetchCurrenciesListByRelevance = async() => {
  const listData = await fetchCurrenciesList();
  return listByRelevanceTier(listData);
}

const CurrencyService = {
  fetchCurrenciesList,
  fetchCurrenciesListByRelevance,
  fetchCurrencyToUSDRatio,
};

export default CurrencyService;