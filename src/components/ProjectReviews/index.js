import LightSpeakAiReview from './LightSpeakAiReview.jsx';
import IndianLawAiPortalReview from './IndianLawAiPortalReview.jsx';
import StatUpReview from './StatUpReview.jsx';
import GnomeStageManagerReview from './GnomeStageManagerReview.jsx';
import AiLinuxAssistantReview from './AiLinuxAssistantReview.jsx';
import WebAgentsReview from './WebAgentsReview.jsx';
import PirvisionClassifierReview from './PirvisionClassifierReview.jsx';
import MessMenuAppReview from './MessMenuAppReview.jsx';
import EmotionRecognitionReview from './EmotionRecognitionReview.jsx';

// Projects with a bespoke, hand-built detail page. Add an entry here to give a project
// its own showcase; anything absent falls back to the generic Overview/Highlights layout.
const PROJECT_REVIEWS = {
  'lightspeak-ai': LightSpeakAiReview,
  'indian-law-ai-portal': IndianLawAiPortalReview,
  'stat-up': StatUpReview,
  'gnome-stage-manager': GnomeStageManagerReview,
  'ai-linux-assistant': AiLinuxAssistantReview,
  'web-agents': WebAgentsReview,
  'pirvision-classifier': PirvisionClassifierReview,
  'messmenu-app': MessMenuAppReview,
  'emotion-recognition': EmotionRecognitionReview,
};

export const getProjectReview = (slug) => PROJECT_REVIEWS[slug] || null;

export default PROJECT_REVIEWS;
