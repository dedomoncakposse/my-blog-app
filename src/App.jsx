import { useState, useEffect } from 'react';

function App() {
  const [page, setPage] = useState('home');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(function() {
    fetchPosts();
  }, []);

  function fetchPosts() {
    fetch('http://localhost:3000/api/posts')
      .then(function(response) { return response.json(); })
      .then(function(data) { setPosts(data); });
  }

  function logout() {
    setLoggedIn(false);
    setUser(null);
    setToken(null);
    setPage('home');
  }

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f0f0f0' }}>
      
      <nav style={{ background: 'darkblue', color: 'white', padding: '15px 30px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setPage('home')}>
          My Blog
        </h1>
        <div>
          {!loggedIn ? (
            <>
              <button onClick={() => setPage('login')}
                style={{ background: 'transparent', color: 'white', border: '1px solid white',
                        padding: '8px 15px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px' }}>
                Login
              </button>
              <button onClick={() => setPage('register')}
                style={{ background: 'white', color: 'darkblue', border: 'none',
                        padding: '8px 15px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px' }}>
                Register
              </button>
            </>
          ) : (
            <>
              <span style={{ marginRight: '15px' }}>Welcome, {user}!</span>
              <button onClick={() => setPage('create')}
                style={{ background: 'white', color: 'darkblue', border: 'none',
                        padding: '8px 15px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px' }}>
                New Post
              </button>
              <button onClick={logout}
                style={{ background: 'red', color: 'white', border: 'none',
                        padding: '8px 15px', marginLeft: '10px', cursor: 'pointer', borderRadius: '5px' }}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
        {page === 'home' && (
          <HomePage posts={posts} setSelectedPost={setSelectedPost} setPage={setPage} />
        )}
        {page === 'login' && (
          <LoginPage setLoggedIn={setLoggedIn} setUser={setUser} setToken={setToken} setPage={setPage} />
        )}
        {page === 'register' && (
          <RegisterPage setPage={setPage} />
        )}
        {page === 'create' && (
          <CreatePost user={user} token={token} fetchPosts={fetchPosts} setPage={setPage} />
        )}
        {page === 'post' && (
          <SinglePost post={selectedPost} loggedIn={loggedIn} fetchPosts={fetchPosts} setPage={setPage} />
        )}
      </div>
    </div>
  );
}

function HomePage({ posts, setSelectedPost, setPage }) {
  return (
    <div>
      <h2 style={{ color: 'darkblue' }}>Latest Posts</h2>
      {posts.length === 0 && <p>No posts yet. Login to create the first post!</p>}
      {posts.map(function(post) {
        return (
          <div key={post.id} style={{ background: 'white', padding: '20px', borderRadius: '10px',
                                      marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                      cursor: 'pointer' }}
               onClick={() => { setSelectedPost(post); setPage('post'); }}>
            <h3 style={{ color: 'darkblue', margin: '0 0 10px 0' }}>{post.title}</h3>
            <p style={{ color: '#666', margin: '0 0 10px 0' }}>
              {post.content.substring(0, 150)}...
            </p>
            <p style={{ color: '#999', margin: 0, fontSize: '14px' }}>
              By {post.author} — {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function LoginPage({ setLoggedIn, setUser, setToken, setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function login() {
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.token) {
        setLoggedIn(true);
        setUser(data.name);
        setToken(data.token);
        setPage('home');
      } else {
        setMessage(data.error);
      }
    });
  }

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: 'darkblue', textAlign: 'center' }}>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
      <input value={password} onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') login(); }}
        placeholder="Password" type="password"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
      <button onClick={login}
        style={{ width: '100%', padding: '10px', background: 'darkblue', color: 'white',
                border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
        Login
      </button>       
    </div>
  );
}

function RegisterPage({ setPage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function register() {
    fetch('my-blog-production-a0cc.up.railway.app/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      setMessage(data.message || data.error);
      if (data.message) {
        setTimeout(() => setPage('login'), 2000);
      }
    });
  }

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: 'darkblue', textAlign: 'center' }}>Register</h2>
      <input value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
      <input value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
      <input value={password} onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') register(); }}
        placeholder="Password" type="password"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red', textAlign: 'center' }}>{message}</p>}
      <button onClick={register}
        style={{ width: '100%', padding: '10px', background: 'darkblue', color: 'white',
                border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
        Register
      </button>
    </div>
  );
}

function CreatePost({ user, fetchPosts, setPage }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  function createPost() {
    if (title === '' || content === '') {
      setMessage('Please fill in all fields!');
      return;
    }

    fetch('my-blog-production-a0cc.up.railway.app/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, author: user })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      setMessage(data.message);
      fetchPosts();
      setTimeout(() => setPage('home'), 2000);
    });
  }

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
      <h2 style={{ color: 'darkblue' }}>Create New Post</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} 
        onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) createPost(); }}
        placeholder="Write your post content here..." rows="10"
        style={{ width: '100%', padding: '10px', marginBottom: '10px',
                borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px', resize: 'none' }} />
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      <button onClick={createPost}
        style={{ width: '100%', padding: '10px', background: 'darkblue', color: 'white',
                border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
        Publish Post
      </button>
    </div>
  );
}

function SinglePost({ post, loggedIn, fetchPosts, setPage }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [message, setMessage] = useState('');

  function updatePost() {
    fetch('my-blog-production-a0cc.up.railway.app/api/posts/' + post.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      setMessage(data.message);
      setEditing(false);
      fetchPosts();
    });
  }

  function deletePost() {
    if (window.confirm('Are you sure you want to delete this post?')) {
      fetch('my-blog-production-a0cc.up.railway.app/api/posts/' + post.id, {
        method: 'DELETE'
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        fetchPosts();
        setPage('home');
      });
    }
  }

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
      {!editing ? (
        <>
          <h2 style={{ color: 'darkblue' }}>{post.title}</h2>
          <p style={{ color: '#999', fontSize: '14px' }}>
            By {post.author} — {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
          </p>
          <p style={{ lineHeight: '1.8', marginTop: '20px' }}>{post.content}</p>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {loggedIn && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setEditing(true)}
                style={{ padding: '10px 20px', background: 'darkblue', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={deletePost}
                style={{ padding: '10px 20px', background: 'red', color: 'white',
                        border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          )}
          <button onClick={() => setPage('home')}
            style={{ marginTop: '15px', padding: '10px 20px', background: '#ccc',
                    border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Back to Home
          </button>
        </>
      ) : (
        <>
          <h2 style={{ color: 'darkblue' }}>Edit Post</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px',
                    borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px' }} />
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            rows="10"
            style={{ width: '100%', padding: '10px', marginBottom: '10px',
                    borderRadius: '5px', border: '2px solid #ccc', fontSize: '16px', resize: 'none' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={updatePost}
              style={{ padding: '10px 20px', background: 'darkblue', color: 'white',
                      border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Save Changes
            </button>
            <button onClick={() => setEditing(false)}
              style={{ padding: '10px 20px', background: '#ccc',
                      border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;