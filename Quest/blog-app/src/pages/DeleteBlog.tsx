import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchBlogById, handleDeleteBlog } from "../controllers/blogController";

const DeleteBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id is string
  const location = useLocation();
  const navigate = useNavigate();

  const passedBlog = location.state as
    | { title: string; content: string }
    | undefined;
  const [blog, setBlog] = useState<{ title: string; content: string } | null>(
    passedBlog || null
  );
  const [loading, setLoading] = useState(!passedBlog);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      if (!blog && id) {
        const blogData = await fetchBlogById(id); // <-- Use id string directly
        if (blogData) setBlog(blogData);
        setLoading(false);
      }
    };
    loadBlog();
  }, [id, blog]);

  const onDelete = async () => {
    if (!id) return;
    const result = await handleDeleteBlog(id); // <-- Use id string directly
    if (result.success) {
      setMessage("Blog deleted successfully.");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (!blog)
    return <p className="text-center text-red-600 mt-10">Blog not found.</p>;

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold text-center mb-2">Delete Blog</h1>
      <p className="text-center text-red-600">
        Are you sure you want to delete this blog?
      </p>
      <div className="border p-4 mt-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold">{blog.title}</h2>
        <p className="mt-2">{blog.content}</p>
      </div>
      <div className="flex gap-2 justify-center mt-4">
        <button
          className="bg-red-600 text-black px-4 py-2 rounded"
          onClick={onDelete}
        >
          Confirm Delete
        </button>
        <button
          className="bg-gray-400 text-black px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </div>
      {message && <p className="text-center mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default DeleteBlog;
