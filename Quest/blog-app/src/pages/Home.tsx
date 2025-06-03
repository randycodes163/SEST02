import React, { useEffect, useState } from 'react';
import { fetchBlogs } from '../controllers/blogController';
import { Link } from 'react-router-dom';

interface Blog {
  id: number;
  title: string;
  content: string;
}

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err: any) {
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>Blog Posts</h2>
      {blogs.length === 0 ? (
        <p>No blog posts available.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="border p-3 mb-3">
            <h4>{blog.title}</h4>
            <p>{blog.content}</p>
           {isLoggedIn && (
  <div className="d-flex gap-2">
    <Link 
      to={`/update/${blog.id}`} 
      className="btn btn-sm btn-primary"
      state={blog} // 👈 pass blog data
    >
      Edit
    </Link>
    <Link 
      to={`/delete/${blog.id}`} 
      className="btn btn-sm btn-danger"
      state={blog} // 👈 optional for delete, depending on your logic
    >
      Delete
    </Link>
  </div>
)}

          </div>
        ))
      )}
    </div>
  );
};

export default Home;
