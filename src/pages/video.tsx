import { useRef } from 'react';
import type { NextPage } from 'next'
import Plyr, { APITypes } from 'plyr-react';
import "plyr-react/plyr.css";

import { Layout } from 'components/Layout';
import { FoggyBackground } from 'components/plyr/FoggyBackground';
import { SpeedHandler } from 'components/plyr/SpeedSlider';
import styles from 'styles/Home.module.scss';

const Video: NextPage = () => {
	const plyrEl = useRef<APITypes>(null);
	const BG_PALETTE = ['#985b3c', '#fbcc98', '#692115'];
	const POUR_UNE_VOIX_ID = '8NOBBvQRT-w' as const;

	const PlyrTube = ({ id }: { id: string }) => {
		const VIDEO_SRC = {
			type: 'video', sources: [
				{ src: id, provider: "youtube" }
			],
		}

		return (
			<div className={styles.videoFrame}>
				<Plyr ref={plyrEl} source={VIDEO_SRC}>
					<iframe
						allowFullScreen
						src={`https://www.youtube.com/embed/${id}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
						allow="autoplay"
					></iframe>
				</Plyr>
			</div>
		)
	}

	return (
		<Layout>
			<FoggyBackground videoRef={plyrEl} colors={BG_PALETTE} />
			<h1 className={styles.title}>
				Relax and watch this:
			</h1>
			<PlyrTube id={POUR_UNE_VOIX_ID} />
			<SpeedHandler videoRef={plyrEl} />
		</Layout>
	)
}

export default Video