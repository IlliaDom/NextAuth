import { NextPageContext } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import {MainLayout} from "../components/MainLayout"
import { User } from "../interfaces/user";

interface UserData {
    user: User
}

export default function Index({user:serverPost}:UserData) {

    const [user, setUser] = useState(serverPost)


    useEffect(() => {
        async function load() {
            const response = await fetch(`${process.env.API_URL}/currentUser/`)
            const user = await response.json()
            setUser(user)
        }
        if(serverPost === null) {
            load()
        }
    },[])


    const Logout = async ()=> {
        const response = await fetch(`${process.env.API_URL}/currentUser/`,{
            method: 'POST', 
            body: JSON.stringify({}), // данные могут быть 'строкой' или {объектом}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const user = await response.json()
        Router.push('/login')
    }

    if(!user) {
        return <MainLayout>
            <h1>Loading...</h1>
        </MainLayout>
    }

    if(user && user.id === undefined ){
        Logout()
    }

    return (
        <MainLayout>
            <Head>
                <title>User Data</title>
            </Head>
            <h1 className="text-1xl font-bold underline text-center mt-6">User {user && user.email}</h1>
            <p className="text-center mt-6">User Birth Date: {user && user.birth_date}</p>
            <button
                onClick={Logout}
                className="group relative w-full flex align-center m-auto justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 w-3/12"
              >
                Log out
              </button>
              <button
                onClick={()=>Router.push('change_password')}
                className="group relative w-full flex align-center m-auto justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5 w-3/12"
              >
                Change password
              </button>
        </MainLayout>
    )
}   

Index.getInitialProps = async ({req}:NextPageContext) => {
    if(!req){
        return {
            user:null
        }
    }
    const response = await fetch(`${process.env.API_URL}/currentUser/`)
    const user = await response.json()

    return { user }
}