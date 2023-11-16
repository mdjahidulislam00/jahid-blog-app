import { getPost, listPosts } from "@/graphql/queries";
import { API, Storage } from "aws-amplify";
import Image from "next/image";
import { useRouter } from "next/router"; 
import { useEffect, useState } from "react";

export default function Post({post}) {
  const [coverImage, setCoverImage] = useState(null)
  console.log(coverImage)

  useEffect(()=> {
    updateCoverImage()
  },[])

  async function updateCoverImage (){
    if(post.coverImage){
      const imageKey = await Storage.get(post.coverImage);
      console.log(imageKey)
      setCoverImage(imageKey)
    }
  }

  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading......</div>;
  }
  return (
    <div className="flex justify-center bg-slate-100">
      {/* <h1 className="p-5 text-3xl font-semibold">
        {post.title}
      </h1> */}
      <div className="flex flex-col justify-center border-slate-200 m-5  p-2 ">
        <h1 className="text-2xl text-sky-400 font-semibold py-5 text-center">{post.title}</h1>
        {
          coverImage && 

          <Image className="rounded-lg" src={coverImage} alt='this is cover image' width={600} height={600} />

        }
        <div className="flex justify-between">
          <h1 className="text-sm font-semibold p-2 text-gray-600">Author: {post.username}</h1>
          <p className=" py-1 text-sm text-gray-500"> {new Date(post.createdAt).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}</p>
        </div>
        <p className="h-20 bg-white text-center rounded-lg p-5 overflow-y-auto mb-3">{post.content}</p>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts,
  });
  const paths = postData.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));
  return {
    paths,
    fallback: true, 
  };
}

export async function getStaticProps({ params  }) {
  const { id } = params;
  console.log('id',id)
  const postData = await API.graphql({
    query: getPost,
    variables: { id },
  });
  console.log(postData)
  return {
    props: {
      post: postData.data.getPost, 
    },
  };
}
