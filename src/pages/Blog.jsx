import { useEffect, useState } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function Blog() {
    const [selectedBlog, setSelectedBlog] = useState(null);
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
        <div className="w-full bg-gray-50 min-h-screen relative">
            <div className="w-full bg-gradient-to-r from-[#D68E9A] to-[#015A8A] py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Blog</h1>
                    <p className="text-gray-900 text-lg max-w-2xl mx-auto">
                        Discover tips, insights, and reviews about our favorite Amazon products
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((post) => (
                        <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            <div className="p-6">
                                <p className="text-gray-900 text-sm font-semibold mb-2">{post.date}</p>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                                <p className="text-gray-900 line-clamp-3 mb-4">{post.summary}</p>
                                <button
                                    onClick={() => setSelectedBlog(post)}
                                    className="text-gray-900 font-semibold hover:text-gray-800 transition-colors"
                                >
                                    Read More →
                                </button>
                            </div>
                        </article>
                    ))}
                    {blogs.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Blog Posts Yet</h2>
                            <p className="text-gray-600">Check back soon for new content!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Notepad Modal */}
            {selectedBlog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedBlog(null)}>
                    <div
                        className="relative w-full max-w-2xl bg-[#fff9c4] shadow-2xl rounded-sm overflow-hidden transform transition-all scale-100 rotate-1"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            minHeight: '600px',
                            backgroundImage: 'linear-gradient(#999 1px, transparent 1px)',
                            backgroundSize: '100% 2rem',
                            lineHeight: '2rem'
                        }}
                    >
                        {/* Red Margin Line */}
                        <div className="absolute top-0 bottom-0 left-12 w-px bg-red-400 opacity-80 z-10"></div>

                        {/* Paper Holes */}
                        <div className="absolute top-0 bottom-0 left-4 flex flex-col gap-8 py-8 z-20">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-4 h-4 rounded-full bg-gray-800 shadow-inner"></div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedBlog(null)}
                            className="absolute top-4 right-4 z-50 p-2 text-gray-600 hover:text-red-600 hover:rotate-90 transition-all"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Content */}
                        <div className="pl-20 pr-8 py-10 h-full overflow-y-auto max-h-[85vh] font-mono text-gray-800">
                            {/* Date Stamp */}
                            <div className="flex justify-end mb-4">
                                <span className="inline-block border-2 border-red-400 text-red-500 font-bold px-2 py-1 transform -rotate-12 opacity-80">
                                    {selectedBlog.date || new Date().toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold mb-8 leading-[4rem] text-[#1d3d53]" style={{ marginTop: '-4px' }}>
                                {selectedBlog.title}
                            </h2>

                            <div className="whitespace-pre-wrap text-lg leading-[2rem]">
                                {selectedBlog.summary}
                                <br /><br />
                                {selectedBlog.content || "Full content loading..."}
                                {/* Fallback if content field isn't populated yet */}
                            </div>

                            <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-400 text-center font-handwriting italic text-gray-500">
                                ~ Handcrafted for you ~
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blog;