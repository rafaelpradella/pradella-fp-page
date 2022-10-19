import type { NextPage } from 'next'

import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1 className={styles.title}>
        Welcome to the FP-TS Test
      </h1>
      <div className={styles.grid}>
        <a href="/form" className={styles.card}>
          <h2>Fill the Form &rarr;</h2>
          <p>Explore fp-ts features using a form example</p>
        </a>
      </div>
    </Layout>
  )
}

export default Home