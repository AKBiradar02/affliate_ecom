import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

function AddBlogForm({ onBlogAdded }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            // Add blog directly to Firestore
            await addDoc(collection(db, 'blogs'), {
                title: title.trim(),
                summary: summary.trim(),
                content: content.trim(),
                createdAt: serverTimestamp(),
            });

            setTitle('');
            setSummary('');
            setContent('');
            setMessage('✅ Blog uploaded successfully!');
            onBlogAdded?.();
        } catch (error) {
            console.error('Add Blog Error:', error);
            setMessage(`❌ ${error.message || 'Failed to upload blog.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Blog Post</h2>

            {message && (
                <div className={`p-3 rounded-md mb-4 ${message.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Blog Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Summary *</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Full Content *</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                            rows={10}
                            placeholder="Write your full blog post here..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md text-gray-300 font-medium ${isLoading ? 'bg-[#1d3d53] opacity-70' : 'bg-[#1d3d53] hover:bg-[#162f40]'
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Blog Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddBlogForm;