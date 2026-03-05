import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Technology',
    content: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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
    setError('');

    if (!image) {
      return setError('Please upload a cover image for your post');
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('category', formData.category);
    data.append('content', formData.content);
    data.append('image', image);

    try {
      await axios.post('/api/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '840px', margin: '5rem auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Create New Post</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>Share your knowledge and insights with the developer community.</p>
      
      {error && <div className="error-msg">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Post Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Modern Web Architecture with Next.js"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtitle">Subtitle / Summary</label>
          <input
            type="text"
            id="subtitle"
            className="form-control"
            value={formData.subtitle}
            onChange={handleChange}
            required
            placeholder="A brief overview of what your post is about"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" className="form-control" value={formData.category} onChange={handleChange}>
              <option value="Technology">Technology</option>
              <option value="Startup">Startup</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Opinion">Opinion</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Cover Image</label>
            <input
              type="file"
              id="image"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
            />
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
            id="content"
            className="form-control"
            rows="15"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Write your article content here..."
            style={{ resize: 'vertical', lineHeight: '1.6' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '0.8rem 2.5rem' }}>
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.8rem 2.5rem' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
