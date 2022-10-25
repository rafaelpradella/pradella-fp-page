import type { NextPage } from 'next'

import CurrencyService from '../services/currency';
import Layout from '../components/Layout'
import styles from '../styles/Home.module.scss'



export async function getStaticProps() {
	const currencyRes = await CurrencyService.fetchCurrenciesListByRelevance();

	return {
	  props: {
			topCurrencies: currencyRes.right,
			otherCurrencies: currencyRes.left,
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