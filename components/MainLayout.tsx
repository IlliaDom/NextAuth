import Head from "next/head";
import Nav from "./Nav"

export function MainLayout ({children,title = 'App'}) {
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <nav>
                <Nav />
            </nav>
            <main>
                {children}
            </main>
        </>
    )
}