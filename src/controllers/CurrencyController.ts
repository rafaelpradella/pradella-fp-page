import * as RD from '@devexperts/remote-data-ts';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import type { Dispatch, SetStateAction } from "react";

import CurrencyService, { ConversionRatioResponse } from "~/services/currency";

type ControllerDeps = {
  fetcher: (currency: string) => TE.TaskEither<Error, ConversionRatioResponse>,
}
type RatioResponse = { currency: string, ratio: number };
export type RDRatioResponse = RD.RemoteData<Error, RatioResponse>;

export async function getStaticProps() {
	const currencyRes = await CurrencyService.fetchCurrenciesListByRelevance();
	console.log('STATIC_PROPS_DATA', currencyRes);

	return {
		props: {
			error: E.isLeft(currencyRes) ? currencyRes?.left.message : null,
			otherCurrencies: E.isRight(currencyRes) ? currencyRes?.right?.left : null,
			topCurrencies: E.isRight(currencyRes) ? currencyRes?.right?.right : null,
		},
	}
}

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

const makeUSDRatioFromOption = (deps: ControllerDeps) =>
  getUSDRatioFromOptionValue.bind(null, deps);

export const USDRatioFromOption = makeUSDRatioFromOption({ fetcher: CurrencyService.fetchCurrencyToUSDRatio });

