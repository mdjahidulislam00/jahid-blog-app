import { updatePost } from '@/graphql/mutations';
import { getPost } from '@/graphql/queries';
import { API } from 'aws-amplify';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function EditPost() {
  const [post, setPost] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const postData = await API.graphql({
          query: getPost,
          variables: { id },
        });
        setPost(postData.data.getPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      }
    }
    fetchPost();
  }, [id]);

  if (!post) return null;

  const { title, content } = post;

  function onChangePost(e) {
    setPost({ ...post, [e.target.name]: e.target.value });
  }

  async function updateCurrentPost() {
    if (!title || !content) return;

    const postUpdated = {
      id,
      content,
      title,
    };
    try {
      await API.graphql({
        query: updatePost,
        variables: { input: postUpdated },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      router.push('/my-post');
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle error
    }
  }

  return (
    <div className='container mx-auto'>
      <h1 className='text-center py-10 text-2xl font-semibold text-sky-400'>Edit Post</h1>
      <div className='bg-gray-100 p-10 w-[600px] flex justify-center flex-col space-y-3'>
        <label className='font-semibold' htmlFor="title">Title: </label>
        <input
          className='p-2 rounded mb-3'
          onChange={onChangePost}
          type="text"
          name="title"
          value={title}
          placeholder='Title'
        />
        <label className='font-semibold' htmlFor="content">Content: </label>
        <textarea
          className='h-40 p-2 rounded'
          onChange={onChangePost}
          name="content"
          value={content}
          placeholder='Content'
        />
        <button
          onClick={updateCurrentPost}
          className='bg-sky-400 text-white font-semibold py-2 px-6 rounded hover:bg-opacity-80'
          type="button"
        >
          Edit the post
        </button>
      </div>
    </div>
  );
}

export default EditPost;
