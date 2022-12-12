import React, { useState } from 'react';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/function';

import { USDRatioFromOption, RDRatioResponse } from '~/controllers/CurrencyController';
import type { CurrencyMatrix } from '~/services/currency';
import { Layout } from '~/components/Layout'
import styles from '~/styles/Home.module.scss'

export { getStaticProps } from '~/controllers/CurrencyController';

type Props = {
	topCurrencies: CurrencyMatrix | null,
	otherCurrencies: CurrencyMatrix | null,
	error: string | null,
}

const CurrencyConverter: React.FC<Props> = ({ topCurrencies, otherCurrencies, error }) => {
	const [selectedSymbol, setSelectedSymbol] = useState<RDRatioResponse>(RD.initial);
	console.log('StaticProps: 💵 Currency Converter => ', { topCurrencies, otherCurrencies, error });

	const OptionsSection = ({ title, currencies }: { title: string, currencies: CurrencyMatrix | null }) => {
		if (!currencies?.length) return null;

		const OptWrapper = ({ children }: { children: React.ReactNode[] }) =>
			title
				? (<optgroup label={title}>{children}</optgroup>)
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
			<select
				onChange={(ev) => USDRatioFromOption(ev?.target?.value, setSelectedSymbol)}
			>
				<option disabled selected>-- Select a currency -- </option>
				<OptionsSection title='Most exchanged' currencies={topCurrencies} />
				<OptionsSection title='A-Z' currencies={otherCurrencies} />
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
				{error ? null : (<FeedbackInfo />)}
			</div>
		</Layout>
	)
}

export default CurrencyConverter;