import NextNProgress from "nextjs-progressbar"
import "../styles/globals.css"

export default function App ({Component, pageProps}) {
    return <>
        <NextNProgress
            color="#29D"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
        />
        <Component {...pageProps} />
    </>
}