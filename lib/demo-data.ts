/**
 * DEMO DATA — sample records for UI development only.
 * None of these balances, transactions, or vendors exist on-chain.
 */
import type {
  ChartPoint,
  RewardActivity,
  RewardChallenge,
  Transaction,
  Vendor,
} from './types'

function demoHash(seed: number) {
  let state = seed * 2654435761
  let out = '0x'
  for (let i = 0; i < 64; i++) {
    state = (state * 1103515245 + 12345) % 2147483648
    out += (state % 16).toString(16)
  }
  return out
}

export const demoStudent = {
  name: 'Aarav Sharma',
  studentId: 'CS21B1047',
  department: 'Computer Science & Engineering',
  email: 'aarav.sharma@campus.edu',
  address: '0x7a3f9c2e1b4d8a6c5e0f3b7d9a2c4e6f8b1d3a5c',
  balance: 500,
  initials: 'AS',
}

export const demoVendors: Vendor[] = [
  {
    id: 'v-north-canteen',
    name: 'North Block Canteen',
    category: 'canteen',
    location: 'North Block, Ground Floor',
    address: '0x3c1e8b9a7d2f4e6c0a5b8d1f3e7c9a2b4d6f8e0a',
    rating: 4.6,
    hours: '7:30 AM – 9:00 PM',
    status: 'active',
    products: [
      { id: 'p1', name: 'Masala Dosa', description: 'Crisp dosa with potato filling, sambar and chutney.', price: 45, tag: 'Popular' },
      { id: 'p2', name: 'Veg Thali', description: 'Rice, two curries, dal, roti, salad and dessert.', price: 80 },
      { id: 'p3', name: 'Filter Coffee', description: 'South Indian filter coffee, freshly brewed.', price: 20 },
    ],
  },
  {
    id: 'v-juice-bar',
    name: 'Green Leaf Juice Bar',
    category: 'canteen',
    location: 'Library Plaza',
    address: '0x9e4a2c7b1d8f3e5a6c0b9d2f4a7e1c3b5d8f0a2e',
    rating: 4.4,
    hours: '9:00 AM – 6:00 PM',
    status: 'active',
    products: [
      { id: 'p4', name: 'Mango Smoothie', description: 'Seasonal mango blended with yoghurt.', price: 55 },
      { id: 'p5', name: 'Fresh Lime Soda', description: 'Sweet or salted, served chilled.', price: 25 },
      { id: 'p6', name: 'Fruit Bowl', description: 'Cut seasonal fruits with a honey drizzle.', price: 40, tag: 'Healthy' },
    ],
  },
  {
    id: 'v-campus-stationers',
    name: 'Campus Stationers',
    category: 'stationery',
    location: 'Academic Block A',
    address: '0x5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d',
    rating: 4.7,
    hours: '8:30 AM – 7:00 PM',
    status: 'active',
    products: [
      { id: 'p7', name: 'Lab Record Notebook', description: '200-page ruled record book with index.', price: 60 },
      { id: 'p8', name: 'Engineering Drawing Kit', description: 'Mini drafter, compass set and scales.', price: 350, tag: 'Bundle' },
      { id: 'p9', name: 'Gel Pen Pack (5)', description: 'Smooth 0.5mm gel pens, assorted colours.', price: 50 },
    ],
  },
  {
    id: 'v-print-hub',
    name: 'PrintHub Xerox',
    category: 'printing',
    location: 'Central Library, Level 1',
    address: '0x2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a',
    rating: 4.3,
    hours: '8:00 AM – 8:00 PM',
    status: 'active',
    products: [
      { id: 'p10', name: 'B&W Print (per page)', description: 'A4 single-sided laser print.', price: 2 },
      { id: 'p11', name: 'Colour Print (per page)', description: 'A4 high-quality colour print.', price: 10 },
      { id: 'p12', name: 'Spiral Binding', description: 'Up to 150 pages with transparent cover.', price: 30, tag: 'Fast' },
    ],
  },
  {
    id: 'v-poster-lab',
    name: 'Poster & Thesis Lab',
    category: 'printing',
    location: 'Research Park',
    address: '0x8d0f2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e',
    rating: 4.8,
    hours: '10:00 AM – 6:00 PM',
    status: 'active',
    products: [
      { id: 'p13', name: 'A1 Research Poster', description: 'Matte finish, ready for conferences.', price: 250 },
      { id: 'p14', name: 'Thesis Hardbound', description: 'Hardbound with gold-foil title lettering.', price: 400 },
    ],
  },
  {
    id: 'v-tech-fest',
    name: 'TechNova Fest 2026',
    category: 'events',
    location: 'Main Auditorium',
    address: '0x6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c',
    rating: 4.9,
    hours: 'Nov 14 – 16',
    status: 'active',
    products: [
      { id: 'p15', name: 'Full Fest Pass', description: 'Access to all workshops, talks and pro-shows.', price: 300, tag: 'Limited' },
      { id: 'p16', name: 'Hackathon Entry', description: '36-hour hackathon team registration.', price: 150 },
      { id: 'p17', name: 'Robotics Workshop', description: 'Hands-on two-day robotics workshop.', price: 200 },
    ],
  },
  {
    id: 'v-cultural-club',
    name: 'Rhythm Cultural Society',
    category: 'events',
    location: 'Open Air Theatre',
    address: '0x4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b',
    rating: 4.5,
    hours: 'Every Friday',
    status: 'active',
    products: [
      { id: 'p18', name: 'Music Night Ticket', description: 'Live band performances under the stars.', price: 80 },
      { id: 'p19', name: 'Dance Workshop', description: 'Contemporary and folk fusion session.', price: 120 },
    ],
  },
]

export const pendingVendors: Vendor[] = [
  {
    id: 'v-bookswap',
    name: 'BookSwap Corner',
    category: 'stationery',
    location: 'Hostel Block C',
    address: '0x1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c',
    rating: 0,
    hours: '4:00 PM – 9:00 PM',
    status: 'pending',
    products: [],
  },
  {
    id: 'v-night-cafe',
    name: 'Midnight Maggi Cafe',
    category: 'canteen',
    location: 'Boys Hostel Gate',
    address: '0x0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d',
    rating: 0,
    hours: '8:00 PM – 2:00 AM',
    status: 'pending',
    products: [],
  },
]

export const demoTransactions: Transaction[] = [
  { id: 't1', hash: demoHash(1), type: 'payment', counterparty: 'North Block Canteen', counterpartyAddress: demoVendors[0].address, amount: 45, timestamp: '2026-10-24T08:42:00Z', status: 'confirmed', note: 'Masala Dosa', source: 'demo' },
  { id: 't2', hash: demoHash(2), type: 'reward', counterparty: 'CampusCoin Rewards', counterpartyAddress: '0x0000000000000000000000000000000000000c0c', amount: 25, timestamp: '2026-10-23T16:10:00Z', status: 'confirmed', note: 'TechNova workshop attendance', source: 'demo' },
  { id: 't3', hash: demoHash(3), type: 'sent', counterparty: 'Priya Nair', counterpartyAddress: '0x9f1b3d5a7c9e1f3b5d7a9c1e3f5b7d9a1c3e5f7b', amount: 60, timestamp: '2026-10-23T12:05:00Z', status: 'confirmed', note: 'Split lunch', source: 'demo' },
  { id: 't4', hash: demoHash(4), type: 'payment', counterparty: 'PrintHub Xerox', counterpartyAddress: demoVendors[3].address, amount: 32, timestamp: '2026-10-22T10:30:00Z', status: 'pending', note: 'Assignment printouts', source: 'demo' },
  { id: 't5', hash: demoHash(5), type: 'received', counterparty: 'Rohan Verma', counterpartyAddress: '0x3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f', amount: 100, timestamp: '2026-10-21T19:20:00Z', status: 'confirmed', note: 'Fest pass share', source: 'demo' },
  { id: 't6', hash: demoHash(6), type: 'payment', counterparty: 'Campus Stationers', counterpartyAddress: demoVendors[2].address, amount: 60, timestamp: '2026-10-21T09:15:00Z', status: 'confirmed', note: 'Lab record notebook', source: 'demo' },
  { id: 't7', hash: demoHash(7), type: 'payment', counterparty: 'Green Leaf Juice Bar', counterpartyAddress: demoVendors[1].address, amount: 55, timestamp: '2026-10-20T15:45:00Z', status: 'failed', note: 'Mango smoothie', source: 'demo' },
  { id: 't8', hash: demoHash(8), type: 'reward', counterparty: 'CampusCoin Rewards', counterpartyAddress: '0x0000000000000000000000000000000000000c0c', amount: 50, timestamp: '2026-10-19T11:00:00Z', status: 'confirmed', note: 'Campus clean-up drive', source: 'demo' },
  { id: 't9', hash: demoHash(9), type: 'sent', counterparty: 'Ananya Iyer', counterpartyAddress: '0x7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d', amount: 40, timestamp: '2026-10-18T20:30:00Z', status: 'confirmed', source: 'demo' },
  { id: 't10', hash: demoHash(10), type: 'payment', counterparty: 'TechNova Fest 2026', counterpartyAddress: demoVendors[5].address, amount: 150, timestamp: '2026-10-17T13:00:00Z', status: 'confirmed', note: 'Hackathon entry', source: 'demo' },
  { id: 't11', hash: demoHash(11), type: 'received', counterparty: 'Department Grant', counterpartyAddress: '0x5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e', amount: 300, timestamp: '2026-10-15T09:00:00Z', status: 'confirmed', note: 'Semester allocation', source: 'demo' },
  { id: 't12', hash: demoHash(12), type: 'reward', counterparty: 'CampusCoin Rewards', counterpartyAddress: '0x0000000000000000000000000000000000000c0c', amount: 15, timestamp: '2026-10-14T17:40:00Z', status: 'confirmed', note: 'Library streak — 7 days', source: 'demo' },
]

export const demoSpending7d: ChartPoint[] = [
  { label: 'Fri', value: 40 },
  { label: 'Sat', value: 150 },
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 60 },
  { label: 'Tue', value: 55 },
  { label: 'Wed', value: 32 },
  { label: 'Thu', value: 105 },
]

export const demoRewardActivities: RewardActivity[] = [
  { id: 'r1', title: 'Workshop attendance', description: 'TechNova pre-fest AI workshop', amount: 25, date: '2026-10-23T16:10:00Z', category: 'events' },
  { id: 'r2', title: 'Campus clean-up drive', description: 'NSS sustainability initiative', amount: 50, date: '2026-10-19T11:00:00Z', category: 'sustainability' },
  { id: 'r3', title: 'Library streak', description: '7 consecutive days of library check-ins', amount: 15, date: '2026-10-14T17:40:00Z', category: 'academic' },
  { id: 'r4', title: 'Peer tutoring', description: 'Tutored 3 first-year students in C programming', amount: 40, date: '2026-10-09T14:00:00Z', category: 'community' },
  { id: 'r5', title: 'Blood donation camp', description: 'Red Cross campus drive', amount: 75, date: '2026-10-02T10:00:00Z', category: 'community' },
]

export const demoRewardChallenges: RewardChallenge[] = [
  { id: 'c1', title: 'Library Regular', description: 'Check in at the library 14 days this month.', reward: 30, progress: 9, goal: 14 },
  { id: 'c2', title: 'Event Explorer', description: 'Attend 5 club events this semester.', reward: 60, progress: 3, goal: 5 },
  { id: 'c3', title: 'Green Commuter', description: 'Use campus cycles for 20 rides.', reward: 40, progress: 17, goal: 20 },
]

export const demoVendorProfile = {
  vendor: demoVendors[0],
  balance: 12480,
  todaySales: 2340,
  todayOrders: 58,
  avgOrder: 40.3,
}

export const demoVendorReceipts: Transaction[] = [
  { id: 'vr1', hash: demoHash(101), type: 'received', counterparty: 'Aarav Sharma', counterpartyAddress: demoStudent.address, amount: 45, timestamp: '2026-10-24T08:42:00Z', status: 'confirmed', note: 'Masala Dosa', source: 'demo' },
  { id: 'vr2', hash: demoHash(102), type: 'received', counterparty: 'Meera Pillai', counterpartyAddress: '0x2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b', amount: 80, timestamp: '2026-10-24T08:31:00Z', status: 'confirmed', note: 'Veg Thali', source: 'demo' },
  { id: 'vr3', hash: demoHash(103), type: 'received', counterparty: 'Kabir Singh', counterpartyAddress: '0x4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a', amount: 20, timestamp: '2026-10-24T08:12:00Z', status: 'pending', note: 'Filter Coffee', source: 'demo' },
  { id: 'vr4', hash: demoHash(104), type: 'received', counterparty: 'Sneha Reddy', counterpartyAddress: '0x6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d', amount: 125, timestamp: '2026-10-24T07:58:00Z', status: 'confirmed', note: 'Thali + Coffee', source: 'demo' },
  { id: 'vr5', hash: demoHash(105), type: 'received', counterparty: 'Arjun Mehta', counterpartyAddress: '0x8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e', amount: 45, timestamp: '2026-10-24T07:40:00Z', status: 'confirmed', note: 'Masala Dosa', source: 'demo' },
]

export const demoVendorHourlySales: ChartPoint[] = [
  { label: '8a', value: 310 },
  { label: '10a', value: 180 },
  { label: '12p', value: 720 },
  { label: '2p', value: 460 },
  { label: '4p', value: 290 },
  { label: '6p', value: 380 },
]

export const demoAdminStats = {
  totalSupply: 1_000_000,
  circulating: 412_650,
  registeredWallets: 2348,
  activeVendors: demoVendors.length,
  pendingVendors: pendingVendors.length,
  txLast24h: 1872,
}

export const demoAdminActivity: Transaction[] = [
  { id: 'a1', hash: demoHash(201), type: 'reward', counterparty: 'NSS Volunteers (42 wallets)', counterpartyAddress: '0x0000000000000000000000000000000000000c0c', amount: 2100, timestamp: '2026-10-24T07:00:00Z', status: 'confirmed', note: 'Clean-up drive batch', source: 'demo' },
  { id: 'a2', hash: demoHash(202), type: 'sent', counterparty: 'CSE Dept — Semester grant', counterpartyAddress: '0x5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e', amount: 45000, timestamp: '2026-10-23T09:00:00Z', status: 'confirmed', source: 'demo' },
  { id: 'a3', hash: demoHash(203), type: 'payment', counterparty: 'TechNova Fest 2026', counterpartyAddress: demoVendors[5].address, amount: 18450, timestamp: '2026-10-22T18:00:00Z', status: 'confirmed', note: 'Daily vendor settlement', source: 'demo' },
  { id: 'a4', hash: demoHash(204), type: 'sent', counterparty: 'ECE Dept — Semester grant', counterpartyAddress: '0x9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c', amount: 38000, timestamp: '2026-10-22T09:00:00Z', status: 'pending', source: 'demo' },
]
