import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost({ user }) {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* -------- Grammar Correction -------- */

  const fixGrammar = async () => {

    try {

      const plainText = content
        .replace(/<\/p>/g, "\n")
        .replace(/<[^>]*>/g, "");

      const response = await fetch(
        "https://api.languagetool.org/v2/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            text: plainText,
            language: "en-US"
          })
        }
      );

      const data = await response.json();

      let correctedText = plainText;

      data.matches.forEach(match => {
        if (match.replacements.length > 0) {
          correctedText = correctedText.replace(
            plainText.substr(match.offset, match.length),
            match.replacements[0].value
          );
        }
      });

      setContent(correctedText);

    } catch (error) {

      console.error(error);
      alert("Grammar service unavailable.");

    }

  };

  /* -------- Translation -------- */

  const translateBlog = async (lang) => {

    try {

      const plainText = content
        .replace(/<\/p>/g, "\n")
        .replace(/<[^>]*>/g, "");

      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plainText)}&langpair=en|${lang}`
      );

      const data = await response.json();

      if (data.responseData.translatedText) {
        setContent(data.responseData.translatedText);
      } else {
        alert("Translation failed.");
      }

    } catch (error) {

      console.error(error);
      alert("Translation service unavailable.");

    }

  };

  /* -------- Submit Post -------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!user) {
      alert("You must be logged in");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    try {

      setLoading(true);

      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        content: content,
        imageUrl:
          imageUrl.trim() ||
          "https://source.unsplash.com/800x600/?blog,technology,writing",
        author: user.email,
        createdAt: serverTimestamp(),
      });

      navigate("/");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-6">

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6"
        onSubmit={handleSubmit}
      >

        <h2 className="text-3xl font-bold text-indigo-700 text-center">
          Create New Post
        </h2>

        {/* Title */}

        <input
          type="text"
          placeholder="Post Title"
          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Image URL */}

        <input
          type="text"
          placeholder="Image URL (optional)"
          className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* Image Preview */}

        {imageUrl && (
          <div className="h-40 overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) =>
                (e.target.src =
                  "https://source.unsplash.com/800x600/?abstract")
              }
            />
          </div>
        )}

        {/* Blog Editor */}

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
        />

        {/* AI Tools */}

        <div className="flex gap-4">

          <button
            type="button"
            onClick={fixGrammar}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Fix Grammar
          </button>

          <select
            onChange={(e) => {
              if (e.target.value !== "default") {
                translateBlog(e.target.value);
              }
            }}
            className="border px-4 py-2 rounded-lg"
          >

            <option value="default">Translate</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="de">German</option>
            <option value="fr">French</option>

          </select>

        </div>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:scale-105"
          }`}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>

      </motion.form>

    </div>

  );
}

export default CreatePost;