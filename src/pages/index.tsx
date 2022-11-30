import type { NextPage } from 'next'
import Link from 'next/link'

import { Layout } from '~/components/Layout'
import styles from '~/styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className={styles.title}>
        Welcome to the FP-TS Test
      </h1>
      <div className={styles.grid}>
        <Link href="/form" passHref>
          <a className={styles.card}>
            <h2>Fill the Form &rarr;</h2>
            <p>Explore fp-ts features using a form example</p>
          </a>
        </Link>
        <Link href="/currency-converter" passHref>
          <a className={styles.card}>
            <h2>Exchange your money &rarr;</h2>
            <p>Using some advanced types from fp-ts</p>
          </a>
        </Link>
        <Link href="/video" passHref>
          <a className={styles.card}>
            <h2>Watch a nice video &rarr;</h2>
            <p>Wanna a break from learning FP? This is the place!</p>
          </a>
        </Link>
      </div>
    </Layout>
  )
}

export default Home