import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import UpdateBlog from './pages/UpdateBlog';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import DeleteBlog from './pages/DeleteBlog';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light p-3 mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">Blog App</Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              <>
                <Link to="/create" className="nav-link">Create Blog</Link>
                <Link to="/logout" className="nav-link">Logout</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/update/:id" element={<UpdateBlog />} />
          <Route path="/delete/:id" element={<DeleteBlog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
