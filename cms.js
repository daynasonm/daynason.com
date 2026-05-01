/*
  Edit this file to manage the portfolio.

  Quick workflow:
  1. Copy one project object.
  2. Give it a unique id, such as "my-new-project".
  3. Update title, cover, categories, detail.statement, board, and content.
  4. The project URL will be project.html?project=my-new-project.

  Media can be remote URLs or local paths, for example:
  "assets/bivalves/cover.jpg" or "assets/bivalves/process.mp4".
*/

window.PORTFOLIO_CMS = {
  categories: [
    "Website",
    "Print",
    "Branding",
    "Experiment",
  ],

  filterCounts: {
    Website: 3,
    Print: 6,
    Branding: 2,
    Experiment: 2,
  },

  projects: [

    {
      id: "alta",
      number: "01",
      title: "Alta",
      year: "2025",
      type: "Brand assets, Social content",
      categories: ["Branding", "Content Creation"],
      cover: {
        kind: "video",
        src: "https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-2952/1080p.mp4",
        poster: "https://picsum.photos/seed/alta77/1800/1013",
        alt: "Alta internship work",
      },
      detail: {
        domain: "alta.systems",
        sections: [["Brief", "DS-07"], ["Projects", "DS-10"], ["Executions", "DS-13"]],
        statement: 'Product and interface work for an AI fashion technology team, balancing utility with a lightweight <mark>visual system</mark>.',
        board: [
          { kind: "image", src: "https://picsum.photos/seed/alta77/1800/1013", title: "Product surface", cols: 5, rows: 2 },
          { kind: "video", src: "https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-2952/1080p.mp4", poster: "https://picsum.photos/seed/alta-video/1200/900", title: "Motion demo", cols: 4, rows: 2 },
          { kind: "color", color: "#ef604f", title: "UI state", cols: 3, rows: 1 },
          { kind: "color", color: "#a0d8cc", title: "Identity pass", cols: 4, rows: 1 },
        ],
        content: [
          { kind: "text", eyebrow: "Internship", title: "A flexible system for product work.", body: ["Add approved screenshots, role details, outcomes, and responsibilities here."] },
        ],
      },
    },

    {
      id: "bivalves",
      number: "02",
      title: "Bivalves",
      year: "2025",
      type: "Book Design",
      categories: ["Print", "Design", "Research"],
      cover: {
        kind: "image",
        src: "https://picsum.photos/seed/bivalves22/1800/1013",
        alt: "Bivalves book design",
      },
      detail: {
        domain: "bivalves.pub",
        sections: [
          ["Brief", "DS-01"],
          ["Concept", "DS-03"],
          ["Research", "DS-04"],
          ["Print", "DS-09"],
        ],
        hero: {
          kind: "placeholder",
          text: "image of the project\ngoes here (or video)",
          background: "#dea7a8",
        },
        statement: "1 sentence text explaining the project",
        board: [
          { kind: "image", src: "https://picsum.photos/seed/bivalves22/1800/1013", title: "Cover direction", cols: 4, rows: 2 },
          { kind: "color", color: "#9fd6c7", title: "Material study", cols: 3, rows: 1 },
          { kind: "color", color: "#edf227", title: "Archive note", cols: 2, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/bivalves-detail/1200/800", title: "Shell detail", cols: 3, rows: 2 },
          { kind: "text", color: "#ec6150", title: "Research index", text: "Specimen notes, fragments, and typographic pacing.", cols: 5, rows: 1 },
          { kind: "color", color: "#e445a9", title: "Binding test", cols: 3, rows: 1 },
          { kind: "color", color: "#6bd134", title: "Spread rhythm", cols: 4, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/bivalves-spread/1400/900", title: "Interior spread", cols: 5, rows: 2 },
          { kind: "color", color: "#39a7cf", title: "Final proof", cols: 3, rows: 1 },
        ],
        content: [
          {
            kind: "feature",
            title: "text explaining the project",
            body: [],
            items: [
              { kind: "image", src: "https://picsum.photos/seed/bivalves-process-a/1200/1400", alt: "Process image one", caption: "caption explaing" },
            ],
          },
        ],
      },
    },

    {
      id: "la-olympic-poster",
      number: "02",
      title: "LA Olympic Poster",
      year: "2025",
      type: "Print",
      categories: ["Print", "Design", "Campaign"],
      cover: { kind: "image", src: "https://picsum.photos/seed/olympic88/1800/1013", alt: "LA Olympic Poster" },
      detail: {
        domain: "la-olympic.info",
        sections: [["Brief", "DS-02"], ["Poster", "DS-05"], ["System", "DS-08"], ["Print", "DS-12"]],
        statement: 'A print system that turns schedule, movement, and city rhythm into a bold <mark>Olympic poster</mark> language.',
        board: [
          { kind: "image", src: "https://picsum.photos/seed/olympic88/1800/1013", title: "Poster crop", cols: 5, rows: 2 },
          { kind: "color", color: "#ef604f", title: "Event system", cols: 3, rows: 1 },
          { kind: "color", color: "#f6b14d", title: "Schedule", cols: 4, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/olympic-detail/1200/900", title: "Type scale", cols: 4, rows: 2 },
          { kind: "color", color: "#2fa8cf", title: "Print proof", cols: 4, rows: 1 },
          { kind: "color", color: "#8a61dc", title: "Color pass", cols: 4, rows: 1 },
        ],
        content: [
          { kind: "text", eyebrow: "Print", title: "A poster system for pace and hierarchy.", body: ["Replace this with your final copy, process notes, and credits."] },
        ],
      },
    },

    {
      id: "sansa",
      number: "03",
      title: "Sansa",
      year: "2025",
      type: "Book Design",
      categories: ["Print", "Design", "Research"],
      cover: { kind: "image", src: "https://picsum.photos/seed/sansa14/1800/1013", alt: "Sansa" },
      detail: {
        domain: "sansa.press",
        sections: [["Brief", "DS-03"], ["Editorial", "DS-06"], ["Research", "DS-07"], ["Binding", "DS-10"]],
        statement: 'An editorial study in pacing, restraint, and image sequencing for a tactile <mark>book design</mark> object.',
        board: [
          { kind: "image", src: "https://picsum.photos/seed/sansa14/1800/1013", title: "Cover image", cols: 4, rows: 2 },
          { kind: "color", color: "#36a7d1", title: "Pacing", cols: 3, rows: 1 },
          { kind: "color", color: "#a0d8cc", title: "Research", cols: 3, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/sansa-detail/1200/900", title: "Spread", cols: 5, rows: 2 },
          { kind: "color", color: "#ef604f", title: "Proof", cols: 4, rows: 1 },
        ],
        content: [
          { kind: "text", eyebrow: "Editorial", title: "A slower reading system.", body: ["Swap this placeholder for Sansa-specific writing, images, and video."] },
        ],
      },
    },

    {
      id: "yt-this-or-that",
      number: "04",
      title: "YT This or That",
      year: "2025",
      type: "Web App",
      categories: ["App", "Development", "Experiment", "Prototype"],
      cover: { kind: "image", src: "https://picsum.photos/seed/youtubetot7/1800/1013", alt: "YouTube This or That" },
      detail: {
        domain: "thisorthat.app",
        sections: [["Brief", "DS-04"], ["Prototype", "DS-08"], ["Tool", "DS-11"], ["App", "DS-14"]],
        statement: 'A playful decision tool that reframes video discovery as a quick, opinionated <mark>this-or-that</mark> interaction.',
        board: [
          { kind: "image", src: "https://picsum.photos/seed/youtubetot7/1800/1013", title: "Prototype", cols: 5, rows: 2 },
          { kind: "color", color: "#e748a8", title: "Choice state", cols: 3, rows: 1 },
          { kind: "color", color: "#39a9cf", title: "Interaction", cols: 4, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/youtube-flow/1200/900", title: "Flow", cols: 4, rows: 2 },
        ],
        content: [
          { kind: "text", eyebrow: "Prototype", title: "Fast choices, light friction.", body: ["Add screenshots, demo videos, and app notes here."] },
        ],
      },
    },

    {
      id: "theatres-in-nyc",
      number: "05",
      title: "Theatres in NYC",
      year: "2025",
      type: "Webflow",
      categories: ["Website", "Development", "Identity"],
      cover: { kind: "image", src: "https://picsum.photos/seed/theatres11/1800/1013", alt: "Theatres in NYC" },
      detail: {
        domain: "nyc-theatres.net",
        sections: [["Brief", "DS-05"], ["Identity", "DS-07"], ["Website", "DS-11"], ["Map", "DS-15"]],
        statement: 'A city-facing website that organizes theatre information through a quiet <mark>identity</mark> and location-first structure.',
        board: [
          { kind: "image", src: "https://picsum.photos/seed/theatres11/1800/1013", title: "Website view", cols: 5, rows: 2 },
          { kind: "color", color: "#a0d8cc", title: "Map system", cols: 3, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/theatre-map/1200/900", title: "Location layer", cols: 4, rows: 2 },
          { kind: "color", color: "#ef604f", title: "Identity", cols: 4, rows: 1 },
        ],
        content: [
          { kind: "text", eyebrow: "Website", title: "A structured archive for theatres.", body: ["Use this section for Webflow notes, sitemap, and screen captures."] },
        ],
      },
    },

    {
      id: "word-piano",
      number: "06",
      title: "Word Piano",
      year: "2024",
      type: "Web Tool",
      categories: ["Website", "Tool", "Development", "Experiment"],
      cover: { kind: "image", src: "https://picsum.photos/seed/wordpiano33/1800/1013", alt: "Word Piano" },
      detail: {
        domain: "word-piano.tool",
        sections: [["Brief", "DS-06"], ["Sound", "DS-08"], ["Tool", "DS-12"], ["Website", "DS-16"]],
        statement: 'A browser-based instrument that translates typed language into a strange, immediate <mark>word piano</mark> performance.',
        board: [
          { kind: "image", src: "https://picsum.photos/seed/wordpiano33/1800/1013", title: "Tool interface", cols: 5, rows: 2 },
          { kind: "color", color: "#f5ef23", title: "Keyboard", cols: 3, rows: 1 },
          { kind: "color", color: "#39a7cf", title: "Sound state", cols: 4, rows: 1 },
          { kind: "image", src: "https://picsum.photos/seed/wordpiano-ui/1200/900", title: "UI state", cols: 4, rows: 2 },
        ],
        content: [
          { kind: "text", eyebrow: "Tool", title: "Typed language as an instrument.", body: ["Add demo clips, interaction rules, and technical notes here."] },
        ],
      },
    },

    
  ],
};
