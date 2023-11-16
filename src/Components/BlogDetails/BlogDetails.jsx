import { listPosts } from "@/graphql/queries"
import { API, Storage } from "aws-amplify"
import { useEffect, useState } from "react"
import BlogCard from "../BlogCard/BlogCard"

function BlogDetails() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
      fetchPost()
    }, [])
  
    async function fetchPost () {
      const postData = await API.graphql({
        query: listPosts
      })
      const{items} = postData.data.listPosts
      const postWithImage = await Promise.all(
        items.map(async (post) => {
          if(post.coverImage){
            post.coverImage = await Storage.get(post.coverImage)
          }
          return post
        })
      )
      setPosts(postWithImage)
    }
  return (
    <div className="">
        <h1 className="text-4xl bg-gray-300 font-bold text-sky-500 text-center py-5">Blogs</h1>
        <div className="container mx-auto grid grid-cols-3 gap-5">
          { posts && posts.length> 0 ?
              posts.map((post, index) => <BlogCard key={index} post={post} />)
              : 'Loading......'
          }
        </div>
    </div>
  )
}

export default BlogDetails