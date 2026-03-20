import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  const handleLike = async (id) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      likes: increment(1),
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
{/* NAVBAR */}
<div className="fixed w-full bg-white/10 backdrop-blur-md border-b border-white/10 z-50">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

    {/* LEFT: LOGO + LINKS */}
    <div className="flex items-center gap-8">

      <Link to="/">
        <h1 className="text-2xl font-bold text-white cursor-pointer">
          AERO Blog
        </h1>
      </Link>

      <div className="hidden md:flex gap-6 text-gray-300">

        <Link to="/" className="hover:text-white transition">
          Home
        </Link>

        <Link to="/explore" className="hover:text-white transition">
          Explore
        </Link>

        <Link to="/myposts" className="hover:text-white transition">
          My Posts
        </Link>

      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">

      {/* SEARCH */}
      <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-white"
        />
      </div>

      {/* CREATE */}
      <Link to="/create">
        <button className="bg-indigo-600 px-4 py-2 rounded-lg">
          Create
        </button>
      </Link>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-lg"
      >
        Logout
      </button>

    </div>

  </div>
</div>

      {/* HERO */}
      <div className="relative h-[65vh] w-full pt-16 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
          className="absolute w-full h-full object-cover scale-110"
          alt=""
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-gray-950"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-5xl md:text-6xl font-extrabold">
            Explore Powerful Ideas
          </h2>
          <p className="text-gray-300 mt-4 text-lg">
            Discover. Learn. Create.
          </p>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="flex gap-3 justify-center mt-10 flex-wrap">
        {["Tech", "AI", "Life", "Travel"].map((tag) => (
          <button
            key={tag}
            className="px-4 py-2 bg-white/10 rounded-full hover:bg-indigo-600 transition"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* FEATURED */}
      <div className="max-w-7xl mx-auto px-8 mt-16">
        <h2 className="text-2xl font-bold mb-6">🔥 Featured Posts</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.slice(0, 2).map((post) => (
            <div
              key={post.id}
              className="relative h-64 rounded-xl overflow-hidden group"
            >
              <img
                src={
                  post.imageUrl ||
                  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                }
                className="absolute w-full h-full object-cover group-hover:scale-110 transition"
                alt=""
              />

              <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <h3 className="text-white text-xl font-bold">
                  {post.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LATEST POSTS */}
      <div className="max-w-7xl mx-auto px-8 mt-16 pb-20">
        <h2 className="text-2xl font-bold mb-6">🆕 Latest Posts</h2>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400">No posts yet 🚀</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden"
              >
                <img
                  src={
                    post.imageUrl ||
                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                  }
                  className="w-full h-48 object-cover"
                  alt=""
                />

                <div className="p-6">
                  <h3 className="text-xl font-semibold">{post.title}</h3>

                  <p className="text-gray-400 text-sm mt-2">
                    {post.content?.slice(0, 120)}...
                  </p>

                  <div className="flex justify-between items-center mt-4">

                    <Link to={"/post/" + post.id}>
                      <button className="text-indigo-400">
                        Read →
                      </button>
                    </Link>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="text-pink-500"
                      >
                        ❤️ {post.likes || 0}
                      </button>

                      {user && user.email === post.author && (
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-black/40 border-t border-white/10 text-center py-6">
        <p className="text-gray-400">
          © 2026 AERO Blog — Built with React & Firebase
        </p>
      </div>

    </div>
  );
}

export default Home;