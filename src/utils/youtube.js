// YouTube URL builders for project demo banners.

export const buildYouTubeEmbedUrl = (videoId, { autoplay = false } = {}) =>
  `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;

export const buildYouTubeThumbnailUrl = (videoId) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export default buildYouTubeEmbedUrl;
