/* The one file to edit first. Every page reads it: the site bar (pages), the Overview tiles,
   and the status facts. Keeping facts here (not typed into pages) is what stops pages from drifting apart. */
window.HUB = {
  name: "Portfolio design",
  mark: "AK",
  languages: ["en"],
  labels: { en: "EN" },
  pages: [
    { file: "index.html", title: { en: "Overview" }, desc: { en: "Start here: what's live, the numbers, where to look" },
      tips: { en: ["The tiles count what's on the live site today.", "Every card opens the real page or file."] } },
    { file: "plan.html", title: { en: "Plan" }, desc: { en: "Decisions waiting on Allen, where each area stands, the design log" },
      tips: { en: ["Decisions come first: each one unblocks a ticket on the Project page."] } },
    { file: "project.html", title: { en: "Project" }, desc: { en: "Every page and case, whether it's live, and the tickets" },
      tips: { en: ["The last two audit columns say whether it's live and where to see it.", "Tickets are numbered T1, T2… there are no GitHub issues yet."] } },
  ],
  // Status facts. Update these first; pages fill in [data-fact="path.to.value"] and read them in scripts.
  facts: {
    updated: { en: "Oct 18, 2026" },
    repo: "https://github.com/mooque-dev/portfolio-2026",
    live: "https://mooque-dev.github.io/",
    oldSite: "https://allenkang.com/",
    branch: "v2",
    counts: { cases: 22, work: 8, demos: 4, liveApps: 6, tailored: 3, resumes: 3, changelog: 96 },
    // The github.io copy is what Allen sends; it's built from the v2 branch.
    site: { live: "Oct 13", commit: "e7572b3", pagesCommit: "6387a1a", pending: "" },
    // allenkang.com still serves main, which stopped on Oct 8.
    old: { last: "Oct 8", commit: "1ba4c01" },
  },
};
