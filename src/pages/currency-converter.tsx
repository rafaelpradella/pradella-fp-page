import CurrencyService, { CurrencyMatrix } from 'services/currency';
import Layout from 'components/Layout'
import styles from 'styles/Home.module.scss'
import * as E from 'fp-ts/lib/Either';
import React from 'react';

type Props = {
	topCurrencies: CurrencyMatrix | null,
	otherCurrencies: CurrencyMatrix | null,
	error: string | null,
}

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

	console.log('TOP PROP', topCurrencies);
	console.log('OTHERS PROP', otherCurrencies);
	console.log('ERROR PROP', error);
	
	const generateOptions = (currencies: Props['topCurrencies'], optgroup?: string) => {
		if(!currencies?.length) return null;
		
		const OptWrapper = ({children}: { children: React.ReactNode[]}) =>
			optgroup
				? (<optgroup label={optgroup}>{children}</optgroup>)
				: (<>{children}</>)

		return (
				<OptWrapper>
					{ currencies.map((currency, i) => (
						<option value={currency[0]} key={i}>
							{`${currency[0]} - ${currency[1]}`}
						</option>
					))}
				</OptWrapper>
	)};

	const CurrencySelector = () => {
		return (
			<select>
				<option disabled selected value=''> -- Select a currency -- </option>
				{generateOptions(topCurrencies, 'Most exchanged')}
				{generateOptions(otherCurrencies, 'A-Z')}
			</select>
		)
	};

	return (
		<Layout>
			<h1 className={styles.title}>
				Simulate currency conversions
			</h1>
			<fieldset>
				{ error ? 'Something went wrong 😭' : (<CurrencySelector />) }
			</fieldset>
		</Layout>
	)
}