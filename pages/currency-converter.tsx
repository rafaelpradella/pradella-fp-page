import type { NextPage } from 'next'

import Layout from '../components/Layout'
import styles from '../styles/Home.module.scss'

const CurrencyConverter: NextPage = ({ symbols, currenciesData }) => {

	const CurrencySelector = () => {
		return (
			<select>
				{symbols?.map((symbol, i) => (
        			<option value={symbol} key={i}>{`${symbol} - ${currenciesData[symbol]}`}</option>
      			))}
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
				<select>
					
				</select>
			</fieldset>
		</Layout>
	)
}

export async function getStaticProps() {
	let myHeaders = new Headers();
	myHeaders.append("apikey", process.env.FIXER_API_KEY);

	const requestOptions = {
		method: 'GET',
		redirect: 'follow',
		headers: myHeaders
	};

	const symbolsRequest = await fetch("https://api.apilayer.com/fixer/symbols", requestOptions);
	const res = await symbolsRequest.json();

	return {
	  props: {
		symbols: Object.keys(res?.symbols),
		currenciesData: res?.symbols,
	  },
	}
  }

export default CurrencyConverter