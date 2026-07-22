// Shop Configuration for Vastukar Architects

import { PUBLIC_SITE_URL } from '../../lib/public-site-url'

export type ContactPersonLabel = 'Mobile' | 'Studio'

export interface ContactPerson {
  label: ContactPersonLabel
  phoneE164: string
  phoneDisplay: string
  whatsappE164: string
}

export const shopConfig = {
  name: 'Vastukar Architects',
  tagline: 'Architecture • Interior Design',
  taglineShort: 'Designing Spaces That Belong.',
  serviceTagline: 'Planning • Interiors • Turnkey Projects • Jammu',
  snapshotLocationLine: 'Railway Rd, Guru Nanak Nagar, Jammu',
  snapshotServicesLine:
    'Architecture • Interior Design • Turnkey Projects • Planning • Consultation • Execution',
  snapshotHours: 'Mon-Sat 10:00 AM - 7:00 PM',
  url: PUBLIC_SITE_URL,
  cardType: 'B2C' as const,
  keywordBadges: ['Creative Design', 'Turnkey Solutions'] as string[],

  contact: {
    phones: ['9419181622', '7006735726'],
    email: 'briji1712@gmail.com',
    address: 'First Floor, AM Medicos, Railway Rd, Guru Nanak Nagar, Jammu, J&K 180004',
    locationLine: 'Railway Rd, Guru Nanak Nagar, Jammu',
    mapQuery: 'Vastukar Architects First Floor AM Medicos Railway Road Guru Nanak Nagar Jammu 180004',
    storeHours: 'Mon-Sat 10:00 AM - 7:00 PM',
    storeHoursStatus: 'Studio Hours',
    officePhone: '7006735726',
    clientPhone: '9419181622',
    clientPhoneE164: '919419181622',
    officePhoneE164: '917006735726',
  },

  contactPersons: [
    { label: 'Mobile' as ContactPersonLabel, phoneE164: '919419181622', phoneDisplay: '+91 94191 81622', whatsappE164: '919419181622' },
    { label: 'Studio' as ContactPersonLabel, phoneE164: '917006735726', phoneDisplay: '+91 70067 35726', whatsappE164: '919419181622' },
  ] as ContactPerson[],

  whatsapp: {
    defaultPhone: '9419181622',
    defaultMessage: 'Hi Vastukar Architects, I would like to discuss my project and book a consultation.',
    showSelector: false,
    selectorPersons: ['Mobile'] as ContactPersonLabel[],
  },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61583116090889',
    instagram: 'https://www.instagram.com/vastukararchitect/',
    instagramJammu: '',
    twitter: '',
    linkedin: '',
    zomato: '',
  },

  trustBadges: ['Creative Design', 'Turnkey Solutions'] as string[],
  brands: [
    { name: 'Residential Design', tagline: '', logo: '' },
    { name: 'Commercial Projects', tagline: '', logo: '' },
    { name: 'Institutional Design', tagline: '', logo: '' },
    { name: 'Interior Design', tagline: '', logo: '' },
    { name: 'Turnkey Execution', tagline: '', logo: '' },
  ],

  about: {
    title: 'Welcome to Vastukar',
    shortDescription: 'Architecture, interiors and turnkey project solutions for homes, commercial spaces and institutions. From thoughtful planning to precise execution, every space is designed with clarity, character and purpose.',
  },
  menuUrl: '/services',

  payment: {
    upiId: 'vastukar.demo@upi',
    upiId2: '',
    upiName: 'Vastukar Architects',
    upiQrImageUrl: '',
    scannerImage: '/vastukar/demo-payment-qr.png',
    bank: { bankName: 'Demo Bank', accountNumberMasked: 'XXXX XXXX 1234', ifsc: 'DEMO0001234', accountHolder: 'VASTUKAR ARCHITECTS' },
    showScanner: true,
    showDownloadQR: true,
  },

  google: {
    placeId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJ0WlgzNWFHjkRNMeCKOoknOY',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJ0WlgzNWFHjkRNMeCKOoknOY',
    reviewsUrl: 'https://search.google.com/local/reviews?placeid=ChIJ0WlgzNWFHjkRNMeCKOoknOY',
  },

  seo: {
    title: 'Vastukar Architects | Architecture, Interiors & Turnkey Projects in Jammu',
    description: 'Architecture, interior design, project planning and turnkey solutions by Vastukar Architects in Jammu.',
    keywords: 'Vastukar Architects Jammu, architect Jammu, interior designer Jammu, turnkey projects Jammu, architectural planning',
  },

  credits: { designer: 'RepixelX Studio', designerUrl: 'https://repixelx.com' },
  sections: { showAbout: true, showMenu: false, showServices: true, showGallery: true, showReviews: true, showSocialConnect: true, showContactCard: true, showFooter: true },
  assets: { logo: '/vastukar/vastukar-logo-new.png', cover: '/vastukar/hero-skyline.png', gallery: '/vastukar/', qr: '/vastukar/demo-payment-qr.png' },
  catalog: [] as Array<{ id: string; title: string; description: string; logo: string; details: string; images: string[] }>,
  brochures: [] as Array<{ href: string; title: string }>,
}

export type ShopConfig = typeof shopConfig
