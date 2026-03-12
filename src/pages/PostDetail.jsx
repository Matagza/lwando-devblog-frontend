import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data.post);
        setLoading(false);
      } catch (err) {
        setError('Could not find the post you are looking for.');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/1200x600/4287f5/ffffff?text=Insights';
    return url;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        navigate('/');
      } catch (err) {
        alert('Failed to delete the post. Please try again.');
      }
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '8rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading article...</div>;
  if (error) return (
    <div className="container" style={{ marginTop: '8rem', textAlign: 'center' }}>
      <p className="error-msg" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>{error}</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );

  const authorId = post.author?._id || post.author;
  const currentUserId = user?._id || user?.id;
  const isAuthor = currentUserId && authorId && currentUserId.toString() === authorId.toString();

  return (
    <div className="container">
      <article className="post-detail">
        <header className="post-header">
          <span className="blog-category">{post.category}</span>
          <h1>{post.title}</h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.4', fontWeight: '500' }}>{post.subtitle}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: '800' }}>
                {post.author?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{post.author?.name || 'Anonymous'}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {isAuthor && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                <Link to={`/edit/${post._id}`} className="btn btn-outline">Edit</Link>
                <button onClick={handleDelete} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Delete</button>
              </div>
            )}
          </div>
        </header>

        <img src={getImageUrl(post.image)} alt={post.title} className="post-hero-img" />

        <div className="post-content">
          {post.content.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>

        <div style={{ marginTop: '6rem', padding: '4rem', background: 'var(--card-bg)', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Thanks for reading!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: '500' }}>Explore more engineering insights on Lwando DevBlog.</p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Back to All Articles</Link>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
