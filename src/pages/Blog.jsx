// src/pages/Blog.jsx
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function Blog() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchBlogs();
    }, []);

    return (
        <div className="bg-white min-h-[calc(100vh-130px)] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center text-cyan-600">Tech Blog</h1>
                <div className="space-y-6">
                    {blogs.map((post) => (
                        <div key={post.id} className="bg-gray-50 p-6 rounded-lg shadow border">
                            <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
                            <p className="text-sm text-gray-500">{post.date}</p>
                            <p className="mt-2 text-gray-700 line-clamp-3">{post.summary}</p>
                        </div>
                    ))}
                    {blogs.length === 0 && <p className="text-center text-gray-500">No blog posts yet.</p>}
                </div>
            </div>
        </div>
    );
}

export default Blog;
