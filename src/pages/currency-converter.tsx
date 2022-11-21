import React, { SyntheticEvent, useEffect, useState } from 'react';
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/lib/Either';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/function';

import CurrencyService, { CurrencyMatrix } from 'services/currency';
import Layout from 'components/Layout'
import styles from 'styles/Home.module.scss'

type Props = {
	topCurrencies: CurrencyMatrix | null,
	otherCurrencies: CurrencyMatrix | null,
	error: string | null,
}

type RatioResponse = { currency: string, ratio: number };

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

export default function CurrencyConverter({ topCurrencies, otherCurrencies, error }: Props) {
	const [selectedSymbol, setSelectedSymbol] = useState<RD.RemoteData<Error, RatioResponse>>(RD.initial);
	console.log('StaticProps: 💵 Currency Converter => ', { topCurrencies, otherCurrencies, error });

	const fetchSelectedOption = (ev: SyntheticEvent<HTMLSelectElement>) => {
		const currencySymbol = ev.target.value;
		setSelectedSymbol(RD.pending);

		return pipe(currencySymbol,
			CurrencyService.fetchCurrencyToUSDRatio,
			TE.map(ratio => ({ currency: currencySymbol, ratio })),
			TE.bimap(RD.failure, RD.success),
			TE.fold(
				(err) => TE.fromIO(() => setSelectedSymbol(err)),
				(res) => TE.fromIO(() => setSelectedSymbol(res))
			),
		)();
	}

	const generateOptions = (currencies: Props['topCurrencies'], optgroup?: string) => {
		if (!currencies?.length) return null;

		const OptWrapper = ({ children }: { children: React.ReactNode[] }) =>
			optgroup
				? (<optgroup label={optgroup}>{children}</optgroup>)
				: (<>{children}</>)

		return (
			<OptWrapper>
				{currencies.map((currency, i) => (
					<option value={currency[0]} key={i}>
						{`${currency[0]} - ${currency[1]}`}
					</option>
				))}
			</OptWrapper>
		)
	};

	const CurrencySelector = () => {
		return (
			<select onChange={fetchSelectedOption}>
				<option disabled selected>-- Select a currency -- </option>
				{generateOptions(topCurrencies, 'Most exchanged')}
				{generateOptions(otherCurrencies, 'A-Z')}
			</select>
		)
	};

	const FeedbackInfo = () => pipe(selectedSymbol,
		RD.fold(
			() => (<span>Waiting your input 🥺</span>),
			() => (<span>🇺🇸 → → please wait  → → 🌍</span>),
			(err) => (<span>{`Error caused by: ${err}`}</span>),
			(res) => (
				<>
					<span>{`USD → ${res.currency} ratio is: ${res.ratio}`}</span>
					<code>{JSON.stringify(selectedSymbol)}</code>
				</>
			),
		)
	);

	return (
		<Layout>
			<h1 className={styles.title}>
				Simulate currency conversions
			</h1>
			<fieldset>
				{error ? 'Something went wrong 😭' : (<CurrencySelector />)}
			</fieldset>
			<div className={styles.response}>
				<FeedbackInfo />
			</div>
		</Layout>
	)
}