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
    "overview": "LightSpeak lets B2B companies drop a voice, chat, and email AI agent into their product that only answers from that tenant's own documents, so support scales without sacrificing accuracy or leaking data across customers. I built it as a metered, multi-tenant platform from the ground up - a Django backend runs retrieval and billing for every text turn, while a dedicated low-latency worker handles real-time voice.",
    "highlights": [
      "Hybrid RAG: one SQL query blends pgvector cosine (0.7) + Postgres BM25 (0.3), org-scoped for tenant isolation, with optional Cohere rerank and an exact-match FAQ fast-path",
      "One Django orchestrator per text turn: wallet reserve -> RAG -> persona/opacity prompt ->  llm LLM -> vendor-name sanitizer -> wallet commit; retrieved docs fenced in a per-turn random nonce to resist prompt injection",
      "Real-time voice worker runs STT->LLM->TTS in-process. Django is only called for persona, history, and metering, keeping latency low. Each tenant can upload a unique voice for TTS."
    ],
    "techStack": [
      "Django 5",
      "PostgreSQL + pgvector",
      "Langchain Agents",
      "STT/TTS",
      "Unique voice",
      "EmbeddingGemma embeddings",
      "React 19 + Tailwind"
    ],
    "workflow": {
  "caption": "Multi-channel query → grounded, billed reply (8-stage LightSpeak Core)",
  "rows": [
    [
      { "id": "A", "label": "Customer query", "kind": "input" }
    ],
    [
      { "id": "B", "label": "Channel?", "kind": "decision" }
    ],
    [
      { "id": "C1", "label": "WhatsApp webhook", "kind": "step" },
      { "id": "C2", "label": "STT · Tuned Model", "kind": "step" },
      { "id": "C3", "label": "Chat / Email ingest", "kind": "step" }
    ],
    [
      { "id": "S1", "label": "① Tenant auth + resolve", "kind": "step" }
    ],
    [
      { "id": "S2", "label": "② Wallet pre-flight reserve", "kind": "step" }
    ],
    [
      { "id": "S3", "label": "③ Knowledge Engine · Hybrid RAG (per tenant)", "kind": "step" }
    ],
    [
      { "id": "S4", "label": "④ Persona / tone + opacity assembly", "kind": "step" }
    ],
    [
      { "id": "S5", "label": "⑤ Reasoning Engine · LLM", "kind": "model" }
    ],
    [
      { "id": "S6", "label": "⑥ Response sanitiser", "kind": "step" }
    ],
    [
      { "id": "S7", "label": "⑦ Wallet commit + ledger", "kind": "step" }
    ],
    [
      { "id": "S8", "label": "⑧ Memory Vault + message log", "kind": "step" }
    ],
    [
      { "id": "T", "label": "TTS · aura / Cartesia", "kind": "step" },
      { "id": "R", "label": "Text / Email response", "kind": "step" }
    ],
    [
      { "id": "Z", "label": "Customer response", "kind": "output" }
    ]
  ],
  "edges": [
    { "from": "A", "to": "B" },
    { "from": "B", "to": "C1", "label": "whatsapp" },
    { "from": "B", "to": "C2", "label": "voice" },
    { "from": "B", "to": "C3", "label": "chat / email" },
    { "from": "C1", "to": "S1" },
    { "from": "C2", "to": "S1" },
    { "from": "C3", "to": "S1" },
    { "from": "S1", "to": "S2" },
    { "from": "S2", "to": "S3" },
    { "from": "S3", "to": "S4" },
    { "from": "S4", "to": "S5" },
    { "from": "S5", "to": "S6" },
    { "from": "S6", "to": "S7" },
    { "from": "S7", "to": "S8" },
    { "from": "S8", "to": "T", "label": "voice" },
    { "from": "S8", "to": "R", "label": "text" },
    { "from": "T", "to": "Z" },
    { "from": "R", "to": "Z" },
    { "from": "Z", "to": "A", "label": "history", "back": true }
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
    "overview": "Legal information in India is scattered across dozens of statutes, and most AI tools either hallucinate citations or answer from unreliable web sources. I built a RAG portal that only answers from 25 official statute PDFs, routes each question to the right legal domain, and refuses to answer anything it can't ground and cite - trading breadth for something closer to trustworthy.",
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
      " Groq LLM",
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
            "label": " Llama / Gemini",
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
      "Python",
      "RAG"
    ],
    "desc": "Async Python library that lets LLM agents autonomously browse and act on web pages over the Chrome DevTools Protocol, with trajectory memory that learns from past runs.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/web_agents",
    "private": false,
    "overview": "Most browser-automation agents are black boxes that repeat the same mistakes on every run. web-agent is an async Python library that lets an LLM drive a real Chrome browser through an observe-decide-act loop, and - the part I cared about most - it remembers: each run distills into a short lesson that gets retrieved and reused on similar future tasks, so the agent actually improves over time.",
    "highlights": [
      "Per-step perception captures a serialized DOM, CDP accessibility tree, and screenshot, indexing interactive elements for the LLM to reference.",
      "Trajectory memory (opt-in): after each run the agent summarizes a 'lesson' and appends it to a local JSONL store, then on similar future tasks embeds the task, cosine-ranks past runs, and injects the top lessons as hints - retrieval-augmented, no vector DB, degrading gracefully to storage-only when no embedding provider is available (adapted from Agent S's narrative memory).",
      "Unified multi-provider LLM layer returns Pydantic-structured output (thinking, memory, next_goal, actions) and auto-resolves whichever provider key is present - any hosted LLM API, or fully local and keyless via Ollama.",
      "Event-driven BrowserSession runs multiple actions per step over CDP via a bubus event bus coordinating 12 watchdogs (downloads, popups, security, DOM, crash); can also serve as an MCP server and includes a Jupyter-like code agent."
    ],
    "techStack": [
      "Python",
      "asyncio",
      "Chrome DevTools Protocol (CDP)",
      "cdp-use",
      "Pydantic",
      "Multi-provider LLM layer",
      "Ollama (local LLM)",
      "Embedding retrieval (RAG)",
      "bubus event bus",
      "MCP"
    ],
    "workflow": {
      "caption": "Agent.run: memory retrieval -> step loop (observe · decide · act) -> memory recording",
      "rows": [
        [
          {
            "id": "Start",
            "label": "Agent.run(task)",
            "kind": "input"
          }
        ],
        [
          {
            "id": "Mem",
            "label": "Trajectory memory enabled?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "Retr",
            "label": "Embed task · cosine-search past trajectories",
            "kind": "step"
          }
        ],
        [
          {
            "id": "Inject",
            "label": "Inject relevant lessons into LLM context",
            "kind": "step"
          }
        ],
        [
          {
            "id": "Obs",
            "label": "Observe: DOM + a11y tree + screenshot (CDP)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "Ser",
            "label": "Serialize DOM · index interactive elements",
            "kind": "step"
          }
        ],
        [
          {
            "id": "Msg",
            "label": "MessageManager builds prompt (+ memory)",
            "kind": "step"
          }
        ],
        [
          {
            "id": "LLM",
            "label": "LLM decides next actions (AgentOutput)",
            "kind": "model"
          }
        ],
        [
          {
            "id": "Act",
            "label": "multi_act · Tools · watchdogs · CDP",
            "kind": "step"
          }
        ],
        [
          {
            "id": "Done",
            "label": "done?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "Rec",
            "label": "Memory enabled?",
            "kind": "decision"
          }
        ],
        [
          {
            "id": "Sum",
            "label": "Summarize run into a lesson (LLM)",
            "kind": "model"
          }
        ],
        [
          {
            "id": "Emb",
            "label": "Embed + append to trajectories.jsonl",
            "kind": "step"
          }
        ],
        [
          {
            "id": "End",
            "label": "Return AgentHistoryList",
            "kind": "output"
          }
        ]
      ],
      "edges": [
        {
          "from": "Start",
          "to": "Mem"
        },
        {
          "from": "Mem",
          "to": "Retr",
          "label": "yes"
        },
        {
          "from": "Mem",
          "to": "Obs",
          "label": "no"
        },
        {
          "from": "Retr",
          "to": "Inject"
        },
        {
          "from": "Inject",
          "to": "Obs"
        },
        {
          "from": "Obs",
          "to": "Ser"
        },
        {
          "from": "Ser",
          "to": "Msg"
        },
        {
          "from": "Msg",
          "to": "LLM"
        },
        {
          "from": "LLM",
          "to": "Act"
        },
        {
          "from": "Act",
          "to": "Done"
        },
        {
          "from": "Done",
          "to": "Obs",
          "label": "no",
          "back": true
        },
        {
          "from": "Done",
          "to": "Rec",
          "label": "yes"
        },
        {
          "from": "Rec",
          "to": "Sum",
          "label": "yes"
        },
        {
          "from": "Sum",
          "to": "Emb"
        },
        {
          "from": "Emb",
          "to": "End"
        },
        {
          "from": "Rec",
          "to": "End",
          "label": "no"
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
    "overview": "Cheap PIR motion sensors only give a noisy on/off signal, which isn't enough to tell whether a room is empty, someone's sitting still, or there's real movement. I built a hybrid deep-learning model that engineers richer features from the raw readings and classifies activity level with strong accuracy, aimed at smarter occupancy-based building automation.",
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
    "overview": "Task trackers are easy to abandon because finishing a to-do doesn't feel like anything. Stat-Up turns daily tasks and Todoist completions into an anime RPG status window - points level up six stats, consistency raises your rank, and skipping days lets it decay - so the app rewards the habit, not just the checkbox, while staying fully offline and privacy-first.",
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
    "overview": "Breaking one requirement into a parent ticket, dev tasks, and test cases in Jira is repetitive busywork every sprint. This portal automates that: type a free-form requirement and an LLM fans it out into a linked Jira ticket tree - parent task, 3-5 dev tasks, and test-case sub-tasks for each - with fallbacks so a flaky AI call never blocks the workflow.",
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
    "overview": "Most voice assistants need the cloud and can't touch your desktop. This is a fully local, no-API-key voice assistant for Linux - speech in, a local LLM reasons about it, speech out - that can also safely act on your GNOME session (volume, brightness, apps, files) through a permissioned tool layer, so it stays useful offline and never sends what you say anywhere.",
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
    "overview": "Finding an updated tiffin or mess menu usually means texting the owner directly. MessMenu gives students a searchable directory of local messes with live menus and pricing, and gives owners a simple portal to keep their listing current - built as my first cross-platform mobile app with a cloud backend.",
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
    "overview": "macOS's Stage Manager makes window management effortless; GNOME had nothing like it. This extension recreates it - minimized windows collapse into a stack you can flip back to from a sidebar - while following GNOME's strict extension-review standards for lifecycle cleanup and multi-monitor support.",
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
    "overview": "Recognizing emotion from a single modality misses a lot of context - tone of voice says something text alone doesn't. This project classifies eight RAVDESS speech emotions by fusing an audio CNN with text models two different ways, and shows fusion substantially outperforms either signal alone.",
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
    "hidden": true,
    "tags": [
      "Salesforce",
      "Security",
      "Full Stack"
    ],
    "desc": "A Flask + React web tool that auto-remediates common Salesforce Apex security issues via regex-based FLS, CRUD, sharing, and debug fixes.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/SF_Security_Issue_Fixer",
    "private": false,
    "overview": "Common Apex security gaps - missing FLS/CRUD checks, no sharing declaration - are easy to miss in review and tedious to patch by hand. This tool takes pasted Apex, applies a set of targeted regex fixes for the most common issues, and hands back hardened code - a rules-based first pass, not a substitute for a real security review.",
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
    "hidden": true,
    "tags": [
      "Web",
      "Full Stack"
    ],
    "desc": "Full-stack platform to register shooters, enter 10-shot series scores, and auto-rank competitors with tie-break rules, medals, analytics and CSV export.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/shooting_competition",
    "private": false,
    "overview": "Running a shooting match on spreadsheets makes scoring, ranking, and tie-breaks error-prone. This platform digitizes the whole flow - register shooters, enter 10-shot series, and get ranked leaderboards with proper tie-break rules and medal assignment automatically, plus CSV export for official records.",
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
    "hidden": true,
    "tags": [
      "Salesforce",
      "LWC"
    ],
    "desc": "A Salesforce LWC app where employees apply for leaves and managers approve or reject them, with leave balances auto-tallied by an Apex trigger.",
    "link": null,
    "github": "https://github.com/itsDigvijaysing/Leave-Management-System-Salesforce",
    "private": false,
    "overview": "Leave requests and approvals in Salesforce usually mean back-and-forth emails and a spreadsheet tracking balances somewhere. This LWC app lets employees apply and track requests in one place, gives managers an approval queue, and keeps leave balances accurate automatically via an Apex trigger - a small internal tool built to learn LWC and Apex trigger patterns end to end.",
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
