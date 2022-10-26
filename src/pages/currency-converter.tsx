import type { AppProps } from 'next/app'

import CurrencyService from 'services/currency';
import Layout from 'components/Layout'
import styles from 'styles/Home.module.scss'

export async function getStaticProps() {
	const currencyRes = await CurrencyService.fetchCurrenciesList();

	console.log(currencyRes);

	return {
	  props: {
			topCurrencies: null,
			otherCurrencies: null,
	  },
	}
}

export default function CurrencyConverter({ topCurrencies, otherCurrencies }: AppProps<{ topCurrencies: null, otherCurrencies: null}>) {
	
	const generateOptions = (currencies: Array<[string, string]>) => {
		if(!currencies || !currencies?.length) return null;

		return (
			currencies.map((currency, i) => (
				<option value={currency[0]} key={i}>{`${currency[0]} - ${currency[1]}`}</option>
			)
		)
	)};

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