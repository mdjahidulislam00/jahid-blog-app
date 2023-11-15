import { getPost, listPosts } from "@/graphql/queries";
import { API } from "aws-amplify";
import { useRouter } from "next/router"; // Changed from "next/navigation" to "next/router"

export default function Post({post}) {

  const router = useRouter();
  console.log('router', router)
  if (router.isFallback) {
    return <div>Loading......</div>;
  }
  return (
    <div>
      <h1 className="p-5 text-3xl font-semibold">
        {post.title}
      </h1>
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
