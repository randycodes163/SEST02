import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../views/BlogForm";
import { handleCreateBlog } from "../controllers/blogController";

const CreateBlog: React.FC = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (title: string, content: string) => {
    const result = await handleCreateBlog(title, content);
    if (result.success) {
      setMessage("Blog created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Create New Blog Post</h1>
      {message && <div className="text-center text-green-600 mt-2">{message}</div>}
      <BlogForm onSubmit={onSubmit} />
    </div>
  );
};

export default CreateBlog;
