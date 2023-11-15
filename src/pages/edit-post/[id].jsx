import { getPost } from '@/graphql/queries';
import { API } from 'aws-amplify';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function EditPost() {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const {id} = router.query;

  useEffect(() =>{
    fetchPost()
    async function fetchPost (){
      if (!id) return
      const postData = API.graphql ({
        query: getPost,
        variables: {id}
      })
      setPost((await postData).data.getPost)
    }
  })
  return (
    <div>EditPost {id}</div>
  )
}

export default EditPost