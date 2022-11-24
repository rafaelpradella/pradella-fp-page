import * as E from 'fp-ts/Either';
import { IO } from 'fp-ts/IO';
import { io } from 'fp-ts';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import type { NextPage } from 'next'
import Plyr, { APITypes } from 'plyr-react';
import "plyr-react/plyr.css";

import { ColorHex, ColorHexCodec } from 'types/colors.codec';
import Layout from 'components/Layout';
import styles from 'styles/Home.module.scss';
import { useState, useEffect, useRef, SyntheticEvent, RefObject } from 'react';
import { logPipe } from 'helpers/functional';

const Video: NextPage = () => {
	const plyrEl = useRef<APITypes>(null);

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

	const FoggyBackground = ({ colors, videoRef }: { colors: Array<ColorHex>, videoRef: RefObject<APITypes> }) => {
		return pipe(colors,
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
	}

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

	const SpeedHandler = ({ videoRef }: { videoRef: RefObject<APITypes> }) => {
		const [speedInfo, setSpeedInfo] = useState<number>(1);
		const changePace = (ev: SyntheticEvent<HTMLInputElement>): IO<void> => pipe(ev,
			O.fromNullable,
			O.map(ev => ev?.target?.valueAsNumber),
			O.fold(
				() => io.of(undefined),
				(value) => {
					videoRef.current.plyr.speed = value;
					setSpeedInfo(value);
				}
			)
		);

		return (
			<>
				<input
					className={styles.speedSlider}
					type="range"
					min="0.5"
					max="2"
					step="0.25"
					defaultValue={1}
					onChange={ev => changePace(ev)}
				/>
				<span>Actual Speed: {speedInfo}x</span>
			</>
		)
	}

	return (
		<Layout>
			<FoggyBackground colors={BG_PALETTE} />
			<h1 className={styles.title}>
				Relax and watch this:
			</h1>
			<PlyrTube id={POUR_UNE_VOIX_ID} />
			<SpeedHandler videoRef={plyrEl} />
		</Layout>
	)
}

export default Video