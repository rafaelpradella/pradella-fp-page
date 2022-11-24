import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import type { NextPage } from 'next'
import Plyr from 'plyr-react';
import "plyr-react/plyr.css";

import { ColorHex, ColorHexCodec } from 'types/colors.codec';
import Layout from 'components/Layout'
import styles from 'styles/Home.module.scss';
import { useState, useEffect } from 'react';

const Video: NextPage = () => {
	const BG_PALETTE = ['#985b3c', '#fbcc98', '#692115'];
	const POUR_UNE_VOIX_ID = '8NOBBvQRT-w' as const;

	const FoggyItem = ({ color }: { color: ColorHex }) => {
		const [translateX, setTranslateX] = useState<number>(0);

		useEffect(() => {
			const shouldAnimate = window?.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

			shouldAnimate && setTimeout(() => setTranslateX(Math.random() * 100 / 3), 1000);
		}, [translateX])

		return (
			<span style={{ backgroundColor: color, transform: `translateX(${translateX}%)` }}>
				{color}
			</span>
		)
	}

	const FoggyBackground = ({ colors }: { colors: Array<ColorHex> }) => pipe(colors,
		O.fromNullable,
		O.filter(list => list?.length >= 1),
		O.map(list =>
			list.filter(hex => E.isRight(ColorHexCodec.decode(hex))
			)),
		O.fold(
			() => (<code className='failed' />),
			(hexList) => (
				<code className={styles.foggyList}>
					{hexList.map(hex => (<FoggyItem color={hex} key={hex} />))}
				</code>
			),
		)
	)

	const PlyrTube = ({ id }: { id: string }) => {
		const VIDEO_SRC = { type: 'video', sources: [
			{ src: id, provider: "youtube" }
		],}

		return (
			<div className={styles.videoFrame}>
				<Plyr source={VIDEO_SRC}/>
			</div>
		)
	}

	return (
		<Layout>
			<FoggyBackground colors={BG_PALETTE} />
			<h1 className={styles.title}>
				Relax and watch this:
			</h1>
			<PlyrTube id={POUR_UNE_VOIX_ID} />
		</Layout>
	)
}

export default Video