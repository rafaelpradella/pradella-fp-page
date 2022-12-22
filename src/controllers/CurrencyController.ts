import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import type { Dispatch, SetStateAction } from "react";

import type { CurrencyMatrix } from '~/services/currency';
import CurrencyService, { ConversionRatioResponse } from "~/services/currency";

type ControllerDeps = {
  fetcher: (currency: string) => TE.TaskEither<Error, ConversionRatioResponse>,
}
type RatioResponse = { currency: string, ratio: number };
type ErrorProps = { error: Error['message'], topCurrencies: null, otherCurrencies: null };
type ResponseProps = { topCurrencies: CurrencyMatrix, otherCurrencies: CurrencyMatrix, error: null };
export type RDRatioResponse = RD.RemoteData<Error, RatioResponse>;
export type PageProps = ErrorProps | ResponseProps;

export const getStaticProps = async () => {
  const listRes = await CurrencyService.fetchCurrenciesListByRelevance();

  return pipe(listRes,
    E.fold(
      (err) => ({ error: err.message, topCurrencies: null, otherCurrencies: null }),
      (res) => ({ topCurrencies: res.right, otherCurrencies: res.left, error: null })
    ),
    (obj => ({ props: obj })),
  )
};

const getUSDRatioFromOptionValue = ({ fetcher }: ControllerDeps,
  value: string,
  setState: Dispatch<SetStateAction<RDRatioResponse>>,
) => {
  setState(RD.pending);

  return pipe(value,
    fetcher,
    TE.map(ratio => ({ currency: value, ratio })),
    TE.bimap(RD.failure, RD.success),
    TE.fold(
      (err) => TE.fromIO(() => setState(err)),
      (res) => TE.fromIO(() => setState(res))
    ),
  )();
}

export const makeUSDRatioFromOption = (deps: ControllerDeps) =>
  getUSDRatioFromOptionValue.bind(null, deps);

export const USDRatioFromOption = makeUSDRatioFromOption({ fetcher: CurrencyService.fetchCurrencyToUSDRatio });

