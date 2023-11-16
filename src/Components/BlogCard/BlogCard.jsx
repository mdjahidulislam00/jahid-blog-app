'use client'
import Image from "next/image";
import postImage from '/public/imgae.jpg'
import Link from "next/link";

const BlogCard = ({ post }) => {
  const {id,title, content, username, coverImage} = post
  return (
    <div className="">
      <Link href={`/post/${id}`}>
        <div className="max-w-2xl mx-auto my-3 p-1  bg-white shadow-md">
          {
            coverImage && 
            <Image
            className="rounded-lg w-[490px] h-80"
            src={coverImage}
            width={650}
            height={400}
            alt={title}
          />
          }
          <h2 className="bg-slate-200 h-20 text-sky-400 p-2 rounded-t-lg text-center text-xl font-bold">{title}</h2> 
          <div className="flex justify-between px-1">
            <h2 className="py-1 text-center text-sm font-semibold">Author: {username}</h2> 
            <p className=" py-1 text-sm text-gray-500"> {new Date(post.createdAt).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}</p>
          </div>
          <p className="bg-slate-50 h-20 overflow-x-auto rounded-b-lg text-center p-3 text-gray-800 text-justify">{content}</p>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
