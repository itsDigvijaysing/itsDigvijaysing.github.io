import { useState } from 'react';
import { buildYouTubeEmbedUrl, buildYouTubeThumbnailUrl } from '../utils/youtube.js';

// Click-to-play demo banner: poster thumbnail until clicked, then an autoplaying embed.
// Nothing from YouTube loads until the user asks for it.
export default function ProjectVideo({ videoId, title }) {
  const [playing, setPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <div className="dt__banner dt__banner--video">
      {playing ? (
        <iframe
          src={buildYouTubeEmbedUrl(videoId, { autoplay: true })}
          title={`${title} demo video`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="dt__video-thumb"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title} demo video`}
        >
          <img src={buildYouTubeThumbnailUrl(videoId)} alt="" aria-hidden="true" loading="lazy" />
          <span className="dt__video-play" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
