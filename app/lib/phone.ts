export function formatPhone(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  
  return phone
}

export function getTelLink(phone: string): string {
  // If phone already includes country code (starts with 91), use as is
  // Otherwise, assume it's a 10-digit number and add 91
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `tel:+${cleaned}`
  }
  if (cleaned.length === 10) {
    return `tel:+91${cleaned}`
  }
  return `tel:+${cleaned}`
}

export function getWhatsAppLink(phoneE164: string, message: string): string {
  // phoneE164 should be in format: 919419141495 (no +, no spaces)
  const cleaned = phoneE164.replace(/\D/g, '')
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

// Format phone for display (e.g., "94191 41495")
export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

