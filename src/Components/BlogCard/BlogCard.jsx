'use client'
import Image from "next/image";
import postImage from '/public/imgae.jpg'

const BlogCard = ({ title, content }) => {
  console.log(title, content);

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 bg-white shadow-md">
      <Image
        className="rounded-lg mb-1"
        src={postImage} // Update with the correct path to your image
        width={650}
        height={500}
        alt="Picture of the author"
      />
      <h2 className="bg-slate-200 p-2 rounded-t-lg text-center text-3xl font-bold">{title}</h2>
      <p className="bg-slate-50 rounded-b-lg text-center py-3 text-gray-800">{content}</p>
    </div>
  );
};

export default BlogCard;
