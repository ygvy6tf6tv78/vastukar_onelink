export type Language = 'en'

export const translations = {
  en: {
    // Hero Section
    tapToFlip: 'Tap to Flip',
    tapToReturn: 'Tap to Return',
    callNow: 'Call Now',
    whatsapp: 'WhatsApp',
    getDirections: 'Get Directions',
    saveContact: 'Save Contact',
    openPayment: 'Payment',
    bookAppointment: 'Book Now',
    emailUs: 'Email Us',
    officeLocation: 'Location',
    taxTools: 'Tax Tools',
    ourServices: 'Our Services',

    // Business Info
    businessHours: 'Business Hours',
    address: 'Address',
    contactUs: 'Contact Us',
    
    // Payment
    securePayment: 'Secure Payment',
    secureEncrypted: '100% Secure & Encrypted',
    payViaUPI: 'Pay via UPI',
    payViaPaytm: 'Paytm',
    payViaGooglePay: 'Google Pay',
    payViaPhonePe: 'PhonePe',
    transferViaBank: 'Transfer via Bank',
    backToDetails: 'Back to Details',
    scanToPay: 'Scan to Pay',
    securePaymentGateway: 'Secure Payment Gateway',
    worksWith: 'Works with GPay, PhonePe, Paytm & more',
    developedBy: 'Developed by',
    
    // Bank Details
    bankDetails: 'Bank Details',
    accountHolderName: 'Account Holder Name',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    ifscCode: 'IFSC Code',
    copy: 'Copy',
    copied: 'Copied!',
    copyAllDetails: 'Copy All Details',
    close: 'Close',
    
    // Sections
    aboutUs: 'About Us',
    ourProducts: 'Our Products',
    catalog: 'Catalog',
    brochures: 'Brochures',
    gallery: 'Gallery',
    getInTouch: 'Get in Touch',
    followUs: 'Follow Us',
    viewMore: 'View More',
    open: 'Open',
    viewPDF: 'View PDF',
    downloadPDF: 'Download PDF',
    
    // Contact
    phone: 'Phone',
    email: 'Email',
    location: 'Location',
    
    // Footer
    allRightsReserved: 'All rights reserved',
  },
}

export const getTranslation = (key: string, lang: Language = 'en'): string => {
  return translations[lang][key as keyof typeof translations.en] || key
}

