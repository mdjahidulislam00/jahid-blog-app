import { Auth, Hub } from 'aws-amplify';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const[signedUser, setSignedUser] = useState(false) 

    useEffect(()=>{
      authListener()
    },[])

    async function authListener (){   
        Hub.listen("auth", (data) => {
            switch(data.payload.event){
                case "signIn":
                    return setSignedUser(true)
                case "signOut":
                    return setSignedUser(false)
            }
        })
        try{
          await Auth.currentAuthenticatedUser
          setSignedUser(true)
        }catch(err){
          console.log(err)
        }

    }

  return (
    <nav className="bg-blue-500 p-5">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <button className="text-white font-bold text-3xl">JAHID BLOGS</button>
            </Link>
          </div>
          <div className="space-x-8 text-lg">
            <Link href="/">
              <button className="text-white hover:text-opacity-80">Home</button>
            </Link>
            <Link href="/create-post">
              <button className="text-white hover:text-opacity-80">Create Post</button>
            </Link>
            <Link href="/profile">
              <button className="text-white hover:text-opacity-80">Profile</button>
            </Link>
            {
                signedUser ?
                <Link href="/my-post">
                <button className="text-white hover:text-opacity-80">My Post</button>
              </Link>
              : ' '
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
