import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // ✅ FIXED
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Explore from "./pages/Explore";
import MyPosts from "./pages/MyPosts";
import Mascot from "./components/Mascot";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>

      {/* 🐶 Mascot (global) */}
      <Mascot />

      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home user={user} />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CREATE */}
        <Route
          path="/create"
          element={user ? <CreatePost user={user} /> : <Login />}
        />

        {/* POST DETAILS */}
        <Route path="/post/:id" element={<PostDetails user={user} />} />

        {/* EXTRA PAGES */}
        <Route path="/explore" element={<Explore user={user} />} />
        <Route path="/myposts" element={<MyPosts user={user} />} />

      </Routes>

    </Router>
  );
}

export default App;