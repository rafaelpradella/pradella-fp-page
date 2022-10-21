import type { NextPage } from 'next'

import Layout from '../components/Layout'
import styles from '../styles/Home.module.scss'

const List: NextPage = () => {
	return (
		<Layout>
			<h1 className={styles.title}>
				Listing some things
			</h1>
		</Layout>
	)
}

export default List