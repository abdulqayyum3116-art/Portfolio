import { channelVideos } from './channel-videos'

/**
 * Hand-curated YouTube videos & Shorts for the Learning Hub.
 *
 * To add one: copy an entry, paste the YouTube ID (the part after `v=` for
 * videos, or after `/shorts/` for Shorts) and set `kind` and `topic`.
 * Entries with `publishedAt` are sorted newest-first; entries without a date
 * keep the order they appear in this list (after dated ones).
 *
 * Long-form videos linked from Supabase blog posts (the `youtube` column) are
 * added automatically — no need to list them here.
 */

export type VideoKind = 'video' | 'short'

export type LearnVideo = {
  /** YouTube video ID, e.g. "dQw4w9WgXcQ" */
  id: string
  title: string
  kind: VideoKind
  /** Short topic label used for filter chips, e.g. "AEO / SEO", "Ads" */
  topic: string
  /** Optional ISO date, e.g. "2026-10-01" */
  publishedAt?: string
  durationSeconds?: number
  description?: string
}

/**
 * YouTube IDs that must never appear on the site (private/unlisted/removed),
 * even if a Supabase blog post links to them.
 */
export const hiddenVideoIds = new Set<string>([
  'mhvPJDXl5zs', // "Your SaaS Is Being Recommended by AI…" (private)
])

export const videos: LearnVideo[] = [
  ...channelVideos,
  // ── Shorts (imported from shahzaib-hamid-shorts.csv, channel order) ──
  { id: "DdyLHoHYd3M", kind: 'short', topic: "AI Automation", title: "AI Won't Replace Everyone, But It Will Change How We Work" },
  { id: "PiBsNJiodIk", kind: 'short', topic: "AI Automation", title: "Is AI Going to Take Your Job? The Future of Work" },
  { id: "1Ri7DJ9tsyk", kind: 'short', topic: "Reviews & Trust", title: "Is AI Content Losing People's Trust?" },
  { id: "hhZLhDHUOQ4", kind: 'short', topic: "AI Automation", title: "The Truth About AI Replacing Medical Professionals" },
  { id: "3RXJbD2Aacs", kind: 'short', topic: "Reviews & Trust", title: "Why Customer Reviews Matter More Than Advertising" },
  { id: "jI_a60KPMKA", kind: 'short', topic: "Reviews & Trust", title: "How to Build Trust and Attract More Clients" },
  { id: "yygEVNIqnVc", kind: 'short', topic: "AI Automation", title: "How We Automate Video Editing & Marketing With AI 🚀" },
  { id: "3Esbiny5tqY", kind: 'short', topic: "AI Automation", title: "Will AI Really Take Away All Our Jobs? The Future of Work" },
  { id: "_iXO71x1gDY", kind: 'short', topic: "AI Automation", title: "Why Human Connection Still Matters in AI Marketing 🤝" },
  { id: "gcXbF-zCffg", kind: 'short', topic: "AEO / SEO", title: "How AEO Is Changing the Future of Online Search 🤖" },
  { id: "Tu-EftZi1IQ", kind: 'short', topic: "AI Automation", title: "How AI Helps Small Teams Do BIG Things 🚀" },
  { id: "zuCSIGBpDXQ", kind: 'short', topic: "AI Automation", title: "How We Use AI Agents to Automate Clinic Marketing 🚀" },
  { id: "iTVAmx1IsVs", kind: 'short', topic: "Website & Conversion", title: "Your Website Is Losing You Patients! Here's Why 🚨" },
  { id: "xmGOuf8ubV0", kind: 'short', topic: "AI Automation", title: "How We Solved Their Biggest Business Bottleneck with AI Automation 🚀" },
  { id: "vS4AnDv2XyY", kind: 'short', topic: "Ads", title: "One AI Dashboard to Track All Your Ads? 🚀" },
  { id: "5l_oqlOeXRs", kind: 'short', topic: "Reviews & Trust", title: "Do Google Reviews Really Matter for Med Spas? ⭐" },
  { id: "kEN7Tx1Aw8M", kind: 'short', topic: "Leads & Booking", title: "How Instantly Helped Boost Their Cold Email Campaigns 🚀" },
  { id: "4Z8j9QPPNTw", kind: 'short', topic: "AEO / SEO", title: "Can ChatGPT Really Bring Patients to Med Spas? 🤖" },
  { id: "Zt1yESePbkU", kind: 'short', topic: "Ads", title: "Google Ads vs Social Media: What's Best for Med Spas? 🚀" },
  { id: "iLHDO5mbwZ0", kind: 'short', topic: "Leads & Booking", title: "Why Med Spas Lose Leads (And How to Fix It!) 🚀" },
  { id: "IvRIoH31QZg", kind: 'short', topic: "AI Automation", title: "How Automation Is Changing Digital Marketing 🚀" },
  { id: "BNh7MgOb8vc", kind: 'short', topic: "Ads", title: "Social Media vs Google Ads: What Should Doctors Choose? 🩺📈" },
  { id: "lj-UotnNKpw", kind: 'short', topic: "Ads", title: "How to Get More Clinic Leads With Google Ads! 🎯📈" },
  { id: "SFFyxn4z-84", kind: 'short', topic: "Social Media", title: "5 Types of Videos That Attract More Patients to Your Clinic! 🩺📈" },
  { id: "-Qf3gdcLx5E", kind: 'short', topic: "Social Media", title: "How Doctors Can Find Viral Content Ideas From Competitors! 📈" },
  { id: "_AvKVX2Gd0M", kind: 'short', topic: "Social Media", title: "5 Social Media Content Rules Every Doctor Must Follow! 🎯" },
  { id: "O5TVpHG5hGM", kind: 'short', topic: "Clinic Growth", title: "Which Clinic Do Patients Pick?" },
  { id: "w-9zJtDH6O0", kind: 'short', topic: "Website & Conversion", title: "Bad vs Good Clinic Website: Stock Model or Your Face?" },
  { id: "xRHexy35ggc", kind: 'short', topic: "Clinic Growth", title: "Your Face, Not Your Logo: What Patients Want to See First" },
  { id: "arko0y5svKo", kind: 'short', topic: "Leads & Booking", title: "Why “Book Now!” Posts Make Your Clinic Look Desperate" },
  { id: "nQQc4aYQPec", kind: 'short', topic: "Social Media", title: "The #1 Instagram Mistake Clinics Make (Post This Instead)" },
  { id: "79xVsq6j6ko", kind: 'short', topic: "Social Media", title: "The 3 Reels Every Clinic Should Pin on Instagram" },
  { id: "GeVq4wR5G-A", kind: 'short', topic: "AEO / SEO", title: "Patients Google You Before They Book (and Ask ChatGPT)" },
  { id: "4Z4-SVWZlBA", kind: 'short', topic: "Ads", title: "3 High-Converting Ads for Aesthetic Clinics 🎯" },
  { id: "p8zfssM1VSo", kind: 'short', topic: "AEO / SEO", title: "Your Google Business Profile Could Be Losing You Patients! 🚨" },
  { id: "S1kVFclQOCQ", kind: 'short', topic: "Social Media", title: "3 Social Media Posts Every Med Spa Should Create 🎯" },
  { id: "IZMADEUcAUk", kind: 'short', topic: "Social Media", title: "3 Social Media Mistakes Med Spas Must Avoid 🚫" },
  { id: "BDYNHervMZI", kind: 'short', topic: "Leads & Booking", title: "Stop Losing Patients! Respond to Leads Faster 🚀" },
  { id: "1nZJLA750xs", kind: 'short', topic: "Leads & Booking", title: "The FCB System: Get Found, Chosen & Booked 🚀" },
  { id: "WyQX1L1R4xc", kind: 'short', topic: "Clinic Growth", title: "How We Grew a Florida Clinic From 12 to 40 Potential Patients a Month" },
  { id: "Hf1EZ2SZnwE", kind: 'short', topic: "AEO / SEO", title: "4 Tips to Get Your Clinic Found on ChatGPT" },
  { id: "r-I1_ow9Yfg", kind: 'short', topic: "Website & Conversion", title: "Good vs Bad Landing Pages 🚀 How MedSpas Get More Patients" },
  { id: "uXnCJWDiZFc", kind: 'short', topic: "AEO / SEO", title: "4 SEO Tips to Get More Website Traffic 🚀 | Med Spa SEO" },
  { id: "A8QcjZy7AaQ", kind: 'short', topic: "AEO / SEO", title: "Is ChatGPT Sending Patients to Your Competitors? 🤖" },
  { id: "Dmp5j99MaWU", kind: 'short', topic: "AEO / SEO", title: "Medspa Owners: Are You Invisible on Google? Fix It With ONE Page" },
  { id: "AGGXkRG3Ohc", kind: 'short', topic: "Clinic Growth", title: "3 Things Every Med Spa Needs to Grow 📈" },
  { id: "YYHMvkV_1HU", kind: 'short', topic: "AEO / SEO", title: "This ChatGPT Prompt Writes Your Med Spa Service Page 🤖" },
  { id: "jd7k4hRpPFk", kind: 'short', topic: "Website & Conversion", title: "Write Copy That Makes Patients Say \"That's Me!\" ✍️" },
  { id: "Uqe0MQhOHsw", kind: 'short', topic: "AEO / SEO", title: "Why SEO Alone Doesn’t Get MedSpa Patients 💉📈" },
  { id: "fgMT28UxVc4", kind: 'short', topic: "AEO / SEO", title: "The 4-Step Playbook to Get Named by ChatGPT" },
  { id: "FHKOVWb6IK4", kind: 'short', topic: "AEO / SEO", title: "How ChatGPT Decides Which MedSpa to Recommend 🤖" },
  { id: "nUDlX22v3bU", kind: 'short', topic: "Leads & Booking", title: "What Does a New Patient REALLY Cost? 💰" },
  { id: "kxf2A3h2ztY", kind: 'short', topic: "Website & Conversion", title: "Patients Don't Want Your Lead Form" },
  { id: "e194vHYBkbA", kind: 'short', topic: "AI Automation", title: "The RIGHT order to use AI in your business (most SMEs get this wrong) 🚀" },
  { id: "nA3o1z15pMI", kind: 'short', topic: "Leads & Booking", title: "Build a LinkedIn Email Scraper with AI" },
  { id: "o38EYeokah4", kind: 'short', topic: "AI Automation", title: "Build Your Own AI GTM System with Claude Code" },
  { id: "-2bDiO3Z6NE", kind: 'short', topic: "Leads & Booking", title: "Generate High-Quality Leads at Low Cost | Smart Email Outreach Strategy" },
  { id: "UgiSS7EagVU", kind: 'short', topic: "AI Automation", title: "Understanding Multi-Agent Systems in AI" },
  { id: "RjgSrZOjFDo", kind: 'short', topic: "AI Automation", title: "OpenAI's New Features – A Game-Changer!" },
  { id: "WnpPqaAUJK8", kind: 'short', topic: "AI Automation", title: "Manus AI: The Game-Changing AI Agent is Here!" },
  { id: "abMyE7fgpMU", kind: 'short', topic: "AI Automation", title: "AI Answers My Salon Calls & Saves Me Money!" },
  { id: "i9_LULBcsVk", kind: 'short', topic: "AI Automation", title: "Two AI agents on a phone call realize they’re both AI and switch to a superior audio signal wave" },
  { id: "6kGzm01AfEI", kind: 'short', topic: "AI Automation", title: "Work Smart, Not Just Hard: Boost Productivity with Automation Tools" },
  { id: "AmrY7NOxZao", kind: 'short', topic: "Clinic Growth", title: "Remote patient monitoring system" },
]
