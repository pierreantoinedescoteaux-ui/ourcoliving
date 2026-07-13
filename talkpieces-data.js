/* =====================================================================
   TALK PIECES — content layer for the writing room (talkpieces.html).
   One entry per piece. status: "live" (href required) | "upcoming".
   NOTE: the room name "Talk pieces" is P-A's floated name — if he picks
   another, change it in talkpieces.html + site-nav.js only.
   ===================================================================== */
const TALKPIECES = {
  eyebrow: "The writing room",
  title: "Talk pieces.",
  lede: "Not a blog — position pieces. Each one takes an idea this site keeps gesturing at and argues it properly: where it comes from, why it matters, what to do with it. Slow writing, updated when my thinking moves. [edit]",
  pieces: [
    {
      slug: "separation",
      status: "live",
      href: "separation.html",
      kicker: "Piece 01 · Philosophy",
      title: "The story we were handed, and the story underneath.",
      dek: "Ten assumptions about housing, family and ownership we inherited without asking — read through Charles Eisenstein's Story of Separation, and flipped one by one.",
      meta: "A long read · ten movements · the backbone of the manifesto"
    },
    {
      slug: "four-emergencies",
      status: "upcoming",
      kicker: "Piece 02 · The case",
      title: "Four slow emergencies, one root.",
      dek: "Loneliness, care, housing cost, meaning at work — the numbers behind each crisis, and why they are the same story told four ways.",
      meta: "In the workshop — the research is done, the argument is being rebuilt"
    }
  ],
  young: "This room is young — pieces arrive slowly, on purpose. Want to argue with one? That's the point."
};
