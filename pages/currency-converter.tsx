import type { NextPage } from 'next'
import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/Array';

import Layout from '../components/Layout'
import styles from '../styles/Home.module.scss'

const TOP_NOTCH_CURRENCIES = ['EUR', 'GBP', 'AUD', 'NZD', 'USD', 'CAD', 'CHF', 'JPY'];

export async function getStaticProps() {
	
	const isTopCurrency = (arr) => {
		return TOP_NOTCH_CURRENCIES.some((topSymbol) => {
			return topSymbol === arr[0];
		})
	};

	let myHeaders = new Headers();
	myHeaders.append("apikey", process.env.FIXER_API_KEY);

	const requestOptions = {
		method: 'GET',
		redirect: 'follow',
		headers: myHeaders
	};

	const symbolsRequest = await fetch("https://api.apilayer.com/fixer/symbols", requestOptions);
	const res = await symbolsRequest.json();

	const filterCurrencies = (currencies, predicate) => pipe(currencies,
			Object.entries,
			A.partition(predicate)
	);

	const filteredByImportance = filterCurrencies(res?.symbols, isTopCurrency);

	return {
	  props: {
			topCurrencies: filteredByImportance.right,
			otherCurrencies: filteredByImportance.left,
	  },
	}
}

export default function CurrencyConverter({ topCurrencies, otherCurrencies }) {
	const generateOptions = (currencies: Array<[string, string]>) => 
		currencies.map((currency, i) => (
			<option value={currency[0]} key={i}>{`${currency[0]} - ${currency[1]}`}</option>
		)
	);

	const CurrencySelector = () => {
		return (
			<select>
				<optgroup label='Most exchanged'>
					{generateOptions(topCurrencies)}
				</optgroup>
				{generateOptions(otherCurrencies)}
			</select>
		)
	};

	return (
		<Layout>
			<h1 className={styles.title}>
				Simulate currency conversions
			</h1>
			<fieldset>
				<CurrencySelector />
			</fieldset>
		</Layout>
	)
}