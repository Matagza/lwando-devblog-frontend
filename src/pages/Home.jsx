import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts');
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/800x400/4287f5/ffffff?text=Insights';
    return url;
  };

  if (loading) return <div className="container" style={{ marginTop: '8rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading latest insights...</div>;
  if (error) return <div className="container" style={{ marginTop: '8rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;

  return (
    <div className="container">
      <header style={{ padding: '6rem 0 4rem', textAlign: 'left', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.1', marginBottom: '1.5rem' }}>
          Explore the future of <span style={{ color: 'var(--primary)' }}>Engineering.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '500', lineHeight: '1.6', maxWidth: '600px' }}>
          Curated deep dives into modern software architecture, distributed systems, and engineering leadership.
        </p>
      </header>

      <div className="blog-grid">
        {posts.map((post) => (
          <Link key={post._id} to={`/post/${post._id}`} className="blog-card">
            <img src={getImageUrl(post.image)} alt={post.title} className="blog-card-img" />
            <div className="blog-card-body">
              <span className="blog-category">{post.category}</span>
              <h2 className="blog-title">{post.title}</h2>
              <p className="blog-subtitle">{post.subtitle}</p>
              <div className="post-meta">
                <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: '800' }}>
                  {post.author?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text)' }}>{post.author?.name || 'Anonymous'}</p>
                  <p style={{ fontSize: '0.7rem' }}>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '6rem 0', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No articles published yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Be the first to share your engineering journey.</p>
          <Link to="/create" className="btn btn-primary">Write First Article</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
