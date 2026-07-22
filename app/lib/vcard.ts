export interface VCardData {
  name: string
  organization: string
  title?: string
  phones: string[]
  email: string
  address: string
  website: string
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `ORG:${data.organization}`,
  ]

  if (data.title) {
    lines.push(`TITLE:${data.title}`)
  }

  data.phones.forEach((phone, index) => {
    const type = index === 0 ? 'WORK' : 'VOICE'
    const cleaned = phone.replace(/\D/g, '')
    lines.push(`TEL;TYPE=${type}:+91${cleaned}`)
  })

  lines.push(`EMAIL;TYPE=INTERNET:${data.email}`)
  
  // Format address for vCard
  lines.push(`ADR;TYPE=WORK:;;${data.address.replace(/,/g, ';')};;`)
  lines.push(`URL:${data.website}`)
  
  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export function downloadVCard(vcard: string, filename: string): void {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

