import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BlogForm from "../views/BlogForm";
import { fetchBlogById, handleUpdateBlog } from "../controllers/blogController";

const UpdateBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // id is string
  const location = useLocation();
  const navigate = useNavigate();

  const passedBlog = location.state as { title: string; content: string } | undefined;
  const [blog, setBlog] = useState<{ title: string; content: string } | null>(passedBlog || null);
  const [loading, setLoading] = useState(!passedBlog);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      if (!blog && id) {
        const blogData = await fetchBlogById(id);  // <-- Use id as string directly
        if (blogData) setBlog(blogData);
        setLoading(false);
      }
    };
    loadBlog();
  }, [id, blog]);

  const onSubmit = async (title: string, content: string) => {
    if (!id) return;
    const result = await handleUpdateBlog(id, title, content);  // <-- Use id as string
    if (result.success) {
      setMessage("Blog updated successfully!");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading blog...</p>;
  if (!blog) return <p className="text-center text-red-600 mt-10">Blog not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Update Blog Post</h1>
      {message && <div className="text-center text-green-600 mt-2">{message}</div>}
      <BlogForm
        onSubmit={onSubmit}
        initialTitle={blog.title}
        initialContent={blog.content}
      />
    </div>
  );
};

export default UpdateBlog;
