/* =====================================================================
   TALK PIECES — content layer for the writing room (talkpieces.html).
   One entry per piece. status: "live" (href required) | "upcoming".
   NOTE: the room name "Talk pieces" is P-A's floated name — if he picks
   another, change it in talkpieces.html + site-nav.js only.
   ===================================================================== */
const TALKPIECES = {
  eyebrow: "The writing room",
  title: "Talk pieces.",
  lede: "Not a blog — position pieces. Each one takes an idea this site keeps gesturing at and explores it properly: where it comes from, why it matters, what it could open up. Slow writing, updated when my thinking moves. [edit]",
  pieces: [
    {
      slug: "separation",
      status: "live",
      href: "separation.html",
      img: "images/solarpunk-feast.jpg",
      kicker: "Piece 01 · Philosophy",
      title: "The story we were handed, and the story underneath.",
      dek: "Ten assumptions about housing, family and ownership we inherited without asking — read through Charles Eisenstein's Story of Separation, and flipped one by one.",
      meta: "A long read · ten movements · the backbone of the manifesto"
    },
    {
      slug: "four-emergencies",
      status: "upcoming",
      img: "images/solarpunk-solar.jpg",
      kicker: "Piece 02 · The case",
      title: "Four slow emergencies, one root.",
      dek: "Loneliness, care, housing cost, meaning at work — the numbers behind each crisis, and why they are the same story told four ways.",
      meta: "In the workshop — the research is done, the argument is being rebuilt"
    },
    {
      slug: "coliving-journey",
      status: "upcoming",
      img: "images/dunbar-exterior.jpg",
      kicker: "Piece 03 · Personal",
      title: "What brought me here in the first place.",
      dek: "Every experience of living together I've had, end to end — from the first shared house to the dream of a village — and what each one taught me. The piece behind the story.",
      meta: "In the workshop — source notes gathered, waiting for a proper telling"
    }
  ],
  young: "This room is young — pieces arrive slowly, on purpose. If one sparks a thought, write me: these are invitations, not verdicts."
};
