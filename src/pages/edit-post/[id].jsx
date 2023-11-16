import { updatePost } from '@/graphql/mutations';
import { getPost } from '@/graphql/queries';
import { API, Storage } from 'aws-amplify';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';


function EditPost() {
  const [post, setPost] = useState(null);
  const [coverImage, setCoverImage] = useState(null)
  const [localImage, setLocalImage] = useState(null)
  const fileInput = useRef()
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
        if(postData.data.getPost.coverImage){
          updateCoverImage(postData.data.getPost.coverImage)
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      }
    }
    fetchPost();

  },);

  if (!post) return null;

  async function updateCoverImage(coverImage){
    const imageKey = await Storage.get(coverImage)
    console.log(post)
    setCoverImage(imageKey)
  }
  async function uploadImage(){
    fileInput.current.click()
  }
  function handleChange (e){
    const fileUpload = e.target.files[0];
    console.log(fileUpload)
    if(!fileUpload) return
    setCoverImage(fileUpload)
    setLocalImage(URL.createObjectURL(fileUpload))
  }

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
    if(coverImage && localImage){
      const fileName = `${coverImage.name}_${nanoid()}`
      postUpdated.coverImage= fileName
      await Storage.put(fileName, coverImage);
    }
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
        {
          coverImage &&
          <div>
        {console.log(coverImage)}
        
            <div className='w-[500px] h-[300px]'>
              <Image className='my-5 border-4 border-sky-400 rounded' src={localImage ? localImage : coverImage} alt={title} width={520} height={300} />
            </div>
            <input className='absolute w-0 h-0' type="file" ref={fileInput} onChange={handleChange} />
            <button
            onClick={uploadImage}
            className='bg-purple-400 text-white font-semibold py-2 px-6 rounded hover:bg-opacity-80'
            type="button"
        >
          Update image
        </button>
          </div>
        }
        <button
          onClick={updateCurrentPost}
          className='bg-sky-400 text-white font-semibold py-2 px-6 rounded hover:bg-opacity-80'
          type="button"
        >
          Edited
        </button>
      </div>
    </div>
  );
}

export default EditPost;
