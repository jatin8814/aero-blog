import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

function PostDetails({ user }) {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // 🔥 FETCH POST + INCREMENT VIEWS
  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = { id: docSnap.id, ...docSnap.data() };
        setPost(postData);

        // 🔥 ADD THIS (TRENDING SYSTEM)
        await updateDoc(docRef, {
          views: increment(1),
        });
      }
    };

    fetchPost();
  }, [id]);

  // 🔥 FETCH COMMENTS
  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(data);
    });

    return () => unsubscribe();
  }, [id]);

  // 🔥 ADD COMMENT
  const handleComment = async () => {
    if (!comment.trim() || !user) return;

    let mentionedUser = null;

    if (comment.includes("@")) {
      mentionedUser = post.author;
    }

    await addDoc(collection(db, "comments"), {
      postId: id,
      text: comment,
      authorEmail: user.email,
      mentionedUser,
      createdAt: serverTimestamp(),
    });

    setComment("");
  };

  // 🔥 FILTER COMMENTS
  const visibleComments = comments.filter(c => {
    if (!c.mentionedUser) return true;
    return user?.email === c.mentionedUser;
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* IMAGE */}
      <img
        src={
          post.imageUrl ||
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        }
        className="w-full h-[400px] object-cover"
        alt=""
      />

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-4">
          {post.title}
        </h1>

        <p className="text-gray-400 mb-2">
          By {post.author}
        </p>

        {/* 🔥 SHOW VIEWS */}
        <p className="text-gray-500 mb-2">
          👁 {post.views || 0} views
        </p>

        <p className="text-gray-500 mb-6 text-sm">
          {post.createdAt?.toDate().toLocaleString()}
        </p>

        <p className="text-lg leading-relaxed text-gray-200">
          {post.content}
        </p>

        {/* 🔥 COMMENTS */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-6">
            Comments
          </h2>

          {user && (
            <div className="flex gap-2 mb-6">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment... (use @ to mention author)"
                className="flex-1 p-3 bg-gray-800 rounded outline-none"
              />

              <button
                onClick={handleComment}
                className="bg-indigo-600 px-4 rounded"
              >
                Post
              </button>
            </div>
          )}

          {visibleComments.length === 0 ? (
            <p className="text-gray-400">No comments yet</p>
          ) : (
            visibleComments.map(c => (
              <div
                key={c.id}
                className="bg-gray-800 p-4 rounded mb-3 border border-white/10"
              >
                <p className="text-sm text-gray-400">
                  {c.authorEmail}
                </p>

                <p className="mt-1">{c.text}</p>

                {c.mentionedUser && (
                  <p className="text-xs text-indigo-400 mt-1">
                    🔒 Only visible to author
                  </p>
                )}
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default PostDetails;