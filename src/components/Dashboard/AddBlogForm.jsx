import { useState } from 'react';
import { getAuth } from 'firebase/auth';

function AddBlogForm({ onBlogAdded }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [message, setMessage] = useState('');

    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }
            const token = await user.getIdToken();

            const res = await fetch('https://addblog-fpqz4j4kvq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    summary,
                    createdAt: new Date().toISOString(),
                }),
            });

            const isJson = res.headers.get('content-type')?.includes('application/json');
            const text = await (isJson ? res.json() : res.text());

            if (res.ok) {
                setTitle('');
                setSummary('');
                setMessage('✅ Blog uploaded successfully!');
                onBlogAdded?.();
            } else {
                setMessage(`❌ ${isJson ? text.message : text}`);
            }
        } catch (error) {
            console.error('Add Blog Error:', error);
            setMessage(`❌ ${error.message || 'Failed to upload blog. Check authentication or function setup.'}`);
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