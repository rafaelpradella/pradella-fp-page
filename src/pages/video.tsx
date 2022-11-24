import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';
import type { NextPage } from 'next'

import { ColorHex, ColorHexCodec } from 'types/colors.codec';
import Layout from 'components/Layout'
import styles from 'styles/Home.module.scss';

const Video: NextPage = () => {
	const BG_PALETTE = ['#985b3c', '#fbcc98', '#692115'] as const;
	const POUR_UNE_VOIX_ID = '8NOBBvQRT-w' as const;

	const FoggyItem = ({ color } : { color: ColorHex }) => {
		return (
			<span style={{ backgroundColor: color }}>
				{color}
			</span>
		)
	}

	const FoggyBackground = ({ colors }: { colors: ColorHex[] }) => pipe(colors,
			O.fromNullable,
			O.filter(list => list?.length > 1),
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
		return (
			<span>{id}</span>
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