import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Technology',
    content: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        const post = res.data.post;
        
        const authorId = post.author?._id || post.author;
        const currentUserId = user?._id || user?.id;
        
        if (!currentUserId || authorId.toString() !== currentUserId.toString()) {
          alert('You are not authorized to edit this post');
          return navigate('/');
        }

        setFormData({
          title: post.title,
          subtitle: post.subtitle,
          category: post.category,
          content: post.content
        });
        setPreview(post.image);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post details');
        setLoading(false);
      }
    };

    if (user) fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('category', formData.category);
    data.append('content', formData.content);
    if (image) data.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/posts/${id}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setSaving(false);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '6rem', textAlign: 'center' }}>Loading post editor...</div>;

  return (
    <div className="container" style={{ maxWidth: '840px', margin: '5rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Edit Post</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Update your article and keep your readers informed.</p>
      
      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Post Title</label>
          <input 
            type="text" id="title" required 
            placeholder="e.g. Modern Web Architecture with Next.js"
            value={formData.title} onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle / Summary</label>
          <input 
            type="text" id="subtitle" required 
            placeholder="A brief overview of what your post is about"
            value={formData.subtitle} onChange={handleChange}
            className="form-control"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={formData.category} onChange={handleChange} className="form-control">
              <option value="Technology">Technology</option>
              <option value="Startup">Startup</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Opinion">Opinion</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Update Cover Image (Optional)</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="form-control" />
          </div>
        </div>

        {preview && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 700 }}>Image Preview:</p>
            <img src={preview} alt="Preview" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border)' }} />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="content">Article Content</label>
          <textarea 
            id="content" required rows="15"
            placeholder="Write your article content here..."
            value={formData.content} onChange={handleChange}
            className="form-control"
            style={{ resize: 'vertical', lineHeight: '1.6' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '0.8rem 2.5rem' }}>
            {saving ? 'Saving Changes...' : 'Update Post'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.8rem 2.5rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
