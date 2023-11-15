import { createPost } from "@/graphql/mutations";
import { API } from "aws-amplify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { nanoid } from 'nanoid';
import "easymde/dist/easymde.min.css"
import SimpleMdeReact from "react-simplemde-editor";

const initialState = {title: " ", content: " "}
function CreatePost () {
    const [post, setPost] = useState(initialState)
    const {title, content} = post
    const router = useRouter()

    function onChange (e) {
        setPost(() => ({
            ...post , [e.target.name] : e.target.value
        }))
    }
    async function createNewPost (){
        if(!title || !content) return ;
        const id = nanoid()
        post.id = id

        await API.graphql({
            query: createPost,
            variables: {input: post},
            authMode: "AMAZON_COGNITO_USER_POOLS" 
        })
        //router.push(`/post/${id}`)
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
                    className="border-b p-2 mb-4 focus:outline-none" 
                />
            </div>

            <SimpleMdeReact
                className="mx-8"
               value ={post.content}
               onChange={(value) => setPost({...post, content:value})} 
            />
        </div>
    )
}

export default CreatePost;