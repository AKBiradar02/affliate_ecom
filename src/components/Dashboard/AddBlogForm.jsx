import { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function AddBlogForm({ onBlogAdded }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'blogs'), {
                title,
                summary,
                date: new Date().toLocaleDateString(),
                createdAt: serverTimestamp()
            });
            setTitle('');
            setSummary('');
            setMessage('✅ Blog uploaded successfully!');
            onBlogAdded?.();
        } catch (error) {
            console.error(error);
            setMessage('❌ Failed to upload blog.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Add Blog Post</h2>
            {message && <p className="text-sm mb-3 text-green-600">{message}</p>}
            <input
                type="text"
                placeholder="Blog Title"
                className="w-full mb-3 p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Blog Summary"
                className="w-full mb-3 p-2 border rounded h-32"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Upload Blog
            </button>
        </form>
    );
}

export default AddBlogForm;
