'use client'
import Image from "next/image";
import postImage from '/public/imgae.jpg'
import Link from "next/link";

const BlogCard = ({ post }) => {
  const {id,title, content,username} = post
  return (
    <div className="">
      <Link href={`/post/${id}`}>
        <div className="max-w-2xl mx-auto my-3 p-1  bg-white shadow-md">
          <Image
            className="rounded-lg mb-1"
            src={postImage} // Update with the correct path to your image
            width={650}
            height={500}
            alt="Picture of the author"
          />
          <h2 className="bg-slate-200 h-20 text-sky-400 p-2 rounded-t-lg text-center text-xl font-bold">{title}</h2> 
          <h2 className="bg-slate-100 py-1 text-center text-sm font-semibold">Author: {username}</h2> 
          <p className="bg-slate-50 h-20 overflow-x-auto rounded-b-lg text-center p-3 text-gray-800 text-justify">{content}</p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
