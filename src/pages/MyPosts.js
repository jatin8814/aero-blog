import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { Link } from "react-router-dom";

function MyPosts({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => post.author === user.email);

      setPosts(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p>Please login to view your posts</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      <h1 className="text-3xl font-bold mb-6">My Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">You haven't created any posts yet</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {posts.map(post => (
            <div
              key={post.id}
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

              <div className="p-4">

                <h2 className="text-lg font-semibold">
                  {post.title}
                </h2>

                <div className="flex justify-between mt-4">

                  <Link to={"/post/" + post.id}>
                    <button className="text-indigo-400">
                      View
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyPosts;