import type { NextPage } from "next";
import Head from "next/head";
import { EksekutifData } from "../shared/components";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pusat Pemantauan Komunikasi AHEMCE</title>
        <meta name="description" content="Dashboard Pusat Pemantauan Komunikasi AHEMCE" />
      </Head>
      <main>
        <EksekutifData />
      </main>
    </>
  );
};

export default Home;
