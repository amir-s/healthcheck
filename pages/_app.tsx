import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContext, useAppReducer } from "../components/AppState/appState";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useAppReducer();
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default App;
