import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LogIn, Video, CheckCircle, UploadCloud, PlayCircle, BarChart3, Users } from 'lucide-react';
import { useState } from 'react';
import logoImg from './assets/images/logo.png';

// --- Pages ---

const HomePage = () => {
  return (
    <div>
      <section className="hero-section">
        <h1 className="hero-title">
          The Ultimate TikTok <br />
          <span className="gradient-text">CRM Manager</span>
        </h1>
        <p className="hero-subtitle">
          Manage your TikTok presence, schedule content, and analyze performance from a single, powerful dashboard designed for modern creators and agencies.
        </p>
        <div className="hero-actions">
          <Link to="/loginkit" className="btn btn-primary">
            Connect TikTok <LogIn size={18} />
          </Link>
          <Link to="/content-post" className="btn btn-outline">
            Try Posting <PlayCircle size={18} />
          </Link>
        </div>
      </section>

      <div className="features-grid">
        <div className="card">
          <div className="feature-icon">
            <Users size={24} />
          </div>
          <h3>Audience CRM</h3>
          <p className="text-muted mt-2">
            Track engagement, manage comments, and build deeper connections with your TikTok followers seamlessly.
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">
            <Video size={24} />
          </div>
          <h3>Direct Publishing</h3>
          <p className="text-muted mt-2">
            Upload, schedule, and publish videos directly to TikTok without touching your phone. Fully compliant with TikTok APIs.
          </p>
        </div>
        <div className="card">
          <div className="feature-icon">
            <BarChart3 size={24} />
          </div>
          <h3>Advanced Analytics</h3>
          <p className="text-muted mt-2">
            Get actionable insights on video performance, audience demographics, and growth trends.
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginKitPage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    
    const CLIENT_KEY = 'sbawai0vsrgtqtuauz';
    const REDIRECT_URI = 'https://crmkg.vercel.app/callback';
    const csrfState = Math.random().toString(36).substring(2);
    
    let url = 'https://www.tiktok.com/v2/auth/authorize/';
    url += `?client_key=${CLIENT_KEY}`;
    url += '&scope=user.info.basic,video.upload,video.publish';
    url += '&response_type=code';
    url += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    url += `&state=${csrfState}`;
    
    window.location.href = url;
  };

  return (
    <div className="dashboard-layout">
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,0,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <LogIn size={40} />
          </div>
        </div>
        <h2 className="mb-4">Connect Your TikTok Account</h2>
        <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto 2rem auto' }}>
          Authorize CRMKG to manage your TikTok profile, read analytics, and publish videos directly to your feed.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', color: 'var(--text-muted)' }}>
            <CheckCircle size={16} color="var(--secondary)" /> <span>Read profile info</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', color: 'var(--text-muted)' }}>
            <CheckCircle size={16} color="var(--secondary)" /> <span>Publish videos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', color: 'var(--text-muted)' }}>
            <CheckCircle size={16} color="var(--secondary)" /> <span>Access analytics</span>
          </div>
        </div>

        <button
          className="btn btn-primary mt-8"
          style={{ width: '100%', maxWidth: 300 }}
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Connecting...' : 'Log in with TikTok'}
        </button>
      </div>
    </div>
  );
};

const ContentPostPage = () => {
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      alert("Video submitted successfully to TikTok!");
      setIsUploading(false);
      setTitle('');
    }, 2000);
  };

  return (
    <div className="dashboard-layout">
      <div>
        <h2 className="mb-2">Create New Post</h2>
        <p className="text-muted mb-8">Upload your video and configure posting options.</p>

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label className="form-label">Upload Video</label>
            <div className="upload-area">
              <UploadCloud size={48} className="upload-icon" />
              <h4>Drag & drop your video here</h4>
              <p className="text-muted mt-2">MP4 or WebM, up to 10 minutes</p>
              <button type="button" className="btn btn-outline mt-4">Browse Files</button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Caption</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Write a catchy caption... #fyp #viral"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Privacy Level</label>
              <select className="form-control">
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Allow Comments</label>
              <select className="form-control">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="mt-8" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-outline">Save Draft</button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? 'Publishing...' : 'Publish to TikTok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CallbackPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  return (
    <div className="dashboard-layout">
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: error ? 'rgba(255, 0, 80, 0.1)' : 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: error ? 'var(--primary)' : 'var(--secondary)' }}>
            <CheckCircle size={40} />
          </div>
        </div>
        <h2 className="mb-4">{error ? 'Authentication Failed' : 'Authentication Successful'}</h2>
        
        {code ? (
          <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto' }}>
            Successfully received authorization code from TikTok. You are now securely connected to CRMKG!
          </p>
        ) : error ? (
          <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto' }}>
            TikTok returned an error: {searchParams.get('error_description') || error}
          </p>
        ) : (
          <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto' }}>
            Processing authentication...
          </p>
        )}

        <Link to="/content-post" className="btn btn-primary mt-4">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

const PrivacyPage = () => {
  return (
    <div className="legal-content">
      <h1 className="gradient-text mb-8">Privacy Policy</h1>
      <p>Last updated: June 22, 2026</p>

      <div className="card mt-8">
        <h2>1. Introduction</h2>
        <p>Welcome to CRMKG ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.</p>

        <h2>2. Data We Collect</h2>
        <p>When you use our TikTok integration, we may collect the following data as authorized by you through the TikTok Login Kit:</p>
        <ul>
          <li className="text-muted mb-2">Profile information (username, display name, avatar)</li>
          <li className="text-muted mb-2">Video content and metadata that you choose to publish through our platform</li>
          <li className="text-muted mb-2">Analytics data related to your content performance</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <p>We use your data solely to provide the CRM services you requested, specifically:</p>
        <ul>
          <li className="text-muted mb-2">To authenticate your identity via TikTok</li>
          <li className="text-muted mb-2">To publish content to your TikTok account on your behalf</li>
          <li className="text-muted mb-2">To display analytics and CRM insights within your dashboard</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. Data is only shared with TikTok APIs as strictly necessary to perform the requested actions.</p>
      </div>
    </div>
  );
};

const TermsPage = () => {
  return (
    <div className="legal-content">
      <h1 className="gradient-text mb-8">Terms of Service</h1>
      <p>Last updated: June 22, 2026</p>

      <div className="card mt-8">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using CRMKG, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h2>2. Description of Service</h2>
        <p>CRMKG provides a CRM dashboard and content management system for TikTok creators. We utilize the official TikTok APIs to facilitate login and content publishing.</p>

        <h2>3. User Responsibilities</h2>
        <p>You agree to use our service only for lawful purposes and in accordance with TikTok's official Terms of Service and Community Guidelines. You are responsible for any content you publish through our platform.</p>

        <h2>4. API Usage</h2>
        <p>Our service relies on the TikTok Developer API. We are not affiliated with, endorsed by, or sponsored by TikTok. Your use of the integration is subject to our compliance with TikTok's developer policies.</p>

        <h2>5. Termination</h2>
        <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
      </div>
    </div>
  );
};

// --- Navigation ---

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logoImg} alt="CRMKG Logo" style={{ height: '90px', width: 'auto' }} />
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          Home
        </Link>
        <Link to="/loginkit" className={`nav-link ${isActive('/loginkit')}`}>
          LoginKit
        </Link>
        <Link to="/content-post" className={`nav-link ${isActive('/content-post')}`}>
          Content Post
        </Link>
        <Link to="/privacy" className={`nav-link ${isActive('/privacy')}`}>
          Privacy
        </Link>
        <Link to="/terms" className={`nav-link ${isActive('/terms')}`}>
          Terms
        </Link>
      </div>
    </nav>
  );
};

// --- Main App ---

function App() {
  return (
    <Router>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loginkit" element={<LoginKitPage />} />
          <Route path="/content-post" element={<ContentPostPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2026 CRMKG. All rights reserved. Not affiliated with TikTok.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <span>&middot;</span>
          <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
        </div>
      </footer>
    </Router>
  );
}

export default App;
