import { postsByUsername } from "@/graphql/queries";
import { API, Auth, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import { deletePost as deletePostMutation } from "@/graphql/mutations";
import Link from "next/link";
import Image from "next/image";

function MyPost() {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const {
        attributes: { sub },
        username,
      } = await Auth.currentAuthenticatedUser();
      const postData = await API.graphql({
        query: postsByUsername,
        variables:  { username: `${sub}::${username}` },
      });
      // setUserPosts(postData.data.postsByUsername.items || []);

      const{items} = postData.data.postsByUsername
      const postWithImage = await Promise.all(
        items.map(async (post) => {
          if(post.coverImage){
            post.coverImage = await Storage.get(post.coverImage)
          }
          return post
        })
      )
      setUserPosts(postWithImage)
    } catch (error) {
      console.error("Error fetching posts:", error);
      setUserPosts([]);
    }
  }
  async function deletePost (id){
    try{
      await API.graphql({
        query: deletePostMutation,
        variables: {input: {id}},
        authMode: "AMAZON_COGNITO_USER_POOLS"
      })
     fetchPosts() 
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="bg-gray-200 pb-10">
      <h1 className="text-3xl text-sky-400 font-semibold text-center bg-gray-300 py-10 mb-5">My Posts</h1>
      {userPosts.map((post) => (
        <div key={post.id} className="w-[600px] m-5 p-3 border-2 bg-white  rounded-lg shadow-lg">
          <h2 className="text-xl  text-sky-400 font-bold my-4">{post.title}</h2>
          {
            post.coverImage && 
            <Image className="w-60 h-60 p-5 rounded-full"  src={post.coverImage} alt={post.title} width={300} height={300} />
          }
          <p className=" py-1 text-sm text-gray-500"> {new Date(post.createdAt).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}</p>
          <div className=" mt-5 flex space-x-3">
            <Link href={`/edit-post/${post.id}`}> <button className="bg-gray-200 text-purple-400 px-2 py-1  rounded-md font-semibold hover:bg-slate-100">Edit Post</button> </Link>
            <Link href={`/post/${post.id}`}><button className="bg-gray-200 text-purple-400 px-2 py-1  rounded-md font-semibold hover:bg-slate-100">View Post</button></Link>
            <button onClick={()=> deletePost(post.id)} className="bg-gray-200 text-red-400 px-2 py-1  rounded-md font-semibold hover:bg-slate-100">Delete Post</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyPost;
