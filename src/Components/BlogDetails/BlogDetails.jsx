import { listPosts } from "@/graphql/queries"
import { API } from "aws-amplify"
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
      setPosts(postData.data.listPosts.items)
    }
  return (
    <div>
        <h1 className="text-3xl font-bold text-sky-500 text-center py-2">Blogs</h1>
        { posts && posts.length> 0 ?
            posts.map((post, index) => <BlogCard key={index} title={post.title} content={post.content} />)
            : 'There is no post'
        }
    </div>
  )
}

export default BlogDetails