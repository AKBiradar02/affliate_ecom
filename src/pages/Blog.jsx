import { useEffect, useState } from 'react';
import { db } from '../firebase.js';
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
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Blog</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Discover tips, insights, and reviews about our favorite Amazon products
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((post) => (
                        <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-6">
                                <p className="text-blue-600 text-sm font-semibold mb-2">{post.date}</p>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                                <p className="text-gray-600 line-clamp-3 mb-4">{post.summary}</p>
                                <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                    Read More →
                                </button>
                            </div>
                        </article>
                    ))}
                    {blogs.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Blog Posts Yet</h2>
                            <p className="text-gray-500">Check back soon for new content!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blog;