// Single source of truth for all project pages.
// Content (subtitle/desc/overview/highlights/techStack/workflow) is derived from each
// project's actual source code; `workflow` drives the diagram in src/components/Workflow.jsx.
const projects = [
  {
    "title": "LightSpeak AI",
    "subtitle": "Multi-channel RAG AI for customer care",
    "slug": "lightspeak-ai",
    "date": "2025-11",
    "featured": true,
    "tags": [
      "AI",
      "Voice",
      "RAG",
      "Full Stack"
    ],
    "desc": "Multi-channel (voice, chat, email) customer-care AI that answers from each tenant's own documents via hybrid RAG, billed per token.",
    "link": "https://lightspeak.ai/",
    "linkLabel": "Visit Website",
    "github": null,
    "private": false,
    "overview": "LightSpeak is a multi-tenant B2B platform that embeds voice, chat, and email AI agents into customer products, each answering from the tenant's own uploaded documents. A Django backend is the single brain for text turns: it authenticates the API key, reserves credits, runs hybrid RAG retrieval (pgvector cosine + Postgres BM25, optional Cohere rerank), assembles a persona/opacity system prompt, calls a Groq gpt-oss model, sanitizes any leaked vendor names, then commits usage to a credit wallet and logs the session. Voice is the exception: a self-hosted LiveKit agent worker runs speech-to-text -> LLM -> text-to-speech in-process for low latency, calling Django only for persona, history, and metering. Documents are ingested by parsing, hierarchical chunking, and local EmbeddingGemma vectors stored in pgvector, and an IMAP/SMTP worker triages and answers email through the same RAG orchestrator.",
    "highlights": [
      "Hybrid RAG: one SQL query blends pgvector cosine (0.7) + Postgres BM25 (0.3), org-scoped for tenant isolation, with optional Cohere rerank and an exact-match FAQ fast-path",
      "One Django orchestrator per text turn: wallet reserve -> RAG -> persona/opacity prompt -> Groq gpt-oss LLM -> vendor-name sanitizer -> wallet commit; retrieved docs fenced in a per-turn random nonce to resist prompt injection",
      "Real-time voice worker runs STT->LLM->TTS in-process (LiveKit + Silero VAD + noise cancellation), routing Deepgram/Cartesia for English and Sarvam Saaras/Bulbul for Hindi/Hinglish personas"
    ],
    "techStack": [
      "Django 5",
      "PostgreSQL + pgvector",
      "LiveKit Agents",
      "Groq (gpt-oss LLM)",
      "Deepgram STT/TTS",
      "Sarvam & Cartesia voice",
      "EmbeddingGemma embeddings",
      "React 19 + Tailwind"
    ],
    "workflow": {
      "caption": "Query -> grounded, billed reply",
      "rows": [
        [
          {
            "id": "A",
            "label": "Customer query",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Channel?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "C",
            "label": "STT: Deepgram/Sarvam",
            "kind": "step"
          },
          {
            "id": "D",
            "label": "Auth + wallet reserve",
            "kind": "step"
          }
        ],
        [
          {
            "id": "E",
            "label": "Hybrid RAG retrieval",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "Groq LLM (gpt-oss)",
            "kind": "model"
          }
        ],
        [
          {
            "id": "G",
            "label": "TTS: aura/Cartesia",
            "kind": "step"
          },
          {
            "id": "H",
            "label": "Sanitize + debit",
            "kind": "step"
          }
        ],
        [
          {
            "id": "I",
            "label": "Customer response",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C",
          "label": "voice"
        },
        {
          "from": "B",
          "to": "D",
          "label": "chat/email"
        },
        {
          "from": "C",
          "to": "F"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "E",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G",
          "label": "voice"
        },
        {
          "from": "F",
          "to": "H",
          "label": "text"
        },
        {
          "from": "G",
          "to": "I"
        },
        {
          "from": "H",
          "to": "I"
        },
        {
          "from": "I",
          "to": "A",
          "label": "history",
          "back": true
        }
      ]
    }
  },
  {
    "title": "Indian Law AI Portal",
    "subtitle": "Grounded RAG over Indian statutes",
    "slug": "indian-law-ai-portal",
    "date": "2026-04",
    "featured": true,
    "tags": [
      "AI",
      "RAG",
      "Agents"
    ],
    "desc": "Agentic RAG assistant answering Indian-law questions grounded in 25 official statute PDFs, with hybrid retrieval, domain agents and validated citations.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/Indian-Law-AI-Portal",
    "private": false,
    "overview": "A FastAPI + React RAG portal that answers Indian-law questions grounded strictly in 25 official statute PDFs (Constitution plus the criminal, civil, personal, commercial, digital and labour codes), with no internet sources at runtime. A deterministic keyword classifier first routes each question to its legal category, then hybrid retrieval (dense FAISS over bge-small embeddings + BM25 keyword + exact section-label lookup, fused with reciprocal-rank fusion and reranked by a CrossEncoder) pulls the top passages, which are numbered and handed to one of ten config-driven domain agents. The selected agent builds one shared grounded prompt for Groq's Llama 3.3 70B (or Google Gemini), and every inline [n] citation is validated against the source list, confidence is scored from citations, and off-corpus questions get an explicit refusal instead of a hallucinated answer. Criminal, procedure and evidence answers surface both the current BNS/BNSS/BSA 2023 provisions and the legacy IPC/CrPC/Evidence-Act ones around the 1 July 2024 cut-over.",
    "highlights": [
      "Two-stage router: a deterministic keyword classifier picks the legal category, then retrieval is soft-boosted (25% lift, never hard-excluded) to that category's statutes plus linked codes, keeping recall for cross-cutting queries.",
      "Hybrid retrieval fuses dense FAISS (bge-small, 9,487 chunks over 25 statutes) with BM25 keyword and exact section-label lookup via reciprocal-rank fusion, then a CrossEncoder reranks the candidate pool.",
      "Server-side citation validation strips hallucinated [n] markers, scores confidence from citations (0.15 refusal up to 0.95 well-cited), and returns an explicit grounded refusal when nothing relevant is retrieved."
    ],
    "techStack": [
      "FastAPI",
      "React 18",
      "FAISS",
      "Sentence-Transformers",
      "Groq Llama 3.3 70B",
      "Google Gemini",
      "rank_bm25",
      "PyPDF2"
    ],
    "workflow": {
      "caption": "Query to cited statute answer",
      "rows": [
        [
          {
            "id": "A",
            "label": "User legal query",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Query classifier",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "FAISS + RAG-Fusion x3",
            "kind": "step"
          },
          {
            "id": "D",
            "label": "BM25 + label lookup",
            "kind": "step"
          }
        ],
        [
          {
            "id": "E",
            "label": "RRF fuse + rerank",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "Domain agent (10)",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "G",
            "label": "Groq Llama / Gemini",
            "kind": "model"
          }
        ],
        [
          {
            "id": "H",
            "label": "Validate cites + score",
            "kind": "step"
          }
        ],
        [
          {
            "id": "I",
            "label": "Cited JSON / SSE",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "B",
          "to": "D"
        },
        {
          "from": "C",
          "to": "E"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "E",
          "to": "F",
          "label": "retrieved"
        },
        {
          "from": "E",
          "to": "I",
          "label": "refusal"
        },
        {
          "from": "F",
          "to": "G"
        },
        {
          "from": "G",
          "to": "H"
        },
        {
          "from": "H",
          "to": "I"
        }
      ]
    }
  },
  {
    "title": "Web Agents",
    "subtitle": "LLM browser automation over CDP",
    "slug": "web-agents",
    "date": "2026-02",
    "featured": false,
    "tags": [
      "AI",
      "Agents",
      "Python"
    ],
    "desc": "Async Python library that lets LLM agents autonomously browse and act on web pages by driving Chrome over the DevTools Protocol.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/web_agents",
    "private": false,
    "overview": "web-agent is an async Python library (a browser-use derivative) that lets LLM agents complete open-ended web tasks by driving a real Chrome/Chromium browser over the Chrome DevTools Protocol. On each step it captures the page as a serialized DOM plus a CDP accessibility tree and screenshot, sends that to an LLM behind a unified multi-provider interface (Gemini, GPT, Claude, Groq, Ollama, Azure, Bedrock), and receives structured reasoning plus a list of actions to run. An event-bus-driven BrowserSession executes those actions (click, type, scroll, navigate, extract, done) with watchdogs for downloads, popups, security, DOM and crashes, looping until the model emits a 'done' action. It can also run as an MCP server and ships a Jupyter-like code-execution agent.",
    "highlights": [
      "Per-step perception captures a serialized DOM, CDP accessibility tree, and screenshot, indexing interactive elements for the LLM to reference.",
      "Unified multi-provider LLM layer (Gemini, GPT, Claude, Groq, Ollama, Azure, Bedrock) returns Pydantic-structured output: thinking, memory, next_goal, and a list of actions.",
      "Event-driven BrowserSession runs multiple actions per step over CDP with page-change guards and watchdogs (downloads, popups, security, DOM, crash); can also serve as an MCP server."
    ],
    "techStack": [
      "Python",
      "Chrome DevTools Protocol (CDP)",
      "cdp-use",
      "Pydantic",
      "google-genai (Gemini)",
      "OpenAI / Anthropic",
      "MCP",
      "bubus event bus",
      "asyncio"
    ],
    "workflow": {
      "caption": "Task -> browser actions -> result",
      "rows": [
        [
          {
            "id": "A",
            "label": "Task + LLM provider",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Launch Chrome (CDP)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Capture DOM + a11y tree",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "LLM plans actions",
            "kind": "model"
          }
        ],
        [
          {
            "id": "E",
            "label": "Execute actions (CDP)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "Task done?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "G",
            "label": "Final result",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "C",
          "to": "D"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "E",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G",
          "label": "yes"
        },
        {
          "from": "F",
          "to": "C",
          "label": "no",
          "back": true
        }
      ]
    }
  },
  {
    "title": "PIRvision Classifier",
    "subtitle": "PIR sensor human-activity deep learning",
    "slug": "pirvision-classifier",
    "date": "2025-06",
    "featured": false,
    "tags": [
      "ML",
      "IoT",
      "Deep Learning"
    ],
    "desc": "Deep-learning model classifying low-energy PIR motion-sensor time series into three human-activity levels via a CNN-LSTM plus gated MLP-fusion branch.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/pirvision-classifier-model",
    "private": false,
    "overview": "Classifies human presence and activity from the PIRvision office dataset, where each sample holds 55 analog PIR sensor readings plus ambient temperature and a timestamp. A preprocessing pipeline imputes missing values, caps PIR outliers using the IQR method, and engineers aggregate and cyclical-time features (69 total) that are then RobustScaler-normalized. The core PyTorch model passes the feature vector through a Conv1d + two-layer LSTM branch and a parallel MLP branch, then merges them with a learnable Softmax gated-fusion before a final 3-class output (vacancy / stationary / motion). It is trained with 5-fold stratified cross-validation and class-weighted cross-entropy, and the best fold is checkpointed to team_35.pth for evaluation on new CSVs.",
    "highlights": [
      "Hybrid architecture: a Conv1d + 2-layer LSTM branch and a parallel MLP branch merged by a learnable Softmax gated-fusion gate before the 3-class classifier.",
      "Engineers 69 features from 55 PIR readings and temperature (IQR outlier capping, PIR mean/std/range/IQR/trend stats, cyclical hour encoding) with a saved RobustScaler.",
      "Trained via 5-fold stratified cross-validation with class-weighted CrossEntropy for imbalance, Adam + ReduceLROnPlateau; best-fold weights saved to team_35.pth."
    ],
    "techStack": [
      "PyTorch",
      "scikit-learn",
      "pandas",
      "NumPy",
      "Matplotlib",
      "seaborn",
      "joblib",
      "Jupyter Notebook"
    ],
    "workflow": {
      "caption": "PIR series -> 3-class activity label",
      "rows": [
        [
          {
            "id": "A",
            "label": "PIR + temp time series",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Impute + cap outliers",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Feature engineering",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "Robust scaling",
            "kind": "step"
          }
        ],
        [
          {
            "id": "E",
            "label": "CNN + 2-layer LSTM",
            "kind": "model"
          },
          {
            "id": "F",
            "label": "Parallel MLP branch",
            "kind": "model"
          }
        ],
        [
          {
            "id": "G",
            "label": "Gated fusion",
            "kind": "step"
          }
        ],
        [
          {
            "id": "H",
            "label": "3-class activity label",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "C",
          "to": "D"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "D",
          "to": "F"
        },
        {
          "from": "E",
          "to": "G"
        },
        {
          "from": "F",
          "to": "G"
        },
        {
          "from": "G",
          "to": "H"
        }
      ]
    }
  },
  {
    "title": "Stat-Up",
    "subtitle": "Anime-RPG gamified daily task tracker",
    "slug": "stat-up",
    "date": "2026-05",
    "featured": true,
    "tags": [
      "Mobile",
      "Android",
      "Kotlin"
    ],
    "desc": "Android app that turns daily tasks and Todoist sync into an anime RPG status window: earn points, level 6 stats, rank up E to S, redeem rewards.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/Stat-Up",
    "private": false,
    "overview": "Stat-Up is an offline-first Kotlin/Jetpack Compose (Material 3) Android app built on MVVM + Room that gamifies daily productivity as an anime 'status window'. Completing a manual mission or a synced Todoist task awards points that accumulate into six RPG stats (STR/INT/WIS/DEX/CHA/VIT) rendered on a hexagon radar, and feed a points wallet, achievements, and custom rewards. Two WorkManager jobs drive the loop: a 15-minute Todoist sync worker (Ktor) that maps task priority to points and labels to stats with idempotent, dedup-by-externalId awards, and a midnight DecayEngine that raises or lowers rank E to S by streak consistency (Streak Freeze Shields absorb idle days). An optional, opt-in Gemini 2.5 Flash AI coach is gated behind an AES-256-GCM encrypted API key.",
    "highlights": [
      "Offline-first RPG engine: task points accumulate into 6 stats shown on a hexagon radar; a midnight DecayEngine raises/lowers rank E->S by streak consistency, with Streak Freeze Shields absorbing idle days.",
      "Todoist integration via a 15-min WorkManager sync worker over Ktor: maps priority->points and labels->stats, awards idempotently keyed by externalId (unique index) so overlapping syncs never double-count.",
      "Privacy-first: all data in Room, no accounts/analytics; Todoist + Gemini tokens live in AES-256-GCM EncryptedSharedPreferences, and the Gemini 2.5 Flash AI coach is fully opt-in."
    ],
    "techStack": [
      "Kotlin",
      "Jetpack Compose (Material 3)",
      "Room",
      "WorkManager",
      "Ktor",
      "Koin",
      "DataStore",
      "Gemini API",
      "Haze"
    ],
    "workflow": {
      "caption": "Task done -> points, stats, rank",
      "rows": [
        [
          {
            "id": "A",
            "label": "Manual mission tap",
            "kind": "input"
          },
          {
            "id": "B",
            "label": "Todoist completed task",
            "kind": "input"
          }
        ],
        [
          {
            "id": "C",
            "label": "Sync Worker (15 min)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "Award points + stats",
            "kind": "step"
          }
        ],
        [
          {
            "id": "E",
            "label": "6 stats -> Hexagon",
            "kind": "output"
          },
          {
            "id": "F",
            "label": "Wallet -> Rewards",
            "kind": "output"
          },
          {
            "id": "G",
            "label": "Achievement unlock",
            "kind": "step"
          }
        ],
        [
          {
            "id": "H",
            "label": "Midnight DecayWorker",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "I",
            "label": "Streak + rank up",
            "kind": "output"
          },
          {
            "id": "J",
            "label": "Decay + notify",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "A",
          "to": "D",
          "label": "manual"
        },
        {
          "from": "C",
          "to": "D",
          "label": "priority"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "D",
          "to": "F"
        },
        {
          "from": "D",
          "to": "G"
        },
        {
          "from": "G",
          "to": "D",
          "label": "bonus",
          "back": true
        },
        {
          "from": "D",
          "to": "H",
          "label": "at midnight"
        },
        {
          "from": "H",
          "to": "I",
          "label": "active"
        },
        {
          "from": "H",
          "to": "J",
          "label": "idle"
        }
      ]
    }
  },
  {
    "title": "Jira Automation Portal",
    "subtitle": "AI turns requirements into Jira tickets",
    "slug": "jira-automation-portal",
    "date": "2025-07",
    "featured": true,
    "tags": [
      "AI",
      "Productivity",
      "Full Stack"
    ],
    "desc": "Django + React portal that turns one requirement into a Jira parent ticket, AI-generated dev tasks, and per-task test-case sub-tasks via Gemini.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/Jira_Automation_Portal",
    "private": false,
    "overview": "A full-stack portal (Django REST backend + React/Tailwind SPA) that automates Jira ticket breakdown. From a single free-form requirement, AutomationService creates a parent Jira Task, asks Google Gemini for 3-5 development tasks (JSON-enforced), creates each as a Jira Task linked to the parent, then generates 3-5 test cases per task and files them as sub-tasks. Gemini calls rotate between two API keys with backoff on quota errors and fall back to hardcoded tasks/test cases if the model is unavailable; all Jira reads and writes go through the Jira Cloud REST v3 API.",
    "highlights": [
      "One free-form requirement fans out to a parent Jira Task, 3-5 AI dev Tasks (linked via 'Relates'), and 3-5 test-case sub-tasks per task, all created through Jira Cloud REST v3.",
      "Gemini output forced to JSON via response_mime_type with a fence-tolerant parser; dual API-key rotation plus backoff on 429/quota, and hardcoded fallback tasks/test cases when the model is unavailable.",
      "Reads issues via Atlassian's new /rest/api/3/search/jql endpoint with nextPageToken pagination (legacy /search removed Oct 2025); DRF views over a thread-locked singleton Gemini client."
    ],
    "techStack": [
      "Django",
      "Django REST Framework",
      "Google Gemini (google-genai)",
      "Jira Cloud REST API v3",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Python"
    ],
    "workflow": {
      "caption": "Requirement -> linked Jira ticket tree",
      "rows": [
        [
          {
            "id": "A",
            "label": "Requirement Input",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Django Workflow API",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Create Parent Task",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "Gemini: Dev Tasks",
            "kind": "model"
          },
          {
            "id": "K",
            "label": "429 / quota?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "E",
            "label": "Create + Link Tasks",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "Gemini: Test Cases",
            "kind": "model"
          }
        ],
        [
          {
            "id": "G",
            "label": "Create Sub-tasks",
            "kind": "step"
          }
        ],
        [
          {
            "id": "H",
            "label": "Linked Ticket Tree",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "C",
          "to": "D"
        },
        {
          "from": "D",
          "to": "K"
        },
        {
          "from": "K",
          "to": "D",
          "label": "rotate key",
          "back": true
        },
        {
          "from": "K",
          "to": "E",
          "label": "on success"
        },
        {
          "from": "E",
          "to": "F",
          "label": "per task"
        },
        {
          "from": "F",
          "to": "G"
        },
        {
          "from": "G",
          "to": "H"
        }
      ]
    }
  },
  {
    "title": "AI Linux Assistant",
    "subtitle": "Fully local Linux voice assistant",
    "slug": "ai-linux-assistant",
    "date": "2026-02",
    "featured": true,
    "tags": [
      "AI",
      "LLM",
      "Python"
    ],
    "desc": "Local-first Linux voice assistant: Parakeet ASR, qwen3 via Ollama, and SuperTonic TTS all offline, that can safely act on your GNOME desktop.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/AI_Linux_Assistant",
    "private": false,
    "overview": "A local-first, Wayland-native voice assistant for Linux, built by vendoring and evolving the dnhkng/GLaDOS engine. A microphone stream is gated by Silero VAD, transcribed by Parakeet ASR (ONNX on CPU), and routed to a qwen3:4b brain running locally through Ollama on the GPU (an optional Groq cloud brain is a drop-in swap); the reply is spoken back via SuperTonic TTS with a Kokoro fallback, keeping the GPU free for the LLM. When the user asks it to do something, the model calls typed MCP tools (13 native desktop actions plus a general shell fallback) through a fail-safe safety gate, and the tool result is fed back to the brain for a spoken summary. A GNOME Shell overlay tracks state and listening mode, and PipeWire echo-cancel enables talk-over barge-in.",
    "highlights": [
      "Fully local, no-API-key pipeline: Parakeet ASR + qwen3:4b (Ollama) + SuperTonic TTS, with the LLM on the GPU and all speech models on CPU as ONNX to fit a 6 GB VRAM budget.",
      "The qwen3 brain acts as a router: it either speaks a reply or calls one of 13 typed desktop tools (brightness, volume, lock, screenshot, open app/link, media, night light, DND, terminal, clipboard...) plus a shell fallback via MCP.",
      "Fail-safe safety layer: gated actions denied unless the session is armed, an autonomy hard-floor deny, a catastrophic-command denylist, and systemd-run resource caps, all sharing one execution chokepoint."
    ],
    "techStack": [
      "Python",
      "Ollama (qwen3:4b)",
      "ONNX Runtime",
      "Parakeet ASR",
      "SuperTonic TTS",
      "Silero VAD",
      "MCP (Model Context Protocol)",
      "PipeWire",
      "GNOME Shell extension"
    ],
    "workflow": {
      "caption": "Speech in -> local reasoning -> speak or act on desktop",
      "rows": [
        [
          {
            "id": "A",
            "label": "Mic / text input",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Silero VAD (CPU)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Parakeet ASR (ONNX)",
            "kind": "model"
          }
        ],
        [
          {
            "id": "D",
            "label": "qwen3:4b - Ollama",
            "kind": "model"
          }
        ],
        [
          {
            "id": "E",
            "label": "Answer or act?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "F",
            "label": "Safety gate",
            "kind": "step"
          },
          {
            "id": "G",
            "label": "SuperTonic TTS",
            "kind": "model"
          }
        ],
        [
          {
            "id": "H",
            "label": "MCP desktop tool",
            "kind": "step"
          },
          {
            "id": "I",
            "label": "Speaker",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "C",
          "to": "D"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "E",
          "to": "F",
          "label": "act"
        },
        {
          "from": "E",
          "to": "G",
          "label": "answer"
        },
        {
          "from": "F",
          "to": "H",
          "label": "if armed"
        },
        {
          "from": "H",
          "to": "D",
          "label": "result",
          "back": true
        },
        {
          "from": "G",
          "to": "I"
        }
      ]
    }
  },
  {
    "title": "MessMenu App",
    "subtitle": "Cross-platform mess menu app, Azure backend",
    "slug": "messmenu-app",
    "date": "2023-05",
    "featured": false,
    "tags": [
      "Mobile",
      "Azure",
      "Full Stack"
    ],
    "desc": "Expo React Native app to browse mess and tiffin menus and pricing, with an owner portal to update listings and images via an Azure backend.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/MessMenu",
    "private": false,
    "overview": "MessMenu is an Expo/React Native mobile app that lets students browse mess restaurants and tiffin services, viewing each mess's daily menu image, thali and monthly pricing, veg/non-veg tags, parcel availability and contact details. From the Welcome screen the user picks a Customer or Mess Owner path: customers get a searchable listing (filtered to messes flagged online) plus read-only detail and full-image screens, while owners can sign up, log in, and update their mess details, pricing, and menu/profile images. All data flows over REST (apisauce/fetch) to an Azure App Service backend (azappservicebackendfree.azurewebsites.net/messdetails) backed by Azure MongoDB, with images sent as base64 and persisted to Azure Blob Storage. There is no in-app ordering or payment; customers browse and contact messes directly.",
    "highlights": [
      "Role-based React Navigation stack from a Welcome screen splits into a Customer browse path and a Mess Owner login/update path (App.js).",
      "Owner CRUD over REST: signup POST /messdetails, login POST /auth, edit fields PATCH /:id, and base64 image upload PATCH /upmessimages/:id.",
      "Azure App Service backend with MongoDB records and Azure Blob Storage for menu/mess images; API base URL set in app.json extra.apiBaseUrl."
    ],
    "techStack": [
      "React Native",
      "Expo",
      "React Navigation",
      "Azure App Service",
      "MongoDB",
      "Azure Blob Storage",
      "apisauce",
      "Node.js / Express",
      "Yup"
    ],
    "workflow": {
      "caption": "Role choice -> Azure REST API -> MongoDB/Blob",
      "rows": [
        [
          {
            "id": "A",
            "label": "Open App (Welcome)",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Customer or Owner?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "C",
            "label": "Browse listings",
            "kind": "step"
          },
          {
            "id": "D",
            "label": "Owner login / signup",
            "kind": "step"
          }
        ],
        [
          {
            "id": "E",
            "label": "View menu & pricing",
            "kind": "step"
          },
          {
            "id": "F",
            "label": "Update menu / details",
            "kind": "step"
          }
        ],
        [
          {
            "id": "G",
            "label": "Azure App Service API",
            "kind": "step"
          }
        ],
        [
          {
            "id": "H",
            "label": "MongoDB + Blob Storage",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C",
          "label": "Customer"
        },
        {
          "from": "B",
          "to": "D",
          "label": "Owner"
        },
        {
          "from": "C",
          "to": "E"
        },
        {
          "from": "E",
          "to": "G",
          "label": "GET"
        },
        {
          "from": "D",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G",
          "label": "POST/PATCH"
        },
        {
          "from": "G",
          "to": "H"
        }
      ]
    }
  },
  {
    "title": "GNOME Stage Manager",
    "subtitle": "macOS Stage Manager for GNOME",
    "slug": "gnome-stage-manager",
    "date": "2026-03",
    "featured": true,
    "tags": [
      "Desktop",
      "GNOME",
      "JavaScript"
    ],
    "desc": "A GNOME Shell extension that groups windows into stages, showing inactive groups as thumbnail cards in a left sidebar; click a card to swap stages.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/gnome-stage-manager",
    "private": false,
    "overview": "Stage Manager is a single-file GNOME Shell 45-50 extension (GJS/ESM) that recreates macOS Stage Manager. Windows on the active workspace form the visible active group; minimizing a window splits it into its own inactive group, rendered as a stacked-thumbnail card in a transparent left sidebar. Clicking a card swaps stages: the active group minimizes while the target group unminimizes and is raised. It also offers per-app and per-workspace sidebar modes, an optional maximize-to-workspace behavior, bell-curve hover scaling, 3D perspective, live previews, and a libadwaita preferences dialog.",
    "highlights": [
      "Groups mode: minimizing a window pops it into its own inactive stage; clicking a sidebar card swaps stages (minimizes the active group, unminimizes and raises the target).",
      "Three sidebar modes (groups/apps/workspaces) with stacked window-clone thumbnails, bell-curve hover scaling, 3D Y-axis perspective, live previews, and app-icon fallback for uncloneable windows.",
      "EGO-review lifecycle discipline: every signal tracked and disconnected, every GLib timer paired with source_remove, plus HiDPI scaling, light/dark theming, multi-monitor rebuild, and fullscreen auto-hide."
    ],
    "techStack": [
      "GJS (JavaScript ESM)",
      "GNOME Shell Extension API",
      "Clutter",
      "St (Shell Toolkit)",
      "Mutter / Meta",
      "GLib",
      "GSettings (GSchema)",
      "libadwaita / GTK4"
    ],
    "workflow": {
      "caption": "Window event -> stage sidebar -> swap",
      "rows": [
        [
          {
            "id": "A",
            "label": "Window event",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Assign to stage group",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Active group?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "D",
            "label": "Visible in workspace",
            "kind": "output"
          },
          {
            "id": "E",
            "label": "Sidebar thumbnail card",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "User clicks card?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "G",
            "label": "Swap old/new stages",
            "kind": "step"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "C",
          "to": "D",
          "label": "yes"
        },
        {
          "from": "C",
          "to": "E",
          "label": "no"
        },
        {
          "from": "E",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G",
          "label": "click"
        },
        {
          "from": "G",
          "to": "C",
          "label": "re-render",
          "back": true
        }
      ]
    }
  },
  {
    "title": "Emotion Recognition",
    "subtitle": "Audio and text emotion fusion",
    "slug": "emotion-recognition",
    "date": "2025-05",
    "featured": false,
    "tags": [
      "ML",
      "NLP",
      "Multimodal"
    ],
    "desc": "Multimodal PyTorch pipeline that classifies eight RAVDESS speech emotions by fusing an audio CNN with LSTM and DistilBERT text models.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/Emotion_Recognition_Epoch",
    "private": false,
    "overview": "A PyTorch notebook that classifies the eight RAVDESS speech emotions from both audio and text. Each clip is turned into a log-Mel spectrogram for a 2D CNN, while its transcript (predefined emotion sentences by default, or optional OpenAI Whisper output) trains a bidirectional LSTM and a fine-tuned DistilBERT. The unimodal models are then combined two ways: early fusion concatenates their frozen features into a classifier head, and late fusion averages the softmax probabilities. Every model is trained, saved, and evaluated end-to-end in a single script.",
    "highlights": [
      "2D CNN over log-Mel spectrograms for audio, plus a bidirectional 2-layer LSTM and a fine-tuned DistilBERT over transcripts",
      "Two fusion modes: early fusion concatenates frozen unimodal features into an FC head; late fusion averages softmax probabilities",
      "Committed RAVDESS run (1440 clips, 8 emotions): audio CNN ~66% and RNN early/late fusion ~95% test accuracy"
    ],
    "techStack": [
      "PyTorch",
      "Hugging Face Transformers",
      "DistilBERT",
      "librosa",
      "OpenAI Whisper",
      "scikit-learn",
      "NumPy / pandas"
    ],
    "workflow": {
      "caption": "Audio + text -> fused emotion",
      "rows": [
        [
          {
            "id": "A",
            "label": "RAVDESS Audio",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Mel Spectrogram",
            "kind": "step"
          },
          {
            "id": "C",
            "label": "Simulated/Whisper Text",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "Audio CNN",
            "kind": "model"
          },
          {
            "id": "E",
            "label": "LSTM / DistilBERT",
            "kind": "model"
          }
        ],
        [
          {
            "id": "F",
            "label": "Fusion Strategy",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "G",
            "label": "Concat + FC Head",
            "kind": "step"
          },
          {
            "id": "H",
            "label": "Avg Probabilities",
            "kind": "step"
          }
        ],
        [
          {
            "id": "I",
            "label": "8 Emotion Classes",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "A",
          "to": "C"
        },
        {
          "from": "B",
          "to": "D"
        },
        {
          "from": "C",
          "to": "E"
        },
        {
          "from": "D",
          "to": "F"
        },
        {
          "from": "E",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G",
          "label": "Early"
        },
        {
          "from": "F",
          "to": "H",
          "label": "Late"
        },
        {
          "from": "G",
          "to": "I"
        },
        {
          "from": "H",
          "to": "I"
        }
      ]
    }
  },
  {
    "title": "Salesforce Apex Code Fixer",
    "subtitle": "Auto-patches Apex security vulnerabilities",
    "slug": "salesforce-apex-code-fixer",
    "date": "2023-08",
    "featured": false,
    "tags": [
      "Salesforce",
      "Security",
      "Full Stack"
    ],
    "desc": "A Flask + React web tool that auto-remediates common Salesforce Apex security issues via regex-based FLS, CRUD, sharing, and debug fixes.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/SF_Security_Issue_Fixer",
    "private": false,
    "overview": "A full-stack web app that hardens Salesforce Apex code against common security issues. A React (Create React App) frontend lets the user paste Apex and toggle fix options, then POSTs the code plus selections to a Flask backend. The server conditionally applies regex-based transforms - injecting WITH USER_MODE into SOQL queries, wrapping DML in isCreateable/isUpdateable/isDeleteable CRUD pre-checks, adding a with/without/inherited sharing modifier, and commenting out System.debug lines - writes the result to output_code.txt, and serves it back for display and download. All remediation is rule/regex-based; there is no ML or LLM in the pipeline.",
    "highlights": [
      "Flask /submit-code chains up to four regex Apex transforms, each gated by a frontend checkbox; /output-file serves the patched file",
      "soql_query_fixer injects WITH USER_MODE (FLS); dml_operation_fixer wraps Insert/Update/Upsert/Delete in CRUD isCreateable/isUpdateable/isDeleteable pre-checks",
      "comment_out_debugs comments System.debug lines and set_sharing_option adds with/without/inherited sharing to the class declaration"
    ],
    "techStack": [
      "Python",
      "Flask",
      "React",
      "Regex (re)",
      "Axios",
      "Flask-CORS",
      "Create React App",
      "Salesforce Apex"
    ],
    "workflow": {
      "caption": "Apex in -> patched Apex out",
      "rows": [
        [
          {
            "id": "A",
            "label": "Paste Apex + options",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "POST /submit-code",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "SOQL WITH USER_MODE",
            "kind": "step"
          },
          {
            "id": "D",
            "label": "DML CRUD pre-check",
            "kind": "step"
          },
          {
            "id": "E",
            "label": "Comment System.debug",
            "kind": "step"
          },
          {
            "id": "F",
            "label": "Inject sharing modifier",
            "kind": "step"
          }
        ],
        [
          {
            "id": "G",
            "label": "Write output_code.txt",
            "kind": "step"
          }
        ],
        [
          {
            "id": "H",
            "label": "Fetch + download file",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C",
          "label": "fsoql"
        },
        {
          "from": "B",
          "to": "D",
          "label": "fdml"
        },
        {
          "from": "B",
          "to": "E",
          "label": "fcmt"
        },
        {
          "from": "B",
          "to": "F",
          "label": "fshr"
        },
        {
          "from": "C",
          "to": "G"
        },
        {
          "from": "D",
          "to": "G"
        },
        {
          "from": "E",
          "to": "G"
        },
        {
          "from": "F",
          "to": "G"
        },
        {
          "from": "G",
          "to": "H",
          "label": "/output-file"
        }
      ]
    }
  },
  {
    "title": "Shooting Competition",
    "subtitle": "Full-stack shooting match scoring platform",
    "slug": "shooting-competition",
    "date": "2023-06",
    "featured": false,
    "tags": [
      "Web",
      "Full Stack"
    ],
    "desc": "Full-stack platform to register shooters, enter 10-shot series scores, and auto-rank competitors with tie-break rules, medals, analytics and CSV export.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/shooting_competition",
    "private": false,
    "overview": "A React 18 single-page app talking to a Node.js/Express REST API backed by MySQL, for running shooting competitions end to end. JWT auth with admin and participant roles gates the routes; admins create competitions, register participants, and enter scores series-by-series (10 individual shots each), which are written transactionally into series_scores and shots and used to recompute each participant's totals, ten-pointers, and first/last series scores. The backend then produces ranked leaderboards using SQL window functions with a 4-level tie-break, awards Gold/Silver/Bronze per Event x Age x Gender category, computes finals qualifiers and medal tallies, and supports CSV export plus an analytics dashboard.",
    "highlights": [
      "JWT auth with role-based access: an Axios interceptor attaches the Bearer token and Express authenticateUser/requireAdmin middleware gate admin-only register, score, analytics and user-management routes.",
      "Score entry saves 10 shots per series inside a MySQL transaction (series_scores + shots), auto-calculating series totals and ten-pointers and denormalizing per-participant totals and first/last series scores.",
      "Ranking engine uses SQL ROW_NUMBER window functions with 4-level tie-break (total -> ten-pointers -> last series -> first series) to assign per-category Gold/Silver/Bronze medals, finals qualifiers and CSV export."
    ],
    "techStack": [
      "React 18",
      "Node.js",
      "Express",
      "MySQL (mysql2)",
      "JWT",
      "Axios",
      "bcrypt",
      "React Router v6"
    ],
    "workflow": {
      "caption": "Login -> score entry -> ranked results",
      "rows": [
        [
          {
            "id": "A",
            "label": "Login (username/pwd)",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "JWT auth + role gate",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Register participant",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "Enter series (10 shots)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "E",
            "label": "MySQL txn: save+recalc",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "SQL ranking window",
            "kind": "step"
          }
        ],
        [
          {
            "id": "G",
            "label": "Results / analytics",
            "kind": "output"
          },
          {
            "id": "H",
            "label": "CSV export",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C",
          "label": "admin"
        },
        {
          "from": "C",
          "to": "D"
        },
        {
          "from": "D",
          "to": "E"
        },
        {
          "from": "E",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G"
        },
        {
          "from": "F",
          "to": "H"
        }
      ]
    }
  },
  {
    "title": "Leave Management System",
    "subtitle": "Salesforce LWC leave request and approval app",
    "slug": "leave-management",
    "date": "2023-03",
    "featured": false,
    "tags": [
      "Salesforce",
      "LWC"
    ],
    "desc": "A Salesforce LWC app where employees apply for leaves and managers approve or reject them, with leave balances auto-tallied by an Apex trigger.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/Leave-Management-System-Salesforce",
    "private": false,
    "overview": "A Salesforce application built from a single Lightning Web Component and an Apex backend for applying, editing, and approving employee leaves. Employees submit Planned/Sick/Unpaid leave requests through a lightning-record-form (status defaults to Pending) and track them in a status-colored datatable and Chart.js pie charts of consumed vs. remaining balance. Managers open an 'Applied Leaves' tab to set the Status picklist to Approve/Reject with a comment; an after insert/update Apex trigger then tallies approved days into the User_Leaves__c object, whose Remaining Leaves is a formula field. Access is role-gated - SECURITY_ENFORCED SOQL scopes employees to their own records while managers can query all requests.",
    "highlights": [
      "Single three-tab LWC: personal request datatable, Chart.js pie dashboards of consumed vs. remaining leaves, and a manager-wide 'Applied Leaves' view.",
      "after insert/update Apex trigger auto-tallies approved days (daysBetween+1) into User_Leaves__c.Total_Consumed__c, with Remaining Leaves as a formula field.",
      "Role-gated edit form exposes Status/Manager_Comment only to managers, while SECURITY_ENFORCED SOQL restricts employees to their own leave records."
    ],
    "techStack": [
      "Lightning Web Components",
      "Apex",
      "Salesforce Platform",
      "SOQL",
      "Apex Triggers",
      "Chart.js",
      "Lightning Data Service",
      "Salesforce DX"
    ],
    "workflow": {
      "caption": "Apply -> approve -> balance auto-updates",
      "rows": [
        [
          {
            "id": "A",
            "label": "Employee (LWC form)",
            "kind": "input"
          }
        ],
        [
          {
            "id": "B",
            "label": "Submit leave request",
            "kind": "step"
          }
        ],
        [
          {
            "id": "C",
            "label": "Leave_Request (Pending)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "D",
            "label": "Manager sets Status",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "E",
            "label": "Trigger + ApproveVal",
            "kind": "step"
          }
        ],
        [
          {
            "id": "F",
            "label": "Update User_Leaves__c",
            "kind": "step"
          }
        ],
        [
          {
            "id": "G",
            "label": "Charts + datatable",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "A",
          "to": "B"
        },
        {
          "from": "B",
          "to": "C"
        },
        {
          "from": "C",
          "to": "D"
        },
        {
          "from": "D",
          "to": "E",
          "label": "Approve"
        },
        {
          "from": "D",
          "to": "G",
          "label": "Reject"
        },
        {
          "from": "E",
          "to": "F"
        },
        {
          "from": "F",
          "to": "G"
        }
      ]
    }
  }
];

export default projects;

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);
export const getProject = (slug) => projects.find((p) => p.slug === slug);
