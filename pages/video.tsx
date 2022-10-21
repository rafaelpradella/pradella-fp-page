import { url } from 'inspector';
import type { NextPage } from 'next'
import { platform } from 'os';
import Plyr from 'plyr-react';

import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

const Video: NextPage = () => {
	
	const PLAYER_SOURCE = {
		type: 'video',
		sources: [
		  {
			src: '76979871',
			provider: 'vimeo',
		  },
		],
	};
	
	return (
		<Layout>
			<h1 className={styles.title}>
				Relax and watch this:
			</h1>
			<Plyr source={PLAYER_SOURCE} />
		</Layout>
	)
}

export default Video