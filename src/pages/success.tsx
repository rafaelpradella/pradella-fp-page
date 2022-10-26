import type { NextPage } from 'next'

import Layout from '../components/Layout'
import styles from '../styles/Home.module.scss'

const SuccessPage: NextPage = () => {
	return (
		<Layout>
			<h1 className={styles.title}>
				TUDO OK!
			</h1>
		</Layout>
	)
}

export default SuccessPage