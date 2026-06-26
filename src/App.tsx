import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Video, CheckCircle, UploadCloud, PlayCircle, BarChart3, Users } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
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
  const [savedUser, setSavedUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('tiktok_user');
    if (user) {
      try {
        setSavedUser(JSON.parse(user));
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    }
  }, []);

  function makeCodeVerifier() {
    const randomBytes = new Uint8Array(64);
    crypto.getRandomValues(randomBytes);
    return base64UrlEncode(randomBytes);
  }

  async function makeCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(new Uint8Array(digest));
  }

  function base64UrlEncode(bytes: Uint8Array) {
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
  }

  const handleLogin = async () => {
    setIsLoggingIn(true);

    const CLIENT_KEY = 'awkisbm5h330o786';
    const REDIRECT_URI = `${window.location.origin}/callback`;
    const csrfState = Math.random().toString(36).substring(2);
    
    const codeVerifier = makeCodeVerifier();
    const codeChallenge = await makeCodeChallenge(codeVerifier);

    sessionStorage.setItem('tiktok_oauth_state', csrfState);
    sessionStorage.setItem('tiktok_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_key: CLIENT_KEY,
      response_type: 'code',
      scope: 'user.info.basic,video.publish',
      redirect_uri: REDIRECT_URI,
      state: csrfState,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      disable_auto_auth: '1',
    });

    window.location.href = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  };

  return (
    <div className="dashboard-layout">
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        {savedUser ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <img src={savedUser.avatar_url} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', border: '3px solid var(--secondary)' }} />
            </div>
            <h2 className="mb-4">Welcome, {savedUser.display_name}!</h2>
            <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto 2rem auto' }}>
              Your TikTok account is successfully connected to CRMKG. You can now manage your videos and analytics.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/content-post" className="btn btn-primary">
                Go to Dashboard
              </Link>
              <button
                className="btn btn-outline"
                onClick={() => {
                  localStorage.removeItem('tiktok_user');
                  setSavedUser(null);
                }}
              >
                Disconnect Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,0,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <LogIn size={40} />
              </div>
            </div>
            <h2 className="mb-4">Connect Your TikTok Account</h2>
            <p className="text-muted mb-6" style={{ maxWidth: 400, margin: '0 auto' }}>
              Authorize CRMKG to manage your TikTok profile and publish content directly to your feed.
            </p>

            <div style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.5rem', maxWidth: 350, margin: '0 auto 2rem auto', textAlign: 'left' }}>
              <strong style={{ display: 'block', marginBottom: '1rem' }}>Requested Scopes:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <CheckCircle size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.9rem' }}>user.info.basic</strong>
                    <span style={{ fontSize: '0.85rem' }}>Read your profile info (avatar, display name)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <CheckCircle size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.9rem' }}>video.publish</strong>
                    <span style={{ fontSize: '0.85rem' }}>Publish videos and photos to your account</span>
                  </div>
                </div>
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
          </>
        )}
      </div>
    </div>
  );
};

const IS_DIRECT_POST_AUDITED = import.meta.env.VITE_TIKTOK_DIRECT_POST_AUDITED === 'true';
const AUDIT_PRIVACY_MESSAGE = 'Cannot post with Public or Friend privacy yet. TikTok requires Direct Post audit approval for public/friend visibility. Choose Only Me to publish now.';

const privacyLabels: Record<string, string> = {
  PUBLIC_TO_EVERYONE: 'Public',
  MUTUAL_FOLLOW_FRIENDS: 'Friend',
  FOLLOWER_OF_CREATOR: 'Followers',
  SELF_ONLY: 'Only Me',
};

const MAX_UPLOAD_CHUNK_SIZE = 64 * 1024 * 1024;
const PUBLISH_POLL_INTERVAL_MS = 2000;
const MAX_PUBLISH_POLLS = 30;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dbfdc4chj';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'crmkg_photos';

function getUploadParts(fileSize: number) {
  if (fileSize <= MAX_UPLOAD_CHUNK_SIZE) {
    return { chunkSize: fileSize, totalChunkCount: 1 };
  }
  return {
    chunkSize: MAX_UPLOAD_CHUNK_SIZE,
    totalChunkCount: Math.ceil(fileSize / MAX_UPLOAD_CHUNK_SIZE),
  };
}

const ContentPostPage = () => {
  const [savedUser, setSavedUser] = useState<any>(null);
  const [postType, setPostType] = useState<'video' | 'photo'>('video');
  const [title, setTitle] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('');
  const [allowComment, setAllowComment] = useState(false);
  const [allowDuet, setAllowDuet] = useState(false);
  const [allowStitch, setAllowStitch] = useState(false);
  const [autoAddMusic, setAutoAddMusic] = useState(false);

  const [commercialToggle, setCommercialToggle] = useState(false);
  const [yourBrand, setYourBrand] = useState(false);
  const [brandedContent, setBrandedContent] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const [consentChecked, setConsentChecked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [publishStatus, setPublishStatus] = useState('Ready');
  const [publishId, setPublishId] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    return mediaFile ? URL.createObjectURL(mediaFile) : null;
  }, [mediaFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMediaFile(file);
  };

  useEffect(() => {
    const user = localStorage.getItem('tiktok_user');
    if (user) {
      try {
        setSavedUser(JSON.parse(user));
      } catch (e) { }
    }
  }, []);

  const availablePrivacyOptions = savedUser?.privacy_level_options || ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'SELF_ONLY'];

  const needsAuditPrivacy = !IS_DIRECT_POST_AUDITED && privacyLevel && privacyLevel !== 'SELF_ONLY';

  const handleCommercialToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommercialToggle(e.target.checked);
    if (!e.target.checked) {
      setYourBrand(false);
      setBrandedContent(false);
    }
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacyLevel(e.target.value);
  };

  const handleBrandedContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setBrandedContent(checked);
    if (checked && privacyLevel === 'SELF_ONLY') {
      setPrivacyLevel('');
    }
  };

  let declarationText = "By posting, you agree to TikTok's Music Usage Confirmation.";
  if (commercialToggle && (brandedContent || yourBrand)) {
    if (brandedContent) {
      declarationText = "By posting, you agree to TikTok's Branded Content Policy and Music Usage Confirmation.";
    } else {
      declarationText = "By posting, you agree to TikTok's Music Usage Confirmation.";
    }
  }

  const isPublishDisabled =
    isUploading ||
    !privacyLevel ||
    needsAuditPrivacy ||
    (commercialToggle && !yourBrand && !brandedContent) ||
    !consentChecked;

  const publishDisabledMessage = needsAuditPrivacy
    ? AUDIT_PRIVACY_MESSAGE
    : (commercialToggle && !yourBrand && !brandedContent)
      ? 'You need to indicate if your content promotes yourself, a third party, or both.'
      : !privacyLevel
        ? 'Choose a privacy option returned by TikTok creator info.'
        : '';

  const pollPublishStatus = async (nextPublishId: string) => {
    setPublishStatus('Processing on TikTok...');

    for (let attempt = 0; attempt < MAX_PUBLISH_POLLS; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, PUBLISH_POLL_INTERVAL_MS));

      const response = await fetch('/api/tiktok-publish-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish_id: nextPublishId }),
      });
      const payload = await response.json();

      if (!response.ok || (payload?.error?.code && payload.error.code !== 'ok')) {
        const code = payload?.error?.code;
        const msg = payload?.error?.message || code || 'TikTok status check failed.';
        throw new Error(msg);
      }

      const status = payload?.data?.status;
      if (status === 'PUBLISH_COMPLETE') {
        setPublishStatus('Successfully posted to TikTok. It may take a few minutes to appear on your profile.');
        setIsUploading(false);
        setMediaFile(null);
        setTitle('');
        return;
      }

      if (status === 'FAILED') {
        throw new Error(`TikTok could not publish this content: ${payload?.data?.fail_reason || 'unknown reason'}.`);
      }

      setPublishStatus(
        status === 'PROCESSING_DOWNLOAD'
          ? 'TikTok is downloading media from the verified URL...'
          : 'TikTok is processing the upload...'
      );
    }

    setPublishStatus('TikTok is still processing this post. It may take a few minutes to appear on your profile.');
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishDisabled || !mediaFile) return;

    if (needsAuditPrivacy) {
      alert(AUDIT_PRIVACY_MESSAGE);
      return;
    }

    setIsUploading(true);
    setPublishStatus('Initializing TikTok upload...');
    setPublishId('');

    const postInfo = {
      title: title.trim(),
      privacy_level: privacyLevel,
      disable_comment: !allowComment,
      disable_duet: postType === 'video' ? !allowDuet : undefined,
      disable_stitch: postType === 'video' ? !allowStitch : undefined,
      auto_add_music: postType === 'photo' ? autoAddMusic : undefined,
      brand_content_toggle: brandedContent,
      brand_organic_toggle: yourBrand,
      is_aigc: aiGenerated,
    };

    try {
      let sourceInfo;
      let verifiedUrl = '';

      if (postType === 'photo') {
        setPublishStatus('Uploading photo to verified media storage...');
        const formData = new FormData();
        formData.append('file', mediaFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const cloudinaryPayload = await cloudinaryResponse.json();

        if (!cloudinaryResponse.ok || !cloudinaryPayload?.secure_url) {
          throw new Error(cloudinaryPayload?.error?.message || 'Cloudinary could not upload this photo.');
        }

        verifiedUrl = cloudinaryPayload.secure_url.replace('/image/upload/', '/image/upload/f_jpg,q_auto/');
        
        sourceInfo = {
          source: 'PULL_FROM_URL',
          media_url: verifiedUrl,
        };
        setPublishStatus('Initializing TikTok photo post...');
      } else {
        const { chunkSize, totalChunkCount } = getUploadParts(mediaFile.size);
        sourceInfo = {
          source: 'FILE_UPLOAD',
          video_size: mediaFile.size,
          chunk_size: chunkSize,
          total_chunk_count: totalChunkCount,
        };
      }

      const response = await fetch('/api/tiktok-direct-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: postType,
          post_info: postInfo,
          source_info: sourceInfo,
        }),
      });
      const payload = await response.json();

      if (!response.ok || (payload?.error?.code && payload.error.code !== 'ok')) {
        throw new Error(payload?.error?.message || payload?.error?.code || 'TikTok publishing failed.');
      }

      if (sourceInfo.source === 'FILE_UPLOAD') {
        const uploadUrl = payload?.data?.upload_url;
        if (!uploadUrl) {
          throw new Error('TikTok did not return a video upload URL.');
        }

        const { chunkSize, totalChunkCount } = getUploadParts(mediaFile.size);
        setPublishStatus('Uploading video to TikTok...');

        for (let index = 0; index < totalChunkCount; index += 1) {
          const start = index * chunkSize;
          const end = index === totalChunkCount - 1 ? mediaFile.size : Math.min(start + chunkSize, mediaFile.size);
          const chunk = mediaFile.slice(start, end);
          
          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': mediaFile.type || 'video/mp4',
              'Content-Range': `bytes ${start}-${end - 1}/${mediaFile.size}`,
            },
            body: chunk,
          });

          if (!uploadResponse.ok && uploadResponse.status !== 206) {
            throw new Error(`TikTok video upload failed (${uploadResponse.status}).`);
          }
        }
      }

      const nextPublishId = payload?.data?.publish_id || payload?.publish_id;
      if (!nextPublishId) {
        throw new Error('TikTok did not return a publish ID.');
      }

      setPublishId(nextPublishId);
      await pollPublishStatus(nextPublishId);

    } catch (error: any) {
      setPublishId('');
      setPublishStatus(error.message || 'TikTok publishing failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <div>
        <h2 className="mb-2">Create New Post</h2>
        <p className="text-muted mb-8">Upload your content and configure posting options directly to TikTok.</p>

        {savedUser ? (
          <div className="card mb-6" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <img src={savedUser.avatar_url || 'https://via.placeholder.com/50'} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--secondary)' }} />
            <div>
              <div style={{ fontWeight: 'bold' }}>{savedUser.display_name || 'TikTok User'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@{savedUser.username || savedUser.display_name?.toLowerCase().replace(/\s/g, '') || 'username'}</div>
            </div>
          </div>
        ) : (
          <div className="card mb-6 p-4" style={{ backgroundColor: 'rgba(255,152,0,0.1)', color: '#ff9800', border: '1px solid rgba(255,152,0,0.3)' }}>
            <strong>Warning:</strong> You are not logged in. Please connect your TikTok account first.
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group mb-6" style={{ display: 'flex', gap: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
              <input type="radio" checked={postType === 'video'} onChange={() => setPostType('video')} style={{ accentColor: 'var(--primary)' }} />
              <span>Video Post</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
              <input type="radio" checked={postType === 'photo'} onChange={() => { setPostType('photo'); setAllowDuet(false); setAllowStitch(false); }} style={{ accentColor: 'var(--primary)' }} />
              <span>Photo Post</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Upload {postType === 'video' ? 'Video' : 'Photo'}</label>
            <div className="upload-area" style={{ position: 'relative', border: '2px dashed var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
              {!previewUrl ? (
                <>
                  <UploadCloud size={48} className="upload-icon" style={{ margin: '0 auto', color: 'var(--primary)', marginBottom: '1rem' }} />
                  <h4>Drag & drop your {postType} here</h4>
                  <p className="text-muted mt-2">{postType === 'video' ? 'MP4 or WebM, up to 10 minutes' : 'JPG or PNG image'}</p>
                  <label className="btn btn-outline mt-4" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    Select File
                    <input
                      type="file"
                      accept={postType === 'video' ? 'video/mp4,video/webm' : 'image/jpeg,image/png'}
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  {postType === 'video' ? (
                    <video src={previewUrl} controls style={{ maxHeight: 200, maxWidth: '100%', borderRadius: '8px' }} />
                  ) : (
                    <img src={previewUrl} alt="Preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: '8px' }} />
                  )}
                  {mediaFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Selected: {mediaFile.name} ({(mediaFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  <div className="mt-4">
                    <button type="button" className="btn btn-outline" onClick={() => setMediaFile(null)}>Remove File</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Title / Caption</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Write a catchy title... #fyp #viral"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label">Privacy Level *</label>
              <select className="form-control" value={privacyLevel} onChange={handlePrivacyChange} required>
                <option value="">Select privacy</option>
                {availablePrivacyOptions.map((option: string) => {
                  const brandedContentBlocksPrivate = commercialToggle && brandedContent && option === 'SELF_ONLY';
                  return (
                    <option
                      disabled={brandedContentBlocksPrivate}
                      key={option}
                      title={brandedContentBlocksPrivate ? 'Branded content visibility cannot be set to private.' : ''}
                      value={option}
                    >
                      {privacyLabels[option] || option}
                      {brandedContentBlocksPrivate ? ' — unavailable for branded content' : ''}
                    </option>
                  );
                })}
              </select>
              {commercialToggle && brandedContent && (
                <p className="mt-2" style={{ color: '#ff4d4f', fontSize: '0.85rem' }} title="Branded content visibility cannot be set to private.">
                  Only Me is disabled: Branded content visibility cannot be set to private.
                </p>
              )}
            </div>

            <div>
              <label className="form-label">Interaction Abilities</label>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={allowComment} onChange={(e) => setAllowComment(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Allow Comment
                </label>
                {postType === 'video' && (
                  <>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={allowDuet} onChange={(e) => setAllowDuet(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                      Allow Duet
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={allowStitch} onChange={(e) => setAllowStitch(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                      Allow Stitch
                    </label>
                  </>
                )}
                {postType === 'photo' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={autoAddMusic} onChange={(e) => setAutoAddMusic(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                    Auto-add music
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ background: 'var(--surface-light)', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
              <input type="checkbox" checked={commercialToggle} onChange={handleCommercialToggle} style={{ accentColor: 'var(--primary)', transform: 'scale(1.2)' }} />
              Disclose Commercial Content
            </label>
            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>Indicate whether this content promotes yourself, a brand, product or service.</p>

            {commercialToggle && (
              <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1.5rem', borderLeft: '2px solid var(--primary)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} title="Your photo/video will be labeled as 'Promotional content'">
                  <input type="checkbox" checked={yourBrand} onChange={(e) => setYourBrand(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Your Brand (Promoting yourself or your business)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} title={privacyLevel === 'SELF_ONLY' ? "Branded content visibility cannot be set to private." : ''}>
                  <input type="checkbox" checked={brandedContent} disabled={privacyLevel === 'SELF_ONLY'} onChange={handleBrandedContentChange} style={{ accentColor: 'var(--primary)' }} />
                  Branded Content (Promoting another brand or third party)
                </label>
                {(!yourBrand && !brandedContent) && (
                  <div style={{ color: '#ff4d4f', fontSize: '0.85rem', marginTop: '0.5rem', background: 'rgba(255,77,79,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                    Hover notification: "You need to indicate if your content promotes yourself, a third party, or both."
                  </div>
                )}
                {(yourBrand || brandedContent) && (
                  <div style={{ marginTop: '0.5rem', color: 'var(--secondary)', fontSize: '0.9rem', background: 'rgba(0, 242, 254, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                    Label to be displayed on TikTok: <strong>{(yourBrand && brandedContent) ? 'Paid partnership' : (brandedContent ? 'Paid partnership' : 'Promotional content')}</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {postType === 'video' && (
            <div className="form-group" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <input type="checkbox" checked={aiGenerated} onChange={(e) => setAiGenerated(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                This video is AI-generated
              </label>
              {aiGenerated && (
                <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                  Your video will be labeled as 'Creator labeled as AI-generated'
                </p>
              )}
            </div>
          )}

          <div className="form-group mt-6" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
              <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} style={{ marginTop: '4px', accentColor: 'var(--primary)', transform: 'scale(1.2)' }} required />
              <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text)' }}>
                {declarationText}
              </span>
            </label>
          </div>

          <div className="mt-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <span title={publishDisabledMessage}>
              <button type="submit" className="btn btn-primary" disabled={isPublishDisabled} style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                {isUploading ? 'Publishing...' : 'Publish to TikTok'}
              </button>
            </span>
            {needsAuditPrivacy && (
              <p style={{ color: '#ff4d4f', fontSize: '0.85rem', maxWidth: '300px', textAlign: 'right' }}>
                {AUDIT_PRIVACY_MESSAGE}
              </p>
            )}
            
            {(publishStatus !== 'Ready' || publishId) && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-light)', borderRadius: '8px', border: '1px solid var(--border)', width: '100%', maxWidth: '500px', textAlign: 'left' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text)' }}>Publish Status</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{publishStatus}</p>
                {publishId && (
                  <p style={{ color: 'var(--secondary)', fontSize: '0.85rem', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                    Publish ID: {publishId}
                  </p>
                )}
              </div>
            )}
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
  const errorParam = searchParams.get('error');

  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(errorParam ? 'error' : (code ? 'processing' : 'error'));
  const [errorMessage, setErrorMessage] = useState(searchParams.get('error_description') || errorParam || 'Invalid Request');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // If we only need to display the code to copy it, we can stop the backend fetch, 
    // or we can still do it. For now, let's keep the backend exchange but also show the code.
    if (code && status === 'processing') {
      const redirectUri = `${window.location.origin}/callback`;
      const codeVerifier = sessionStorage.getItem('tiktok_code_verifier') || '';
      fetch('/api/tiktok-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: redirectUri, code_verifier: codeVerifier })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setStatus('error');
            setErrorMessage(data.error_description || data.error);
          } else {
            setStatus('success');
            if (data.user) {
              setUserInfo(data.user);
              localStorage.setItem('tiktok_user', JSON.stringify(data.user));
            }
          }
        })
        .catch(err => {
          setStatus('error');
          setErrorMessage(err.message);
        });
    }
  }, [code, status]);

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      alert('Authorization Code copied to clipboard!');
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: status === 'error' ? 'rgba(255, 0, 80, 0.1)' : 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: status === 'error' ? 'var(--primary)' : 'var(--secondary)' }}>
            <CheckCircle size={40} />
          </div>
        </div>
        <h2 className="mb-4">{status === 'error' ? 'Authentication Failed' : status === 'success' ? 'Authentication Successful' : 'Processing...'}</h2>

        {code && (
          <div className="mt-4 mb-8 text-left" style={{ maxWidth: 400, margin: '0 auto 2rem auto', background: 'var(--surface-light)', padding: '1.5rem', borderRadius: '8px' }}>
            <label className="form-label" style={{ color: 'var(--secondary)' }}>Authorization Code</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                className="form-control"
                value={code}
                readOnly
                style={{ flex: 1, fontFamily: 'monospace' }}
              />
              <button onClick={copyToClipboard} className="btn btn-primary" type="button">
                Copy
              </button>
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '0.875rem' }}>
              You can copy this code for manual testing or verification.
            </p>
          </div>
        )}

        {status === 'success' ? (
          <>
            {userInfo ? (
              <div className="card mb-8" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', background: 'var(--surface-light)' }}>
                {userInfo.avatar_url && (
                  <img src={userInfo.avatar_url} alt="Profile" style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid var(--secondary)' }} />
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>{userInfo.display_name || 'TikTok User'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connected Account</div>
                </div>
              </div>
            ) : (
              <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto' }}>
                Successfully exchanged the authorization code for an access token via your secure Vercel API. You are now fully connected to CRMKG!
              </p>
            )}
          </>
        ) : status === 'error' ? (
          <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto' }}>
            TikTok returned an error: {errorMessage}
          </p>
        ) : (
          <p className="text-muted mb-8" style={{ maxWidth: 400, margin: '0 auto' }}>
            Securely exchanging authorization code with the backend server...
          </p>
        )}

        <Link to="/content-post" className="btn btn-outline mt-4">
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
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const handleAbsoluteNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

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
        <a
          href="https://crmkg.vercel.app/privacy"
          className={`nav-link ${isActive('/privacy')}`}
          onClick={(e) => handleAbsoluteNavigation(e, '/privacy')}
        >
          Privacy
        </a>
        <a
          href="https://crmkg.vercel.app/terms"
          className={`nav-link ${isActive('/terms')}`}
          onClick={(e) => handleAbsoluteNavigation(e, '/terms')}
        >
          Terms
        </a>
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
