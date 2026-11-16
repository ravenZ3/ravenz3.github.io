// Projects shown on the home page and /projects.
// `result` is the one line an interviewer should remember: a measured or concrete outcome.

export interface Project {
  slug: string;
  name: string;
  summary: string;
  result: string;
  details: string[];
  stack: string[];
  repo?: string;
  live?: string;
  visual?: 'bench' | 'before-after' | 'screenshot' | 'compare';
  images?: { src: string; alt: string }[];
  caption?: string;
}

export const featured: Project[] = [
  {
    slug: 'agentic-rag-eval-harness',
    name: 'Agentic RAG eval harness',
    summary:
      'Evaluation and CI regression gate for a LangGraph retrieval agent. It scores the final answer, the path the agent took to get there, and runs a cross-provider LLM judge.',
    result:
      'Catches failures answer-only evaluation misses: a one-shotted multi-hop question passes RAGAS at 0.81 faithfulness but scores 0.0 on planning.',
    details: [
      'Trajectory scorer for planning, tool choice, retrieval recall, and step efficiency against a golden dataset.',
      'Judge runs on a different model family than the agent to avoid self-preference; unparseable output fails hard.',
      'Results tracked in W&B; a GitHub Actions gate blocks pull requests that regress.',
    ],
    stack: ['Python', 'LangGraph', 'RAGAS', 'FastAPI', 'W&B', 'GitHub Actions'],
    repo: 'https://github.com/ravenZ3/agentic-rag-eval-harness',
    visual: 'compare',
  },
  {
    slug: 'pixel-flow',
    name: 'Pixel Flow',
    summary:
      'A node-based image editor that runs in the browser. You describe a look in plain words and an LLM agent builds the editing pipeline as a graph you can inspect and rerun.',
    result:
      'Edits are deterministic graphs, not diffusion output: the same recipe gives the same result on every image, and a whole pipeline shares as one URL.',
    details: [
      'The agent works through three tools (list node types, read graph, apply patch) and changes the graph atomically.',
      'Nodes for cinematic grading: per-channel curves, split toning, vignette, seeded film grain, gradient maps.',
      'Gemini calls go through a server-side proxy, so the API key never reaches the browser.',
    ],
    stack: ['TypeScript', 'Next.js', 'React Flow', 'Zustand', 'Gemini'],
    repo: 'https://github.com/ravenZ3/pixel-flow',
    visual: 'before-after',
  },
  {
    slug: 'rediscpp',
    name: 'redisCpp',
    summary:
      'A Redis-compatible server written from scratch in C++23. It speaks RESP2, so redis-cli and redis-benchmark work against it unchanged.',
    result:
      'With 1,000 idle connections open, the epoll build holds 11.6k req/s while the select() build falls to 1.8k.',
    details: [
      'Single-threaded, non-blocking event loop: commands are atomic without locks.',
      'Blocking BLPOP with FIFO waiters, timeouts that set the loop’s sleep, PX expiry, and streams.',
      'Same command code compiled against epoll and select(), so the benchmark measures only the multiplexer.',
      'GoogleTest unit tests plus end-to-end tests that check exact reply bytes, including malformed input.',
    ],
    stack: ['C++23', 'epoll', 'CMake', 'GoogleTest'],
    repo: 'https://github.com/ravenZ3/redisCpp',
    visual: 'bench',
  },
  {
    slug: 'repsheet',
    name: 'RepSheet',
    summary:
      'Spaced repetition for competitive programming. It tracks the problems you solve on LeetCode and Codeforces and tells you which ones to re-solve today, before you forget the trick.',
    result:
      'A browser extension spots the "Accepted" verdict on LeetCode or Codeforces and lets you rate the problem on the spot, using the login you already have on the site.',
    details: [
      'Reviews are scheduled with FSRS, which models how likely you are to remember each problem and when that memory fades.',
      'One-click sync pulls solved problems from both platforms, skipping any already tracked.',
      'Extension login without a second sign-in: the background worker reads the site’s session cookie and sends it as a header the API decodes. Works in Chrome and Firefox.',
      'Per-site DOM logic is kept in small adapters, so a LeetCode redesign breaks one file.',
      'A patterns view maps your solved problems onto a catalog of interview patterns and shows which ones are due.',
      'Login endpoints are rate limited, since every bcrypt check is expensive. Core logic is unit tested with Vitest.',
    ],
    stack: ['TypeScript', 'Next.js', 'Prisma', 'MongoDB', 'NextAuth', 'WebExtensions', 'Vitest'],
    repo: 'https://github.com/ravenZ3/repsheet',
    live: 'https://repsheet.vercel.app',
    visual: 'screenshot',
    images: [
      {
        src: '/images/projects/repsheet-graph.jpg',
        alt: 'Patterns graph: a central DSA node branching into techniques like Two Pointers, Trees, Strings, and Dynamic Programming, each with solved problems as colored circles',
      },
      {
        src: '/images/projects/repsheet-review.jpg',
        alt: 'Review queue: 7 due today and a backlog of 16, with problem cards showing memory strength and 1 to 4 rating buttons',
      },
    ],
    caption: 'Left: every solved problem placed under its technique. Right: today’s review queue, rated 1 to 4.',
  },
  {
    slug: 'drop',
    name: 'drop',
    summary:
      'Browser-to-browser file transfer. No upload, no login, and no server ever sees the file.',
    result:
      'File bytes go straight between browsers over a WebRTC data channel. The server only relays a 1 to 2 KB handshake, stored with a 10-minute TTL.',
    details: [
      'Short word codes (fox-green-apple) pair the two browsers.',
      'Signaling in a key-value store instead of a database, since the data is tiny and useless after connect.',
    ],
    stack: ['TypeScript', 'Next.js', 'WebRTC', 'Upstash Redis'],
    repo: 'https://github.com/ravenZ3/drop-p2p',
    live: 'https://drop-p2p.vercel.app',
  },
];

export const more: Pick<Project, 'name' | 'summary' | 'stack' | 'repo'>[] = [
  {
    name: 'Battery health PINN',
    summary: 'Physics-informed neural network predicting battery state of health on the MIT battery dataset, compared against MLP and CNN baselines.',
    stack: ['Python', 'PyTorch'],
    repo: 'https://github.com/ravenZ3/battery-modelling-PINN',
  },
  {
    name: 'Solar water tank monitor',
    summary: 'Two ESP8266 nodes on solar power: one measures tank level ultrasonically and publishes over MQTT, the other drives the pump relay.',
    stack: ['C++', 'ESP8266', 'MQTT'],
    repo: 'https://github.com/ravenZ3/esp32-water-tank-monitor',
  },
];

// redisCpp benchmark, one active client, median of 3 runs (from the repo README).
export const bench = [
  { idle: 0,    epoll: 10811, select: 11701 },
  { idle: 250,  epoll: 11221, select: 8173 },
  { idle: 500,  epoll: 11682, select: 4548 },
  { idle: 1000, epoll: 11628, select: 1787 },
];

// Agentic RAG eval harness: cases answer-only scoring passes but the trajectory scorer fails (from the repo README).
export const compare = [
  { what: 'Agent one-shotted a multi-hop question', ragas: 'faithfulness 0.81', traj: 'planning 0.0' },
  { what: 'Retrieved the wrong context, answered plausibly', ragas: 'faithfulness 0.79', traj: 'retrieval 0.33' },
  { what: 'Answered an unanswerable question confidently', ragas: 'relevancy 0.88', traj: 'judge flags hallucination' },
];
