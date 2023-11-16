import { createPost } from "@/graphql/mutations";
import { API, Storage } from "aws-amplify";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { nanoid } from 'nanoid';
import dynamic from "next/dynamic";
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {ssr: false, });
import "easymde/dist/easymde.min.css"
import { withAuthenticator } from "@aws-amplify/ui-react";
import Image from "next/image";

const initialState = {title: " ", content: " "}

function CreatePost () {
    const [post, setPost] = useState(initialState)
    const {title, content} = post
    const router = useRouter()
    const [image, setImage] = useState(null)
    const imageFileInput = useRef(null)

    function onChange (e) {
        setPost(() => ({
            ...post , [e.target.name] : e.target.value
        }))
    }
    async function createNewPost (){
        if(!title || !content) return ;
        const id = nanoid()
        post.id = id

        if(image){
            const filename = `${image.name}_${nanoid()}`
            post.coverImage = filename
            await Storage.put (filename, image)
        }

        await API.graphql({
            query: createPost,
            variables: {input: post},
            authMode: "AMAZON_COGNITO_USER_POOLS" 
        })
        router.push(`/post/${id}`)
    }
    async function uploadImage (){
        imageFileInput.current.click()
    }
    function handleChange (e) {
        const fileUploaded = e.target.files[0]
        if(!fileUploaded) return 
        setImage(fileUploaded)
    }
    return (
        <div className="container mx-auto bg-gray-100 my-2 rounded-lg">
            <h1 className="text-center text-3xl font-semibold text-sky-400 py-5">Create New Post</h1>
            <div className="mx-8">
                <label className="text-xl font-bold text-sky-400 " htmlFor="Title">Your Title..</label><br />
                <input 
                    onChange={onChange}
                    type="text" name='title'
                    placeholder="Title heare"
                    value={post.title}
                    className="w-96 border-b p-2 mb-4 focus:outline-none" 
                />
            </div>

            <SimpleMdeReact
                className="mx-8"
               value ={post.content}
               name="content"
               onChange={(value) => setPost({...post, content:value})} 
            />
            <div className="mx-8 mb-5 flex flex-col justify-around">
                <div>
                    <label className="font-bold text-sky-400 text-lg" for="myfile">Select a Image: </label>
                    <input className="text-md font-semibold" type="file" onChange={handleChange} ref={imageFileInput} id="myfile" name="myfile" />
                </div>
                {
                    image && 
                    <Image className="m-3 border-4 border-sky-500 rounded-lg shadow-md" src={URL.createObjectURL(image)}  width={200}
                    height={200} alt='this is upload image here' />
                }
            </div>
            <button onClick={createNewPost} className="w-96 text-center text-lg font-semibold text-white bg-purple-400  py-2  ml-8  my-5 rounded hover:bg-opacity-80">Create Post</button>
        </div>
    )
}

export default withAuthenticator(CreatePost) ;