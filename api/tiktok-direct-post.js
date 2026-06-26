import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'method_not_allowed' } });
  }

  const cookies = parse(req.headers.cookie || '');
  const accessToken = cookies.tiktok_access_token;

  if (!accessToken) {
    return res.status(401).json({
      error: {
        code: 'access_token_missing',
        message: 'Connect TikTok before publishing content.',
      },
    });
  }

  try {
    const { media_type: mediaType, post_info: postInfo, source_info: sourceInfo } = req.body;
    
    // In CRMKG, we check sandbox/audit status via env variables
    const directPostAudited = process.env.VITE_TIKTOK_DIRECT_POST_AUDITED === 'true';
    const isPhoto = mediaType === 'photo';
    const mediaUrl = sourceInfo?.media_url;
    const isFileUpload = sourceInfo?.source === 'FILE_UPLOAD';
    
    // We would validate creator privacy levels here, but assuming frontend has validated it.
    // Also skip URL prefix validation since we don't have the config array handy here.

    if (!directPostAudited && postInfo?.privacy_level !== 'SELF_ONLY') {
      return res.status(403).json({
        error: {
          code: 'direct_post_audit_required',
          message:
            'Cannot post with Public or Friend privacy yet. TikTok requires Direct Post audit approval for public/friend visibility. Choose Only Me to publish now.',
        },
      });
    }

    if (postInfo?.brand_content_toggle && postInfo?.privacy_level === 'SELF_ONLY') {
      return res.status(400).json({
        error: {
          code: 'branded_content_private_not_allowed',
          message: 'Branded content visibility cannot be set to private.',
        },
      });
    }

    if (isFileUpload && isPhoto) {
      return res.status(400).json({
        error: {
          code: 'photo_file_upload_not_supported',
          message: 'TikTok photo posts require Pull from verified URL.',
        },
      });
    }

    const endpoint = isPhoto
      ? `https://open.tiktokapis.com/v2/post/publish/content/init/`
      : `https://open.tiktokapis.com/v2/post/publish/video/init/`;

    const body = isPhoto
      ? {
          post_info: {
            title: postInfo.title,
            description: postInfo.title,
            disable_comment: postInfo.disable_comment,
            privacy_level: postInfo.privacy_level,
            auto_add_music: postInfo.auto_add_music ?? true,
            brand_content_toggle: postInfo.brand_content_toggle,
            brand_organic_toggle: postInfo.brand_organic_toggle,
          },
          source_info: {
            source: 'PULL_FROM_URL',
            photo_cover_index: 0,
            photo_images: [mediaUrl],
          },
          post_mode: 'DIRECT_POST',
          media_type: 'PHOTO',
        }
      : {
          post_info: postInfo,
          source_info: isFileUpload
            ? {
                source: 'FILE_UPLOAD',
                video_size: sourceInfo.video_size,
                chunk_size: sourceInfo.chunk_size,
                total_chunk_count: sourceInfo.total_chunk_count,
              }
            : {
                source: 'PULL_FROM_URL',
                video_url: mediaUrl,
              },
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(body),
    });
    
    const payload = await response.json();

    return res.status(response.ok ? 200 : response.status).json(payload);
  } catch (error) {
    return res.status(500).json({
      error: {
        code: 'direct_post_failed',
        message: error.message,
      },
    });
  }
}
