import { useEffect, useState } from "react"
import Link from "next/link";
import { MainLayout } from "../components/MainLayout";
import { MyPosts } from "../interfaces/post";
import { useForm } from "react-hook-form";
import { User } from "../interfaces/user";
import  Router  from "next/router";

interface PostsPageProps {
    user: User
}

export default function ChangePassword ({user:serverPost}:PostsPageProps) {
    const [currentUser, setCurrentUser] = useState(serverPost)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    useEffect(() => {
        async function load() {
            const response = await fetch(`${process.env.API_URL}/currentUser/`)
            const user = await response.json()
            setCurrentUser(user)
        }
        if(serverPost === null) {
            load()
        }
    },[])

    const onSubmit = async (data) => {
        const response = await fetch(`${process.env.API_URL}/users/`)
        const users = await response.json()

        users && users.map(async (user)=>{
            if(user.id === currentUser.id && data.pasword === currentUser.password) {
                const user_response = await fetch(`${process.env.API_URL}/users/${user.id}`,{
                    method: 'PATCH', 
                    body: JSON.stringify({
                        password: data.new_password
                    }), // данные могут быть 'строкой' или {объектом}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                user_response && alert('Password changed successfuly')
            }
        })

    }

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

    if(!currentUser ) {
        return <MainLayout>
            <h1>Loading...</h1>
        </MainLayout>
    }

    if(currentUser && currentUser.id === undefined ){
        Logout()
    }


    return (
        <MainLayout>
            <h1 className="text-center">Change Password</h1>
            <form className="mt-8 space-y-6 m-auto w-3/12" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Current Password
                </label>
                <input
                  type="password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Current Password"
                  {...register("pasword", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  type="password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New Password" 
                  {...register("new_password", { required: true })}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
               Change
              </button>
              <button
                onClick={() =>Router.push('/')}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-5"
              >
               Go Home
              </button>
            </div>
          </form>
        </MainLayout>
    )
}


export async function getServerSideProps() {

    const response = await fetch(`${process.env.API_URL}/currentUser/`)
    const user = await response.json()

    return { props: {user} }
}