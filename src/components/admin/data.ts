// src/components/admin/data.ts — WindyWallet Admin Mock Data

export const SAVINGS_TREND = [
  { month: "Aug", savings: 181200, users: 612 },
  { month: "Sep", savings: 203400, users: 721 },
  { month: "Oct", savings: 228700, users: 834 },
  { month: "Nov", savings: 251900, users: 918 },
  { month: "Dec", savings: 287300, users: 1041 },
  { month: "Jan", savings: 312600, users: 1147 },
  { month: "Feb", savings: 341800, users: 1247 },
];

export const CATEGORY_DATA = [
  { name: "Mobile",    savings: 38, color: "#3B82F6", amount: 129682 },
  { name: "Internet",  savings: 28, color: "#8B5CF6", amount: 95590  },
  { name: "Streaming", savings: 18, color: "#F59E0B", amount: 61524  },
  { name: "Insurance", savings: 11, color: "#10B981", amount: 37567  },
  { name: "Transit",   savings: 5,  color: "#EF4444", amount: 17075  },
];

export const NEIGHBORHOOD_DATA = [
  { name: "The Loop",     users: 312, savings: 97344,  zip: "60601-07" },
  { name: "Wicker Park",  users: 198, savings: 61776,  zip: "60622"    },
  { name: "Lincoln Park", users: 187, savings: 58344,  zip: "60614"    },
  { name: "Lakeview",     users: 164, savings: 51168,  zip: "60613"    },
  { name: "Logan Square", users: 143, savings: 44616,  zip: "60647"    },
  { name: "Hyde Park",    users: 121, savings: 37752,  zip: "60615"    },
  { name: "Rogers Park",  users: 98,  savings: 30576,  zip: "60626"    },
  { name: "Pilsen",       users: 74,  savings: 23088,  zip: "60608"    },
];

export const LOCAL_VENDORS = [
  { name: "Foxtrot Market",        category: "Grocery & Café",  coupons: 312, revenue: 14976, featured: true,  emoji: "🛍"  },
  { name: "Byline Bank",           category: "Banking",         coupons: 289, revenue: 17340, featured: true,  emoji: "🏦"  },
  { name: "The Second City",       category: "Entertainment",   coupons: 241, revenue: 2410,  featured: true,  emoji: "🎭"  },
  { name: "Arro Energy",           category: "Solar/Utility",   coupons: 198, revenue: 14850, featured: true,  emoji: "☀️"  },
  { name: "Chowly Eats",           category: "Food Delivery",   coupons: 187, revenue: 935,   featured: true,  emoji: "🍔"  },
  { name: "Chicago Yoga Center",   category: "Wellness",        coupons: 143, revenue: 8580,  featured: false, emoji: "🧘"  },
  { name: "Publican Quality Meats",category: "Butcher",         coupons: 127, revenue: 9525,  featured: false, emoji: "🥩"  },
  { name: "CompuCare Chicago",     category: "Tech Repair",     coupons: 89,  revenue: 2225,  featured: false, emoji: "🔧"  },
];

export const RECENT_USERS = [
  { id: "u-8821", name: "Maya Johnson",  zip: "60622", savings: 142, plans: 3, joined: "2m ago",  status: "active" },
  { id: "u-8820", name: "Diego Reyes",   zip: "60614", savings: 89,  plans: 2, joined: "14m ago", status: "active" },
  { id: "u-8819", name: "Priya Sharma",  zip: "60607", savings: 211, plans: 4, joined: "1h ago",  status: "active" },
  { id: "u-8818", name: "James Park",    zip: "60626", savings: 67,  plans: 1, joined: "2h ago",  status: "active" },
  { id: "u-8817", name: "Aisha Williams",zip: "60615", savings: 178, plans: 3, joined: "3h ago",  status: "active" },
  { id: "u-8816", name: "Marcus Chen",   zip: "60647", savings: 95,  plans: 2, joined: "5h ago",  status: "idle"   },
];

export const PLAN_PERFORMANCE = [
  { name: "Mint Mobile",        category: "Mobile",    selections: 412, avgSaving: 45 },
  { name: "RCN Chicago 200",    category: "Internet",  selections: 387, avgSaving: 49 },
  { name: "Disney+ Bundle",     category: "Streaming", selections: 298, avgSaving: 31 },
  { name: "Lemonade Renters",   category: "Insurance", selections: 243, avgSaving: 28 },
  { name: "Tello Mobile",       category: "Mobile",    selections: 201, avgSaving: 71 },
  { name: "CTA Reduced Fare",   category: "Transit",   selections: 189, avgSaving: 55 },
  { name: "Chi-Town Fiber",     category: "Internet",  selections: 167, avgSaving: 44 },
  { name: "Windy City Wireless",category: "Mobile",    selections: 143, avgSaving: 57 },
];

export const CATEGORY_COLORS: Record<string, string> = {
  Mobile: "#3B82F6",
  Internet: "#8B5CF6",
  Streaming: "#F59E0B",
  Insurance: "#10B981",
  Transit: "#EF4444",
};
