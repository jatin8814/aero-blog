import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Explore() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      <h1 className="text-3xl font-bold mb-6">Explore Posts</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-8 rounded bg-gray-800 outline-none"
      />

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <p className="text-gray-400">No posts found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 rounded-xl overflow-hidden border border-white/10"
            >

              <img
                src={
                  post.imageUrl ||
                  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                }
                className="w-full h-48 object-cover"
                alt=""
              />

              <div className="p-4">

                <h2 className="text-lg font-semibold">
                  {post.title}
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  {post.content?.slice(0, 100)}...
                </p>

                <Link to={"/post/" + post.id}>
                  <button className="mt-4 text-indigo-400">
                    Read →
                  </button>
                </Link>

              </div>

            </motion.div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Explore;