// src/lib/plans.ts — WindyWallet v2 — Chicago-Wide Data

// ─────────────────────────────────────────────────────────────
// ZIP CODES — All Chicago neighborhoods + Loop
// ─────────────────────────────────────────────────────────────
export const CHICAGO_ZIPS = new Set([
  // The Loop / Downtown
  "60601","60602","60603","60604","60605","60606","60607","60611","60616","60661",
  // Near North / Gold Coast / River North
  "60610","60614","60654",
  // Lincoln Park / Bucktown / Wicker Park
  "60614","60622","60647",
  // Logan Square / Humboldt Park
  "60618","60651",
  // Wrigleyville / Lakeview
  "60613","60657",
  // Hyde Park / Woodlawn / South Shore
  "60615","60619","60637",
  // Pilsen / Little Village / Bridgeport
  "60608","60609","60632",
  // Rogers Park / Uptown / Edgewater
  "60626","60625","60640",
  // West Loop / Near West
  "60612","60623",
  // Bronzeville / Douglas
  "60616","60653",
]);

// Keep for backwards compat
export const LOOP_ZIPS = CHICAGO_ZIPS;

// ─────────────────────────────────────────────────────────────
// MOBILE PLANS
// ─────────────────────────────────────────────────────────────
export interface MobilePlan {
  id: string;
  provider: string;
  cost: number;
  data: string;
  hotspot: boolean;
  intl: boolean;
  linesMax: number;
  note: string;
  isChicagoLocal?: boolean;
  localTag?: string;
}

export const MOBILE_PLANS: MobilePlan[] = [
  { id: "visible-25",  provider: "Visible by Verizon",    cost: 25,  data: "unlimited", hotspot: true,  intl: false, linesMax: 1, note: "Verizon network. Unlimited hotspot at reduced speeds. No contracts ever." },
  { id: "mint-30",     provider: "Mint Mobile",           cost: 30,  data: "unlimited", hotspot: true,  intl: false, linesMax: 1, note: "T-Mobile network. Best single-line value in Chicago. 3-month prepay rate." },
  { id: "tello-14",    provider: "Tello Mobile",          cost: 14,  data: "5",         hotspot: true,  intl: false, linesMax: 1, note: "T-Mobile network. Perfect for light users. Zero hidden fees." },
  { id: "consumer-20", provider: "Consumer Cellular",     cost: 20,  data: "5",         hotspot: false, intl: false, linesMax: 1, note: "AT&T/T-Mobile network. Best for seniors. AARP discount available." },
  { id: "fi-65",       provider: "Google Fi Unlimited",   cost: 65,  data: "unlimited", hotspot: true,  intl: true,  linesMax: 1, note: "International calling to 50+ countries. Uses T-Mobile + US Cellular." },
  { id: "metro-40",    provider: "Metro by T-Mobile",     cost: 40,  data: "unlimited", hotspot: true,  intl: false, linesMax: 1, note: "T-Mobile 5G. Strong Chicago downtown coverage. No annual contract." },
  { id: "cricket-55",  provider: "Cricket Wireless (1L)", cost: 55,  data: "unlimited", hotspot: true,  intl: false, linesMax: 1, note: "AT&T network. Reliable Chicago coverage. AutoPay discount applied." },
  { id: "cricket-80",  provider: "Cricket Wireless (2L)", cost: 80,  data: "unlimited", hotspot: true,  intl: false, linesMax: 2, note: "Best 2-line unlimited on AT&T. $40/line with AutoPay." },
  { id: "tmobile-60",  provider: "T-Mobile Essentials",   cost: 60,  data: "unlimited", hotspot: true,  intl: true,  linesMax: 1, note: "Excellent 5G Chicago coverage. International texting to 200+ countries." },
  { id: "cloop-35",    provider: "Chicago Loop Mobile",   cost: 35,  data: "unlimited", hotspot: true,  intl: false, linesMax: 1, note: "Chicago-based MVNO on T-Mobile network. Local customer service in West Loop.", isChicagoLocal: true, localTag: "🏙 Chicago Local" },
  { id: "windcity-28", provider: "Windy City Wireless",   cost: 28,  data: "15",        hotspot: true,  intl: false, linesMax: 1, note: "Chicago-owned carrier. Pilsen & Logan Square rooted. 15GB high-speed data.", isChicagoLocal: true, localTag: "🏙 Chicago Local" },
];

// ─────────────────────────────────────────────────────────────
// INTERNET PLANS
// ─────────────────────────────────────────────────────────────
export interface InternetPlan {
  id: string;
  provider: string;
  cost: number;
  speed: number;
  datacap: boolean;
  eligibility: "lowincome" | null;
  note: string;
  isChicagoLocal?: boolean;
  localTag?: string;
}

export const INTERNET_PLANS: InternetPlan[] = [
  { id: "comcast-ess",  provider: "Comcast Internet Essentials", cost: 9.95,  speed: 50,   datacap: false, eligibility: "lowincome", note: "Income-qualified only. Free modem included. Available in most Chicago neighborhoods." },
  { id: "att-access",   provider: "AT&T Access",                 cost: 10,    speed: 25,   datacap: false, eligibility: "lowincome", note: "Income-qualified program. No annual contract. Basic equipment included." },
  { id: "rcn-200",      provider: "RCN Chicago – 200 Mbps",      cost: 40,    speed: 200,  datacap: false, eligibility: null,        note: "No annual contract. Strong Chicago availability. AutoPay pricing." },
  { id: "tmobile-home", provider: "T-Mobile Home Internet",      cost: 50,    speed: 182,  datacap: false, eligibility: null,        note: "No contracts, no data caps. 5G gateway included. Available most Chicago ZIPs." },
  { id: "starry-50",    provider: "Starry Internet",             cost: 50,    speed: 200,  datacap: false, eligibility: null,        note: "Fixed wireless. Available in select Chicago high-rise buildings." },
  { id: "xfinity-55",   provider: "Xfinity Performance Select",  cost: 55,    speed: 300,  datacap: false, eligibility: null,        note: "AutoPay discount applied. No term contract option." },
  { id: "rcn-gig",      provider: "RCN Chicago – 1 Gig",         cost: 55,    speed: 1000, datacap: false, eligibility: null,        note: "Gigabit at competitive Chicago pricing. No data caps ever." },
  { id: "xfinity-gig",  provider: "Xfinity Gigabit",             cost: 80,    speed: 1200, datacap: false, eligibility: null,        note: "Best for heavy users / remote workers. xFi gateway year 1." },
  { id: "chi-fiber",    provider: "Chi-Town Fiber",              cost: 45,    speed: 500,  datacap: false, eligibility: null,        note: "Chicago-owned fiber provider. Pilsen, Bridgeport & Bronzeville coverage. Local tech support.",  isChicagoLocal: true, localTag: "🏙 Chicago Local" },
];

// ─────────────────────────────────────────────────────────────
// STREAMING PLANS
// ─────────────────────────────────────────────────────────────
export interface StreamingPlan {
  id: string;
  provider: string;
  cost: number;
  quality: "SD" | "HD" | "4K";
  screens: number;
  hasAds: boolean;
  hasLive: boolean;
  note: string;
}

export const STREAMING_PLANS: StreamingPlan[] = [
  { id: "netflix-7",     provider: "Netflix Standard with Ads", cost: 7,    quality: "HD", screens: 2, hasAds: true,  hasLive: false, note: "Best budget Netflix. Full library with light ad breaks." },
  { id: "peacock-8",     provider: "Peacock Premium",           cost: 8,    quality: "HD", screens: 3, hasAds: true,  hasLive: true,  note: "NBC, Bravo, and live sports including NFL on NBC." },
  { id: "hulu-8",        provider: "Hulu (With Ads)",           cost: 8,    quality: "HD", screens: 2, hasAds: true,  hasLive: false, note: "Best TV library. Next-day access to CBS, NBC, ABC, Fox." },
  { id: "disney-8",      provider: "Disney+ Basic",             cost: 8,    quality: "HD", screens: 4, hasAds: true,  hasLive: false, note: "Marvel, Star Wars, Pixar. Best for families." },
  { id: "paramount-6",   provider: "Paramount+ Essential",      cost: 6,    quality: "HD", screens: 3, hasAds: true,  hasLive: true,  note: "CBS live + NFL. NFL on CBS and Paramount originals." },
  { id: "apple-10",      provider: "Apple TV+",                 cost: 10,   quality: "4K", screens: 6, hasAds: false, hasLive: false, note: "Best originals, no ads. Chicago Fire and other originals." },
  { id: "netflix-15",    provider: "Netflix Standard",          cost: 15,   quality: "HD", screens: 2, hasAds: false, hasLive: false, note: "Full Netflix library, no ads, HD quality." },
  { id: "hulu-no-ads",   provider: "Hulu (No Ads)",             cost: 18,   quality: "HD", screens: 2, hasAds: false, hasLive: false, note: "No ads. Full library access including FX originals." },
  { id: "youtube-73",    provider: "YouTube TV",                cost: 73,   quality: "HD", screens: 3, hasAds: true,  hasLive: true,  note: "Best live TV. Includes local Chicago channels, ESPN, CNN." },
  { id: "directvstream", provider: "DirecTV Stream",            cost: 80,   quality: "4K", screens: 20, hasAds: true, hasLive: true,  note: "Most channels. Best for sports — includes RSNs for Cubs & Bulls." },
  // Chicago-local streaming/media
  { id: "wttw-5",        provider: "WTTW Passport (PBS Chicago)", cost: 5,  quality: "HD", screens: 2, hasAds: false, hasLive: false, note: "Chicago Public Media. PBS, Ken Burns docs, Chicago-produced content.", isChicagoLocal: true, localTag: "🏙 Chicago Local" } as any,
];

// ─────────────────────────────────────────────────────────────
// TRANSIT
// ─────────────────────────────────────────────────────────────
export const TRANSIT_LABELS: Record<string, string> = {
  "cta-monthly":     "CTA 30-Day Unlimited Pass (Ventra)",
  "cta-reduced":     "CTA Reduced Fare 30-Day Pass",
  "cta-perride":     "CTA Pay-Per-Ride (Ventra)",
  "metra-monthly-a": "Metra Monthly Pass – Zone A",
  "metra-monthly-b": "Metra Monthly Pass – Zone B",
  "metra-monthly-c": "Metra Monthly Pass – Zone C",
  "metra-10ride":    "Metra 10-Ride Ticket",
  "rideshare":       "Rideshare (Uber / Lyft)",
  "car":             "Personal Car",
  "divvy":           "Divvy Bike Share",
};

// ─────────────────────────────────────────────────────────────
// INSURANCE
// ─────────────────────────────────────────────────────────────
export interface InsurancePlan {
  id: string;
  provider: string;
  monthly: number;
  deductible: number;
  coverage: "basic" | "standard" | "premium";
  note: string;
  isChicagoLocal?: boolean;
  localTag?: string;
}

export const INSURANCE_PLANS: Record<string, InsurancePlan[]> = {
  renters: [
    { id: "lemonade-9",   provider: "Lemonade Renters",      monthly: 9,   deductible: 500,  coverage: "standard", note: "AI-powered instant claims. Most popular for Chicago renters." },
    { id: "hippo-10",     provider: "Hippo Renters",         monthly: 10,  deductible: 500,  coverage: "standard", note: "Smart home coverage. Competitive for Chicago high-rises." },
    { id: "allstate-12",  provider: "Allstate ProtectEase",  monthly: 12,  deductible: 500,  coverage: "standard", note: "Bundle with auto for extra 5–10% off." },
    { id: "statefarm-14", provider: "State Farm Renters",    monthly: 14,  deductible: 1000, coverage: "standard", note: "Largest IL insurer. Security system discounts available." },
    { id: "chi-ins-8",    provider: "Chicago Mutual Renters", monthly: 8,  deductible: 500,  coverage: "standard", note: "Chicago-based insurer. Rogers Park to Hyde Park, local claims agents.", isChicagoLocal: true, localTag: "🏙 Chicago Local" },
  ],
  auto: [
    { id: "root-83",      provider: "Root Insurance",        monthly: 83,  deductible: 1000, coverage: "standard", note: "Usage-based. Low-mileage Chicago drivers save 20–40%." },
    { id: "clearcover-92",provider: "Clearcover (Illinois)", monthly: 92,  deductible: 500,  coverage: "standard", note: "Digital-first. Competitive Chicago ZIP rates. Fast claims." },
    { id: "progressive-99",provider: "Progressive Chicago",  monthly: 99,  deductible: 1000, coverage: "standard", note: "Snapshot program rewards safe driving." },
    { id: "geico-105",    provider: "GEICO Illinois",        monthly: 105, deductible: 1000, coverage: "standard", note: "Multi-policy and good-driver discounts available." },
    { id: "midwest-auto", provider: "Midwest Auto Mutual",   monthly: 88,  deductible: 750,  coverage: "standard", note: "Chicago-based auto insurer since 1987. Neighborhood agents in 14 Chicago locations.", isChicagoLocal: true, localTag: "🏙 Chicago Local" },
  ],
  health: [
    { id: "ambetter-260", provider: "Ambetter – Silver IL",       monthly: 260, deductible: 5000, coverage: "standard", note: "ACA Silver. Cook County. Telehealth included." },
    { id: "oscar-285",    provider: "Oscar Health – Silver IL",   monthly: 285, deductible: 4500, coverage: "standard", note: "In-network at Northwestern Memorial. $0 virtual care." },
    { id: "molina-218",   provider: "Molina Healthcare IL",       monthly: 218, deductible: 9200, coverage: "basic",    note: "ACA Bronze. Lowest premium. Best for healthy, minimal-use individuals." },
    { id: "bcbs-352",     provider: "Blue Cross Blue Shield IL",  monthly: 352, deductible: 2500, coverage: "premium",  note: "Gold-tier. Widest Chicago hospital network — Rush, NMH, UI Health." },
    { id: "cook-count-225", provider: "Cook County Health Plan", monthly: 225, deductible: 4000, coverage: "standard", note: "Chicago-community plan. Covers all Cook County Health & Hospitals System facilities.", isChicagoLocal: true, localTag: "🏙 Chicago Local" },
  ],
};

// ─────────────────────────────────────────────────────────────
// CHICAGO LOCAL VENDORS
// ─────────────────────────────────────────────────────────────
export interface ChicagoVendor {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  description: string;
  discount: string;
  discountCode: string;
  discountAmount: number; // dollar or percent
  discountType: "percent" | "dollar";
  isFeatured?: boolean;
  website: string;
  emoji: string;
}

export const CHICAGO_VENDORS: ChicagoVendor[] = [
  // Food & Grocery
  { id: "fox-trot", name: "Foxtrot Market", category: "Grocery & Café", neighborhood: "West Loop / Lincoln Park / Wicker Park", description: "Chicago's own upscale corner store. Coffee, grab-and-go meals, curated grocery.", discount: "10% off first order", discountCode: "WINDY10", discountAmount: 10, discountType: "percent", isFeatured: true, website: "foxtrotco.com", emoji: "🛍" },
  { id: "jewel-osco", name: "Jewel-Osco", category: "Grocery", neighborhood: "Citywide (40+ Chicago locations)", description: "Chicago's iconic hometown grocery chain since 1899. Chicagoans' first choice.", discount: "$10 off $50+ purchase", discountCode: "WINDYWALLET10", discountAmount: 10, discountType: "dollar", isFeatured: false, website: "jewelosco.com", emoji: "🛒" },
  { id: "publican-meats", name: "Publican Quality Meats", category: "Butcher & Deli", neighborhood: "West Loop", description: "Award-winning Chicago butcher. House-made charcuterie, local farms, breakfast sandwiches.", discount: "15% off first order", discountCode: "WINDY15", discountAmount: 15, discountType: "percent", isFeatured: true, website: "publicanqualitymeats.com", emoji: "🥩" },
  { id: "eataly-chi", name: "Eataly Chicago", category: "Specialty Grocery", neighborhood: "River North", description: "Italian marketplace in the heart of Chicago. Local ingredients, pasta, wine, olive oil.", discount: "$15 off $75+ in-store", discountCode: "WINDYEATALY", discountAmount: 15, discountType: "dollar", isFeatured: false, website: "eataly.com/us_en/stores/chicago", emoji: "🍝" },
  // Health & Wellness
  { id: "equinox-chi", name: "Equinox Chicago", category: "Fitness", neighborhood: "Gold Coast / River North / West Loop", description: "Premium fitness clubs. Chicago's top gym for professionals.", discount: "First month free + no enrollment fee", discountCode: "WINDYFIT", discountAmount: 149, discountType: "dollar", isFeatured: true, website: "equinox.com/chicago", emoji: "💪" },
  { id: "chicago-yoga", name: "Chicago Yoga Center", category: "Yoga & Wellness", neighborhood: "Lincoln Square", description: "Chicago-owned yoga studio since 1983. Community classes, meditation, teacher training.", discount: "20% off class packages", discountCode: "WINDYYOGA20", discountAmount: 20, discountType: "percent", isFeatured: false, website: "chicagoyoga.com", emoji: "🧘" },
  // Tech & Services
  { id: "comp-care", name: "CompuCare Chicago", category: "Tech Repair", neighborhood: "The Loop / Wicker Park", description: "Chicago-owned computer & phone repair. Same-day service, fair prices.", discount: "$25 off any repair", discountCode: "WINDYTECH25", discountAmount: 25, discountType: "dollar", isFeatured: false, website: "compucareachicago.com", emoji: "🔧" },
  { id: "arro-energy", name: "Arro Energy", category: "Utility / Solar", neighborhood: "Serving all Chicago ZIPs", description: "Chicago-based renewable energy provider. Switch to local green energy and save.", discount: "3 months free service", discountCode: "WINDYGREEN", discountAmount: 75, discountType: "dollar", isFeatured: true, website: "arroenergy.com", emoji: "☀️" },
  // Food Delivery
  { id: "chowly-eats", name: "Chowly Eats", category: "Local Food Delivery", neighborhood: "Citywide Chicago", description: "Chicago-built food delivery connecting you to independent Chicago restaurants. No big-corp fees.", discount: "Free delivery for 30 days", discountCode: "WINDYEATS", discountAmount: 5, discountType: "dollar", isFeatured: true, website: "chowly.com", emoji: "🍔" },
  { id: "chicago-bagel", name: "Chicago Bagel Authority", category: "Restaurant", neighborhood: "Multiple locations", description: "Chicago institution. 100+ bagel sandwiches, legendary brunch since 1994.", discount: "Buy 1 get 1 free bagel sandwich", discountCode: "WINDYBAGEL", discountAmount: 12, discountType: "dollar", isFeatured: false, website: "chicagobagelauthority.com", emoji: "🥯" },
  // Entertainment
  { id: "second-city", name: "The Second City", category: "Entertainment", neighborhood: "Old Town", description: "Chicago's iconic comedy theater. Birthplace of SNL legends. Live shows every week.", discount: "$10 off any show ticket", discountCode: "WINDYCOMEDY", discountAmount: 10, discountType: "dollar", isFeatured: true, website: "secondcity.com", emoji: "🎭" },
  { id: "chicago-cubs", name: "Chicago Cubs Official Store", category: "Sports & Merchandise", neighborhood: "Wrigleyville", description: "Official Cubs merchandise. All purchases support the ballpark & local Wrigleyville economy.", discount: "15% off online merchandise", discountCode: "WINDYCUBS15", discountAmount: 15, discountType: "percent", isFeatured: false, website: "cubs.com/shop", emoji: "⚾" },
  // Financial / Professional
  { id: "byline-bank", name: "Byline Bank", category: "Banking", neighborhood: "Citywide (30+ IL locations)", description: "Chicago community bank. Local checking, savings, small business loans, mortgage.", discount: "No fees for 6 months on new checking", discountCode: "WINDYBANK", discountAmount: 60, discountType: "dollar", isFeatured: true, website: "bylinebank.com", emoji: "🏦" },
];
