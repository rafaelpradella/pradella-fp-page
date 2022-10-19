import type { NextPage } from 'next'

import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

const Video: NextPage = () => {
	return (
		<Layout>
			<h1 className={styles.title}>
				Relax and watch this:
			</h1>
		</Layout>
	)
}

export default Video