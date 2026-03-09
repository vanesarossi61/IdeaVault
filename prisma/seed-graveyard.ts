import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeadStartupSeed = {
  name: string;
  slug: string;
  batch: string;
  batchLabel: string;
  status: "INACTIVE" | "ACQUIRED" | "PIVOTED" | "UNKNOWN";
  category: string | null;
  categories: string[];
  description: string | null;
  founders: string | null;
  funding: string | null;
  shutdownYear: number | null;
  successor: string | null;
  successorUrl: string | null;
  sourceUrl: string;
};

const deadStartups: DeadStartupSeed[] = [
  // ===== S05 (Summer 2005) =====
  {
    name: "Loopt",
    slug: "loopt",
    batch: "S05",
    batchLabel: "Summer 2005",
    status: "ACQUIRED",
    category: "Social",
    categories: ["Social", "Location", "Mobile"],
    description: "Location-based social-mapping service backed by Sequoia Capital and NEA.",
    founders: "Sam Altman",
    funding: null,
    shutdownYear: 2012,
    successor: "Snap Maps",
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/loopt",
  },

  // ===== W07 (Winter 2007) =====
  {
    name: "Heysan",
    slug: "heysan",
    batch: "W07",
    batchLabel: "Winter 2007",
    status: "ACQUIRED",
    category: "Community",
    categories: ["Community", "Messaging", "Mobile"],
    description: "Free messaging on mobile phones.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/heysan",
  },
  {
    name: "Auctomatic",
    slug: "auctomatic",
    batch: "W07",
    batchLabel: "Winter 2007",
    status: "ACQUIRED",
    category: "E-Commerce",
    categories: ["E-Commerce", "SaaS"],
    description: "E-commerce management platform.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/auctomatic",
  },

  // ===== S07 (Summer 2007) =====
  {
    name: "Anywhere.FM",
    slug: "anywhere-fm",
    batch: "S07",
    batchLabel: "Summer 2007",
    status: "UNKNOWN",
    category: "Music",
    categories: ["Music", "Streaming"],
    description: "Music streaming platform.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/anywhere-fm",
  },

  // ===== S08 (Summer 2008) =====
  {
    name: "Posterous",
    slug: "posterous",
    batch: "S08",
    batchLabel: "Summer 2008",
    status: "ACQUIRED",
    category: "Email",
    categories: ["Email", "Blogging", "Social Media"],
    description: "Dead simple blogs by email. Acquired by Twitter in 2012, shut down 2013.",
    founders: "Sachin Agarwal, Garry Tan, Brett Gibson",
    funding: "$10.14M",
    shutdownYear: 2013,
    successor: "Substack",
    successorUrl: "https://substack.com",
    sourceUrl: "https://startups.rip/company/posterous",
  },

  // ===== S09 (Summer 2009) =====
  {
    name: "Bump",
    slug: "bump",
    batch: "S09",
    batchLabel: "Summer 2009",
    status: "ACQUIRED",
    category: "Mobile",
    categories: ["Mobile", "Social"],
    description: "Bump, Flock, Photoroll (unreleased) => Google Photos.",
    founders: null,
    funding: null,
    shutdownYear: 2014,
    successor: "Google Photos",
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/bump",
  },
  {
    name: "CarWoo",
    slug: "carwoo",
    batch: "S09",
    batchLabel: "Summer 2009",
    status: "UNKNOWN",
    category: "Automotive",
    categories: ["Automotive", "Marketplace"],
    description: "Car buying platform.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/carwoo",
  },

  // ===== W10 (Winter 2010) =====
  {
    name: "Optimizely",
    slug: "optimizely",
    batch: "W10",
    batchLabel: "Winter 2010",
    status: "ACQUIRED",
    category: "Marketing",
    categories: ["Marketing", "SaaS", "Analytics"],
    description: "The first all-in-one operating system for marketing.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/optimizely",
  },
  {
    name: "Creative Market",
    slug: "creative-market",
    batch: "W10",
    batchLabel: "Winter 2010",
    status: "ACQUIRED",
    category: "Marketplace",
    categories: ["Marketplace", "Design"],
    description: "Marketplace for graphic design assets.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/creative-market",
  },
  {
    name: "Answerly",
    slug: "answerly",
    batch: "W10",
    batchLabel: "Winter 2010",
    status: "UNKNOWN",
    category: null,
    categories: [],
    description: null,
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/answerly",
  },

  // ===== S10 (Summer 2010) =====
  {
    name: "FutureAdvisor",
    slug: "futureadvisor",
    batch: "S10",
    batchLabel: "Summer 2010",
    status: "ACQUIRED",
    category: "Fintech",
    categories: ["Fintech", "Wealth Management"],
    description: "The online financial management service for everyone.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/futureadvisor",
  },
  {
    name: "Teevox",
    slug: "teevox",
    batch: "S10",
    batchLabel: "Summer 2010",
    status: "UNKNOWN",
    category: "AI-powered Drug Discovery",
    categories: ["AI", "Drug Discovery", "Biotech"],
    description: null,
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/teevox",
  },

  // ===== W11 (Winter 2011) =====
  {
    name: "Pebble",
    slug: "pebble",
    batch: "W11",
    batchLabel: "Winter 2011",
    status: "INACTIVE",
    category: "Productivity",
    categories: ["Productivity", "Hardware", "Wearables"],
    description: "Smartwatch company, pioneer of the wearable tech category.",
    founders: null,
    funding: null,
    shutdownYear: 2016,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/pebble",
  },
  {
    name: "Tutorspree",
    slug: "tutorspree",
    batch: "W11",
    batchLabel: "Winter 2011",
    status: "INACTIVE",
    category: "Education",
    categories: ["Education", "Marketplace"],
    description: "Online tutoring marketplace.",
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/tutorspree",
  },

  // ===== S11 (Summer 2011) =====
  {
    name: "Parse",
    slug: "parse",
    batch: "S11",
    batchLabel: "Summer 2011",
    status: "ACQUIRED",
    category: "Developer Tools",
    categories: ["Developer Tools", "BaaS", "Mobile"],
    description: "Mobile backend-as-a-service. Acquired by Facebook, then shut down.",
    founders: null,
    funding: null,
    shutdownYear: 2017,
    successor: "Supabase",
    successorUrl: "https://supabase.com",
    sourceUrl: "https://startups.rip/company/parse",
  },
  {
    name: "Aisle50",
    slug: "aisle50",
    batch: "S11",
    batchLabel: "Summer 2011",
    status: "UNKNOWN",
    category: "Grocery",
    categories: ["Grocery", "Marketplace"],
    description: null,
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/aisle50",
  },
  {
    name: "Zigfu",
    slug: "zigfu",
    batch: "S11",
    batchLabel: "Summer 2011",
    status: "UNKNOWN",
    category: "Augmented Reality",
    categories: ["Augmented Reality", "Developer Tools"],
    description: null,
    founders: null,
    funding: null,
    shutdownYear: null,
    successor: null,
    successorUrl: null,
    sourceUrl: "https://startups.rip/company/zigfu",
  },
  // ===== W12 (Winter 2012) — 24 companies =====
  { name: "99dresses", slug: "99dresses", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Fashion", categories: ["Fashion", "Marketplace", "Women's Health"], description: "Creating every woman's fantasy by combining the unwanted items in everyone's closets.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/99dresses" },
  { name: "Ark", slug: "ark", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Media", categories: ["Media", "Social"], description: "Organizes the world's social information.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/ark" },
  { name: "BarSense", slug: "barsense", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Kids", categories: ["Kids", "Mobile"], description: "Kid's first smartphone with web-based parental controls.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/barsense" },
  { name: "BookSolid", slug: "booksolid", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Marketplace", categories: ["Marketplace", "Travel"], description: "The OpenTable for tour operators.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/booksolid" },
  { name: "Brace", slug: "brace", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "No-code", categories: ["No-code", "Developer Tools"], description: "Backlift allows front-end only developers to build entire websites.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/brace" },
  { name: "Carsabi", slug: "carsabi", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Automotive", categories: ["Automotive", "Search"], description: "The search engine for used cars.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/carsabi" },
  { name: "Couple", slug: "couple", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Messaging", categories: ["Messaging", "Social"], description: "App that connects two phones and creates a private timeline.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/couple" },
  { name: "Documents.Me", slug: "documents-me", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Security", categories: ["Security", "Privacy", "Cloud"], description: "Client-side encryption for your devices and the cloud.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/documents-me" },
  { name: "GiveSpark", slug: "givespark", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Nonprofit", categories: ["Nonprofit", "Fundraising"], description: "Celebrity charity fundraising platform.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/givespark" },
  { name: "Grouper", slug: "grouper", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Dating", categories: ["Dating", "Social"], description: "Set up drinks between 2 groups of friends: 3 guys and 3 girls.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/grouper" },
  { name: "Hipmob", slug: "hipmob", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Customer Service", categories: ["Customer Service", "Developer Tools", "Mobile"], description: "Customer communication for iOS and Android developers.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/hipmob" },
  { name: "LendUp", slug: "lendup", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Fintech", categories: ["Fintech", "Lending"], description: "Socially responsible company on a mission to redefine lending.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/lendup" },
  { name: "LVL6", slug: "lvl6", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Gaming", categories: ["Gaming", "Mobile"], description: "Mobile MMOs.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/lvl6" },
  { name: "Make School", slug: "make-school", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Education", categories: ["Education", "EdTech"], description: "Redesigning college for the 21st century.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/make-school" },
  { name: "Marft", slug: "marft", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Developer Tools", categories: ["Developer Tools", "Machine Learning"], description: "Embeddable machine learning models for application developers.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/marft" },
  { name: "Minefold", slug: "minefold", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Gaming", categories: ["Gaming", "Cloud"], description: "Simple multiplayer game servers.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/minefold" },
  { name: "Optilly", slug: "optilly", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Marketing", categories: ["Marketing", "Advertising"], description: "FB ad optimization platform.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/optilly" },
  { name: "Pixelapse", slug: "pixelapse", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Design", categories: ["Design", "Collaboration", "Developer Tools"], description: "Github for designers -- automatic revision tracking.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/pixelapse" },
  { name: "SolidStage", slug: "solidstage", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "DevOps", categories: ["DevOps", "SaaS"], description: "Sysadmin as a service.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/solidstage" },
  { name: "Talkray", slug: "talkray", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Messaging", categories: ["Messaging", "Social"], description: "Instantly talk or text to one or a group of friends.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/talkray" },
  { name: "The Muse", slug: "the-muse", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Recruiting", categories: ["Recruiting", "Marketplace"], description: "Values-based job search and hiring for 7M+ monthly users.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/the-muse" },
  { name: "WireOver", slug: "wireover", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Security", categories: ["Security", "File Transfer"], description: "Really secure file sending for big files.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/wireover" },
  { name: "Zillabyte", slug: "zillabyte", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Analytics", categories: ["Analytics", "Sales"], description: "Palantir for sales people.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/zillabyte" },
  { name: "Zipio", slug: "zipio", batch: "W12", batchLabel: "Winter 2012", status: "INACTIVE", category: "Marketplace", categories: ["Marketplace", "Deals"], description: "Deal search service.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/zipio" },

  // ===== S12 (Summer 2012) =====
  { name: "Clever", slug: "clever", batch: "S12", batchLabel: "Summer 2012", status: "ACQUIRED", category: "Education", categories: ["Education", "SaaS"], description: "The platform that powers technology in the classroom.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/clever" },

  // ===== W13 (Winter 2013) =====
  { name: "Meldium", slug: "meldium", batch: "W13", batchLabel: "Winter 2013", status: "UNKNOWN", category: "Security", categories: ["Security", "Enterprise"], description: "Enterprise security and identity management.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/meldium" },

  // ===== S14 (Summer 2014) =====
  { name: "Paid", slug: "paid", batch: "S14", batchLabel: "Summer 2014", status: "UNKNOWN", category: null, categories: [], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/paid" },

  // ===== W15 (Winter 2015) =====
  { name: "Raven Tech", slug: "raven-tech", batch: "W15", batchLabel: "Winter 2015", status: "ACQUIRED", category: "AI", categories: ["AI", "Mobile OS"], description: "Building the next generation of iOS or Android.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/raven-tech" },
  { name: "20n", slug: "20n", batch: "W15", batchLabel: "Winter 2015", status: "UNKNOWN", category: "Biotech", categories: ["Biotech"], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/20n" },
  { name: "Automate Ads", slug: "automate-ads", batch: "W15", batchLabel: "Winter 2015", status: "UNKNOWN", category: "Advertising", categories: ["Advertising"], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/automate-ads" },
  { name: "Enflux", slug: "enflux", batch: "W15", batchLabel: "Winter 2015", status: "UNKNOWN", category: "Smart Clothing", categories: ["Smart Clothing", "Wearables"], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/enflux" },

  // ===== S15 (Summer 2015) =====
  { name: "Bistrobot", slug: "bistrobot", batch: "S15", batchLabel: "Summer 2015", status: "INACTIVE", category: "Food Service Robots", categories: ["Food Tech", "Robotics"], description: "We make robots that make sandwiches.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/bistrobot" },
  { name: "Call9", slug: "call9", batch: "S15", batchLabel: "Summer 2015", status: "INACTIVE", category: "Healthcare", categories: ["Healthcare", "Telemedicine"], description: "Emergency Medicine and Palliative Care at patients' bedsides.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/call9" },
  { name: "CareLedger", slug: "careledger", batch: "S15", batchLabel: "Summer 2015", status: "INACTIVE", category: "Health Tech", categories: ["Health Tech", "Insurance"], description: "Helps companies save money on healthcare expenses.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/careledger" },
  { name: "Cloudstitch", slug: "cloudstitch", batch: "S15", batchLabel: "Summer 2015", status: "ACQUIRED", category: "Developer Tools", categories: ["Developer Tools", "No-code"], description: "Power your website with Google Spreadsheets. Acquired by Instabase.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/cloudstitch" },
  { name: "Gigster", slug: "gigster", batch: "S15", batchLabel: "Summer 2015", status: "ACQUIRED", category: "SaaS", categories: ["SaaS", "Marketplace"], description: "Build and manage distributed teams.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/gigster" },
  { name: "Reduced Energy Microsystems", slug: "reduced-energy-microsystems", batch: "S15", batchLabel: "Summer 2015", status: "INACTIVE", category: "AI Hardware", categories: ["AI", "Hardware", "Deep Learning"], description: "Lowest-power silicon for embedded deep learning.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/reduced-energy-microsystems" },
  { name: "Triplebyte", slug: "triplebyte", batch: "S15", batchLabel: "Summer 2015", status: "ACQUIRED", category: "SaaS", categories: ["SaaS", "Recruiting"], description: "Intelligent technical hiring.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/triplebyte" },
  { name: "VOIQ", slug: "voiq", batch: "S15", batchLabel: "Summer 2015", status: "INACTIVE", category: "SaaS", categories: ["SaaS", "AI", "Voice"], description: "Conversational AI VoiceBots for Business.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/voiq" },

  // ===== W16 (Winter 2016) =====
  { name: "Goodybag", slug: "goodybag", batch: "W16", batchLabel: "Winter 2016", status: "UNKNOWN", category: "Food Tech", categories: ["Food Tech"], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/goodybag" },
  { name: "StrongIntro", slug: "strongintro", batch: "W16", batchLabel: "Winter 2016", status: "INACTIVE", category: "Recruiting", categories: ["Recruiting", "SaaS"], description: "Helps recruiters turn their entire company into a sourcing engine.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/strongintro" },
  { name: "Anchor Health", slug: "anchor-health", batch: "W16", batchLabel: "Winter 2016", status: "UNKNOWN", category: "Health Tech", categories: ["Health Tech"], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/anchor-health" },
  { name: "Algoriz", slug: "algoriz", batch: "W16", batchLabel: "Winter 2016", status: "UNKNOWN", category: "Finance", categories: ["Finance", "Trading"], description: null, founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/algoriz" },

  // ===== S16 (Summer 2016) =====
  { name: "Airo Health", slug: "airo-health", batch: "S16", batchLabel: "Summer 2016", status: "INACTIVE", category: "Mental Health", categories: ["AI", "Mental Health", "Health Tech"], description: "AI to passively track and manage your mental health.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/airo-health" },
  { name: "CrowdAI", slug: "crowdai", batch: "S16", batchLabel: "Summer 2016", status: "ACQUIRED", category: "Machine Learning", categories: ["Machine Learning", "Computer Vision", "No-code"], description: "World's leading no-code platform for vision AI.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/crowdai" },
  { name: "Farmstead", slug: "farmstead", batch: "S16", batchLabel: "Summer 2016", status: "INACTIVE", category: "Grocery", categories: ["AI", "Grocery", "Delivery"], description: "AI-powered digital grocer, delivery in under 60 mins.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/farmstead" },
  { name: "Mindori", slug: "mindori", batch: "S16", batchLabel: "Summer 2016", status: "INACTIVE", category: "E-Commerce", categories: ["E-Commerce", "Voice", "AI"], description: "White-label voice search for e-commerce apps.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/mindori" },
  { name: "NeoWize", slug: "neowize", batch: "S16", batchLabel: "Summer 2016", status: "ACQUIRED", category: "Machine Learning", categories: ["Machine Learning", "Personalization"], description: "New type of machine learning algorithm for personalization.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/neowize" },
  { name: "PatientBank", slug: "patientbank", batch: "S16", batchLabel: "Summer 2016", status: "INACTIVE", category: "Health Tech", categories: ["Health Tech"], description: "Get medical records online from any doctor or hospital.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/patientbank" },
  { name: "Sage Care", slug: "sage-care", batch: "S16", batchLabel: "Summer 2016", status: "INACTIVE", category: "Healthcare", categories: ["Healthcare", "Marketplace"], description: "Get care at home for mom or dad from trusted professionals.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/sage-care" },
  { name: "Selfycart", slug: "selfycart", batch: "S16", batchLabel: "Summer 2016", status: "INACTIVE", category: "Grocery", categories: ["Grocery", "Mobile"], description: "Lets grocery shoppers scan items and checkout on their phone.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/selfycart" },
  { name: "SimpleCitizen", slug: "simplecitizen", batch: "S16", batchLabel: "Summer 2016", status: "ACQUIRED", category: "Civic Tech", categories: ["Civic Tech", "Immigration"], description: "From signup to citizenship, guides immigration applicants.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/simplecitizen" },

  // ===== W17 (Winter 2017) =====
  { name: "Bicycle AI", slug: "bicycle-ai", batch: "W17", batchLabel: "Winter 2017", status: "INACTIVE", category: "AI", categories: ["AI", "Customer Support"], description: "Customer support as a service.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/bicycle-ai" },
  { name: "Breaker", slug: "breaker", batch: "W17", batchLabel: "Winter 2017", status: "ACQUIRED", category: "Podcasts", categories: ["Social Media", "Podcasts"], description: "A podcast company.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/breaker" },
  { name: "Clear Genetics", slug: "clear-genetics", batch: "W17", batchLabel: "Winter 2017", status: "ACQUIRED", category: "Healthcare", categories: ["Healthcare", "Genomics"], description: "Scaling delivery of Genomic services.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/clear-genetics" },
  { name: "FloydHub", slug: "floydhub", batch: "W17", batchLabel: "Winter 2017", status: "INACTIVE", category: "ML Platform", categories: ["AIOps", "Machine Learning", "Developer Tools"], description: "ML Platform for developing, training, deploying ML models.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/floydhub" },
  { name: "Niles", slug: "niles", batch: "W17", batchLabel: "Winter 2017", status: "INACTIVE", category: "Productivity", categories: ["Productivity", "AI"], description: "Knowledge Assistant for Work.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/niles" },
  { name: "Penny", slug: "penny", batch: "W17", batchLabel: "Winter 2017", status: "ACQUIRED", category: "Fintech", categories: ["AI", "Fintech"], description: "Makes keeping track of your finances easy.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/penny" },
  { name: "Pit.AI", slug: "pit-ai", batch: "W17", batchLabel: "Winter 2017", status: "INACTIVE", category: "AI", categories: ["AI", "Investing"], description: "Solving intelligence for investment management.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/pit-ai" },
  { name: "Soomgo", slug: "soomgo", batch: "W17", batchLabel: "Winter 2017", status: "ACQUIRED", category: "Marketplace", categories: ["Marketplace", "Local Services"], description: "Local services marketplace connecting providers with customers.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/soomgo" },
  { name: "Tress", slug: "tress", batch: "W17", batchLabel: "Winter 2017", status: "INACTIVE", category: "Community", categories: ["Community", "Social"], description: "Social community for black women's hairstyles.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/tress" },

  // ===== S17 (Summer 2017) =====
  { name: "Plasticity", slug: "plasticity", batch: "S17", batchLabel: "Summer 2017", status: "ACQUIRED", category: "AI", categories: ["AI", "NLP"], description: "Natural language processing APIs for developers.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/plasticity" },
  { name: "Escher Reality", slug: "escher-reality", batch: "S17", batchLabel: "Summer 2017", status: "ACQUIRED", category: "Developer Tools", categories: ["Developer Tools", "AR"], description: "The backend for Augmented Reality.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/escher-reality" },
  { name: "Lyrebird", slug: "lyrebird", batch: "S17", batchLabel: "Summer 2017", status: "UNKNOWN", category: "AI", categories: ["AI", "Voice Synthesis"], description: "Voice synthesis AI.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/lyrebird" },
  { name: "Piggy", slug: "piggy", batch: "S17", batchLabel: "Summer 2017", status: "INACTIVE", category: "Fintech", categories: ["Fintech", "India"], description: "App for Indians to make investments in mutual funds.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/piggy" },

  // ===== W18 (Winter 2018) =====
  { name: "Sqreen", slug: "sqreen", batch: "W18", batchLabel: "Winter 2018", status: "ACQUIRED", category: "Security", categories: ["DevSecOps", "Security", "SaaS"], description: "Application security platform for the modern enterprise.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/sqreen" },
  { name: "Openland", slug: "openland", batch: "W18", batchLabel: "Winter 2018", status: "INACTIVE", category: "Community", categories: ["Community", "Messaging"], description: "Messenger for communities.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/openland" },
  { name: "Reverie Labs", slug: "reverie-labs", batch: "W18", batchLabel: "Winter 2018", status: "INACTIVE", category: "Drug Discovery", categories: ["AI", "Drug Discovery", "Biotech"], description: "Engineering next-generation, brain-penetrant cancer therapies.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/reverie-labs" },

  // ===== W19 (Winter 2019) =====
  { name: "Preflight", slug: "preflight", batch: "W19", batchLabel: "Winter 2019", status: "ACQUIRED", category: "Developer Tools", categories: ["Developer Tools", "No-code", "Testing"], description: "No-code Web Apps testing for everyone.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/preflight" },
  { name: "Allure Systems", slug: "allure-systems", batch: "W19", batchLabel: "Winter 2019", status: "ACQUIRED", category: "Generative AI", categories: ["Generative AI", "E-Commerce"], description: "AI to create stunning fashion images for eCommerce.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/allure-systems" },
  { name: "Allo", slug: "allo", batch: "W19", batchLabel: "Winter 2019", status: "INACTIVE", category: "Community", categories: ["Community", "Social"], description: "App that helps neighboring families meet and help each other.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/allo" },
  { name: "Basilica", slug: "basilica", batch: "W19", batchLabel: "Winter 2019", status: "INACTIVE", category: "Machine Learning", categories: ["Machine Learning", "API"], description: "API that embeds high-dimensional data like images.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/basilica" },

  // ===== S19 (Summer 2019) =====
  { name: "Compound", slug: "compound", batch: "S19", batchLabel: "Summer 2019", status: "ACQUIRED", category: "Fintech", categories: ["Fintech", "Wealth Management"], description: "Wealth manager for people who work at tech companies.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/compound" },
  { name: "Elpha", slug: "elpha", batch: "S19", batchLabel: "Summer 2019", status: "INACTIVE", category: "Community", categories: ["Community", "Recruiting"], description: "Professional network for women.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/elpha" },

  // ===== W20 (Winter 2020) =====
  { name: "Quickcard", slug: "quickcard", batch: "W20", batchLabel: "Winter 2020", status: "INACTIVE", category: "SaaS", categories: ["SaaS", "Sales"], description: "Dynamic sales materials that shape-shift based on customer needs.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/quickcard" },
  { name: "Mini Exhibitions", slug: "mini-exhibitions", batch: "W20", batchLabel: "Winter 2020", status: "INACTIVE", category: "Entertainment", categories: ["Marketplace", "Entertainment", "Events"], description: "Virtual events for remote teams.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/mini-exhibitions" },

  // ===== S20 (Summer 2020) =====
  { name: "Brevy", slug: "brevy", batch: "S20", batchLabel: "Summer 2020", status: "ACQUIRED", category: "SaaS", categories: ["SaaS", "AI", "Customer Service"], description: "Empower your customer service team through AI and automation.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/brevy" },
  { name: "CapWay", slug: "capway", batch: "S20", batchLabel: "Summer 2020", status: "INACTIVE", category: "Fintech", categories: ["Fintech", "Neobank"], description: "Inclusive financial technology service provider.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/capway" },

  // ===== W21 (Winter 2021) =====
  { name: "Queenly", slug: "queenly", batch: "W21", batchLabel: "Winter 2021", status: "INACTIVE", category: "Marketplace", categories: ["Marketplace", "Sustainable Fashion"], description: "Leading marketplace for formalwear.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/queenly" },

  // ===== S21 (Summer 2021) =====
  { name: "BlackOakTV", slug: "blackoaktv", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "Entertainment", categories: ["Entertainment", "Subscriptions", "Streaming"], description: "Video subscription platform serving black viewers and creators.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/blackoaktv" },
  { name: "Buzzle", slug: "buzzle", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "AI", categories: ["AI", "Learning", "Sales"], description: "Automatic voice-of-customer trends from sales conversations.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/buzzle" },
  { name: "Cache", slug: "cache", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "Marketplace", categories: ["Marketplace", "Delivery", "Dark Stores"], description: "Online convenience stores fulfilled by automated dark stores.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/cache" },
  { name: "Mindmesh", slug: "mindmesh", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "SaaS", categories: ["SaaS", "Remote Work"], description: "The virtual desk that puts you in control.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/mindmesh" },
  { name: "Onsite Pro", slug: "onsite-pro", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "Construction", categories: ["Construction", "HVAC", "SaaS"], description: "Revolutionizing digital selling within HVAC.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/onsite-pro" },
  { name: "Opkit", slug: "opkit", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "Digital Health", categories: ["SaaS", "Digital Health", "AI"], description: "AI phone calls for the US healthcare industry.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/opkit" },
  { name: "Quest", slug: "quest", batch: "S21", batchLabel: "Summer 2021", status: "INACTIVE", category: "Podcasts", categories: ["Community", "Podcasts", "Career"], description: "Audio career advice.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/quest" },
  { name: "Telivy", slug: "telivy", batch: "S21", batchLabel: "Summer 2021", status: "ACQUIRED", category: "Cybersecurity", categories: ["Security", "Cybersecurity"], description: "Automate your cyber security risk assessments.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/telivy" },

  // ===== W22 (Winter 2022) =====
  { name: "Bifrost", slug: "bifrost", batch: "W22", batchLabel: "Winter 2022", status: "INACTIVE", category: "Crypto", categories: ["Crypto", "Web3", "Estate Management"], description: "Wills and Estate Management for Crypto.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/bifrost" },
  { name: "CoffeeAI", slug: "coffeeai", batch: "W22", batchLabel: "Winter 2022", status: "INACTIVE", category: "AI", categories: ["AI", "Sales"], description: "Instant, hyper-personalized, AI-powered outreach messages.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/coffeeai" },
  { name: "Demo Gorilla", slug: "demo-gorilla", batch: "W22", batchLabel: "Winter 2022", status: "INACTIVE", category: "SaaS", categories: ["SaaS", "Sales"], description: "Make all your live SaaS demos impactful.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/demo-gorilla" },
  { name: "Flike", slug: "flike", batch: "W22", batchLabel: "Winter 2022", status: "INACTIVE", category: "AI", categories: ["AI", "Sales", "Email"], description: "AI crafts sales emails that convert.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/flike" },
  { name: "Nophin", slug: "nophin", batch: "W22", batchLabel: "Winter 2022", status: "INACTIVE", category: "Generative AI", categories: ["Generative AI", "Real Estate"], description: "AI Deal Screening Analyst for Commercial Real Estate.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/nophin" },
  { name: "Ozone", slug: "ozone", batch: "W22", batchLabel: "Winter 2022", status: "INACTIVE", category: "Productivity", categories: ["Productivity", "Design Tools", "Video"], description: "Figma for video.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/ozone" },

  // ===== S22 (Summer 2022) =====
  { name: "Argovox", slug: "argovox", batch: "S22", batchLabel: "Summer 2022", status: "INACTIVE", category: "Fintech", categories: ["Fintech", "LegalTech", "Voice AI"], description: "Voice AI agents for patient billing and collections.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/argovox" },
  { name: "Dialect", slug: "dialect", batch: "S22", batchLabel: "Summer 2022", status: "INACTIVE", category: "Generative AI", categories: ["Generative AI", "Forms"], description: "AI copilot for forms, questionnaires and RFX.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/dialect" },
  { name: "Lotus", slug: "lotus", batch: "S22", batchLabel: "Summer 2022", status: "INACTIVE", category: "Fintech", categories: ["Fintech", "Open Source", "Billing"], description: "Open-Core Pricing and Billing Engine.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/lotus" },
  { name: "Mercator", slug: "mercator", batch: "S22", batchLabel: "Summer 2022", status: "INACTIVE", category: "Generative AI", categories: ["Generative AI", "Analytics"], description: "AI-assisted data analytics.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/mercator" },
  { name: "Vizzly", slug: "vizzly", batch: "S22", batchLabel: "Summer 2022", status: "ACQUIRED", category: "Developer Tools", categories: ["Developer Tools", "Analytics", "SaaS"], description: "Customer-Facing Analytics for Modern SaaS.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/vizzly" },

  // ===== W23 (Winter 2023) =====
  { name: "Booth AI", slug: "booth-ai", batch: "W23", batchLabel: "Winter 2023", status: "ACQUIRED", category: "AI", categories: ["AI", "E-Commerce", "Generative AI"], description: "Generative AI Photographer for E-Commerce.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/booth-ai" },
  { name: "Cardinal", slug: "cardinal", batch: "W23", batchLabel: "Winter 2023", status: "ACQUIRED", category: "Generative AI", categories: ["Generative AI", "Analytics", "Product"], description: "Your AI product backlog.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/cardinal" },
  { name: "CodeParrot AI", slug: "codeparrot-ai", batch: "W23", batchLabel: "Winter 2023", status: "INACTIVE", category: "AI", categories: ["AI", "Developer Tools"], description: "Helps Developers build stunning UI Lightning Fast.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/codeparrot-ai" },
  { name: "CreatorML", slug: "creatorml", batch: "W23", batchLabel: "Winter 2023", status: "INACTIVE", category: "B2B", categories: ["B2B", "Machine Learning"], description: "Foundation Model for Human Attention.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/creatorml" },
  { name: "Fabius", slug: "fabius", batch: "W23", batchLabel: "Winter 2023", status: "INACTIVE", category: "Generative AI", categories: ["Generative AI", "Sales"], description: "AI to improve Sales Calls.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/fabius" },
  { name: "Neptyne", slug: "neptyne", batch: "W23", batchLabel: "Winter 2023", status: "INACTIVE", category: "Generative AI", categories: ["Generative AI", "Data Science"], description: "The programmable spreadsheet.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/neptyne" },
  { name: "Parabolic", slug: "parabolic", batch: "W23", batchLabel: "Winter 2023", status: "INACTIVE", category: "Generative AI", categories: ["Generative AI", "Customer Support"], description: "AI assistant for customer support.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/parabolic" },
  { name: "Sorted", slug: "sorted", batch: "W23", batchLabel: "Winter 2023", status: "INACTIVE", category: "SaaS", categories: ["SaaS", "Subscriptions"], description: "Instant SaaS management.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/sorted" },

  // ===== S23 (Summer 2023) =====
  { name: "Vizly", slug: "vizly", batch: "S23", batchLabel: "Summer 2023", status: "INACTIVE", category: "AI", categories: ["AI", "Data Visualization"], description: "Data to insights in seconds.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/vizly" },
  { name: "CodeStory", slug: "codestory", batch: "S23", batchLabel: "Summer 2023", status: "INACTIVE", category: "Developer Tools", categories: ["Developer Tools", "AI", "IDE"], description: "Aide is an AI-native, privacy-first IDE built on top of VSCode.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/codestory" },

  // ===== W24 (Winter 2024) =====
  { name: "Abel", slug: "abel", batch: "W24", batchLabel: "Winter 2024", status: "INACTIVE", category: "LegalTech", categories: ["AI", "LegalTech"], description: "Transforming document review for litigation teams.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/abel" },

  // ===== S24 (Summer 2024) =====
  { name: "deepsilicon", slug: "deepsilicon", batch: "S24", batchLabel: "Summer 2024", status: "INACTIVE", category: "Edge Computing", categories: ["Edge Computing", "Semiconductors", "AI"], description: "Software and hardware to run neural networks faster and cheaper.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/deepsilicon" },
  { name: "Remade", slug: "remade", batch: "S24", batchLabel: "Summer 2024", status: "ACQUIRED", category: "AI", categories: ["AI", "Social Media", "Creative Tools"], description: "AI-native canvas for creative workflows.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/remade" },

  // ===== W25 (Winter 2025) =====
  { name: "Sublingual", slug: "sublingual", batch: "W25", batchLabel: "Winter 2025", status: "INACTIVE", category: "Developer Tools", categories: ["Developer Tools", "Open Source", "Productivity"], description: "Daily productivity tracker.", founders: null, funding: null, shutdownYear: null, successor: null, successorUrl: null, sourceUrl: "https://startups.rip/company/sublingual" },
];

async function seedGraveyard() {
  console.log("Seeding Startup Graveyard...");

  let created = 0;
  let updated = 0;

  for (const startup of deadStartups) {
    await prisma.deadStartup.upsert({
      where: { slug: startup.slug },
      update: {
        name: startup.name,
        batch: startup.batch,
        batchLabel: startup.batchLabel,
        status: startup.status,
        category: startup.category,
        categories: startup.categories,
        description: startup.description,
        founders: startup.founders,
        funding: startup.funding,
        shutdownYear: startup.shutdownYear,
        successor: startup.successor,
        successorUrl: startup.successorUrl,
        sourceUrl: startup.sourceUrl,
      },
      create: {
        name: startup.name,
        slug: startup.slug,
        batch: startup.batch,
        batchLabel: startup.batchLabel,
        status: startup.status,
        category: startup.category,
        categories: startup.categories,
        description: startup.description,
        founders: startup.founders,
        funding: startup.funding,
        shutdownYear: startup.shutdownYear,
        successor: startup.successor,
        successorUrl: startup.successorUrl,
        sourceUrl: startup.sourceUrl,
      },
    });

    // Count for logging (simplified)
    created++;
  }

  console.log(`Graveyard seeded: ${created} startups processed.`);
}

seedGraveyard()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Done!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

export { seedGraveyard, deadStartups };
