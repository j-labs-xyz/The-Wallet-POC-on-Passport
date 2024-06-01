/* eslint-disable @next/next/no-img-element */
// Next, React
import Head from "next/head"

import styles from "../ui/styles/Home.module.css"

import { GreetingSection } from "../ui/components/GreetingSection"
import { ImageSection } from "../ui/components/ImageSection"
import { Page } from "../ui/0xPass/page"

function HomePage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Internet Computer</title>
      </Head>
      <main className={styles.main}>
        <h3 className={styles.title}>
          Welcome to Next.js Internet Computer Starter Template!
        </h3>

        <img src="/logo.png" alt="DFINITY logo" className={styles.logo} />

        <GreetingSection />
        <ImageSection />
        <Page />
      </main>
    </div>
  )
}

export default HomePage
