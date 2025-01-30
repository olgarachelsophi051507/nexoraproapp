import Head from 'next/head';
import React from 'react';
import LoginButton from '../components/common/LoginButton';
import Layout from '../components/layout';
import withAuth from '../lib/withAuth';
import { Store } from '../lib/store';
import styles from '../styles/Login.module.css';

type Props = {
  store: Store;
  isMobile: boolean;
  firstGridItem: boolean;
};

function Login({ store, isMobile, firstGridItem }: Props) {
  return (
    <Layout store={store} isMobile={isMobile} firstGridItem={firstGridItem}>
      <div className={styles.container}>
        <Head>
          <title>Exclusive Access for Realtors | NexoraPro</title>
          <meta
            name="description"
            content="Join NexoraPro to scale your real estate business with high-performing tools and strategies."
          />
        </Head>

        <h1 className={styles.title}>Elevate Your Real Estate Business 🚀</h1>

        <p className={styles.text}>
          Join a community of top-performing agents and unlock exclusive tools, resources, and
          strategies to <strong>close more deals and grow your business.</strong>
        </p>

        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.blueButton}`}>Join Now 🚀</button>
          <LoginButton /> {/* ✅ Usando el botón de login correcto */}
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Login, { logoutRequired: true });
