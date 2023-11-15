import { withAuthenticator, AmplifySignOut, Authenticator } from "@aws-amplify/ui-react";
import { Auth} from "aws-amplify";
import { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setUser(userData);
    } catch (error) {
      console.log("Error checking user:", error);
      setUser(null);
    }
  }

  if (!user) return null;

  return (
    // <div className="bg-gray-300 p-10 text-sky-300">
    //   <h1 className="bg-white p-2 text-center rounded text-3xl font-semibold tracking-wide mt-6 mb-8">User Profile</h1>
    //   <h1 className="font-medium text-gray-700 mb-2">User: {user.username}</h1>
    //   <p className="text-sm text-gray-800 mb-6">User Email: {user.attributes.email}</p>
    //   <AmplifySignOut />  
    // </div>
    <Authenticator>
    {({ signOut, user }) => (
      <div className="text-center">
         <h1 className="bg-slate-300 p-2 text-center rounded text-3xl font-semibold tracking-wide mt-6 mb-8">User Profile</h1>
         <h1 className="text-xl font-semibold text-sky-400 mb-2">{user.username}</h1>
         <p className="text-lg font-semibold text-sky-500 mb-6">{user.attributes.email}</p>  
        <button className="bg-yellow-400 py-2 px-3 text-white font-semibold rounded-md hover:bg-opacity-80" onClick={signOut}>Sign out</button>
      </div>
    )}
  </Authenticator>
  );
}

export default withAuthenticator(Profile);
