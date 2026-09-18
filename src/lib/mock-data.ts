import type {
  Session,
  SessionCategory,
  CategoryHighlight,
} from "@/types/session";

export interface Faq {
  question: string;
  answer: string;
}

export interface ValueHighlight {
  emoji: string;
  title: string;
  body: string;
}

export const SESSIONS: Session[] = [
  {
    id: "react-fundamentals-bootcamp",
    title: "React Fundamentals Bootcamp",
    category: "Development",
    date: "Oct 5, 2026",
    time: "9:00 AM–1:00 PM",
    location: "Tech Hub Barcelona",
    spotsLeft: 9,
    imageUrl: "https://picsum.photos/seed/react-bootcamp/800/600",
  },
  {
    id: "data-science-with-python",
    title: "Data Science with Python",
    category: "Data",
    date: "Oct 12, 2026",
    time: "10:00 AM–2:00 PM",
    location: "Campus Nord UPC",
    spotsLeft: 7,
    imageUrl: "https://picsum.photos/seed/data-science/800/600",
  },
  {
    id: "ux-design-sprint",
    title: "UX Design Sprint",
    category: "Design",
    date: "Oct 19, 2026",
    time: "9:30 AM–5:30 PM",
    location: "Disseny Hub Barcelona",
    spotsLeft: 0,
    imageUrl: "https://picsum.photos/seed/ux-sprint/800/600",
  },
  {
    id: "public-speaking-mastery",
    title: "Public Speaking Mastery",
    category: "Soft Skills",
    date: "Nov 2, 2026",
    time: "6:00 PM–8:00 PM",
    location: "CoWork Eixample",
    spotsLeft: 6,
    imageUrl: "https://picsum.photos/seed/public-speaking/800/600",
  },
  {
    id: "machine-learning-foundations",
    title: "Machine Learning Foundations",
    category: "Data",
    date: "Nov 9, 2026",
    time: "10:00 AM–4:00 PM",
    location: "Barcelona Supercomputing Center",
    spotsLeft: 28,
    imageUrl: "https://picsum.photos/seed/ml-foundations/800/600",
  },
  {
    id: "leadership-team-dynamics",
    title: "Leadership & Team Dynamics",
    category: "Leadership",
    date: "Dec 7, 2026",
    time: "9:00 AM–1:00 PM",
    location: "IESE Business School",
    spotsLeft: 19,
    imageUrl: "https://picsum.photos/seed/leadership/800/600",
  },
];

export const FEATURED_SESSIONS: Session[] = SESSIONS.slice(0, 3);

export const CATEGORY_HIGHLIGHTS: CategoryHighlight[] = [
  { category: "Development", count: 1 },
  { category: "Design", count: 1 },
  { category: "Data", count: 2 },
  { category: "Leadership", count: 1 },
];

export const CATEGORY_FILTERS: SessionCategory[] = [
  "Development",
  "Design",
  "Data",
  "Soft Skills",
  "Leadership",
];

export const VALUES: ValueHighlight[] = [
  {
    emoji: "🎯",
    title: "Practical first",
    body: "Every session on Sessio is built around doing, not watching. Participants leave with real skills and working artefacts.",
  },
  {
    emoji: "🤝",
    title: "Community led",
    body: "Sessions are run by people who work in the field — engineers, designers, researchers, and leaders sharing what they know.",
  },
  {
    emoji: "🔓",
    title: "Open access",
    body: "Professional development should not cost a fortune. All sessions on Sessio are free to attend and open to everyone.",
  },
];

export const FAQS: Faq[] = [
  {
    question: "How do I register for a session?",
    answer:
      "Create a free Sessio account, browse the sessions catalogue, and click Register on any session with open spots. You will receive a confirmation immediately.",
  },
  {
    question: "Can I cancel my registration?",
    answer:
      "Yes. Open My Events from your account menu and click Unregister next to the session you want to cancel.",
  },
  {
    question: "How do I become a session organiser?",
    answer:
      "Request an organiser account by emailing organisers@sessio.com. Include a short description of the sessions you plan to run and your area of expertise.",
  },
  {
    question: "Do sessions have prerequisites?",
    answer:
      "Each session description lists the expected level. Most sessions are designed to be accessible — look for the instructor note at the bottom of each detail page.",
  },
];
