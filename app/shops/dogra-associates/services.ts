export interface ServiceItem { id: string; name: string; description?: string; price?: string; note?: string; category: ServiceCategoryKey }
export type ServiceCategoryKey = 'incomeTax' | 'gstServices' | 'businessRegistration' | 'auditCompliance' | 'financialAdvisory' | 'consultation'
function serviceItem(id: string, name: string, category: ServiceCategoryKey, description?: string, price?: string, note?: string): ServiceItem { return { id, name, category, description, price, note } }
export interface ServiceCategoryConfig { name: string; shortDescription: string; icon: string; image: string; items: ServiceItem[] }
const categoryImages: Record<ServiceCategoryKey, string> = {
  incomeTax: '/vastukar/service-architecture.jpg', gstServices: '/vastukar/service-interiors.jpg', businessRegistration: '/vastukar/service-turnkey.jpg', auditCompliance: '/vastukar/service-planning.jpg', financialAdvisory: '/vastukar/service-renovation.jpg', consultation: '/vastukar/service-consultation.jpg',
}
export const serviceCategories: Record<ServiceCategoryKey, ServiceCategoryConfig> = {
  incomeTax: { name: 'Architecture Design', shortDescription: 'Purposeful planning for residential, commercial and institutional spaces.', icon: '✏️', image: categoryImages.incomeTax, items: [
    serviceItem('arch-1', 'Residential Architecture', 'incomeTax', 'Homes, villas, apartments and group housing designed around daily life.'),
    serviceItem('arch-2', 'Commercial Architecture', 'incomeTax', 'Efficient, distinctive workplaces, retail and hospitality spaces.'),
    serviceItem('arch-3', 'Institutional Architecture', 'incomeTax', 'Thoughtful civic, educational and public-use environments.'),
  ]},
  gstServices: { name: 'Interior Design', shortDescription: 'Cohesive interiors balancing function, material and character.', icon: '◫', image: categoryImages.gstServices, items: [
    serviceItem('int-1', 'Residential Interiors', 'gstServices', 'Warm, practical interiors tailored to your taste and routines.'),
    serviceItem('int-2', 'Commercial Interiors', 'gstServices', 'Brand-led interiors designed for customer and team experience.'),
    serviceItem('int-3', 'Space & Furniture Planning', 'gstServices', 'Layouts, material palettes, lighting and custom furniture direction.'),
  ]},
  businessRegistration: { name: 'Turnkey Projects', shortDescription: 'One coordinated team from concept through final handover.', icon: '🔑', image: categoryImages.businessRegistration, items: [
    serviceItem('turn-1', 'Design & Build', 'businessRegistration', 'Integrated architecture, interiors and on-site execution.'),
    serviceItem('turn-2', 'Site Coordination', 'businessRegistration', 'Vendor, material and progress coordination across the project.'),
    serviceItem('turn-3', 'Complete Handover', 'businessRegistration', 'Detail-focused delivery of a finished, ready-to-use space.'),
  ]},
  auditCompliance: { name: 'Project Planning', shortDescription: 'Clear drawings, approvals and technical coordination before execution.', icon: '📐', image: categoryImages.auditCompliance, items: [
    serviceItem('plan-1', 'Concept Planning', 'auditCompliance', 'Site-led concepts shaped by context, requirement and budget.'),
    serviceItem('plan-2', 'Working Drawings', 'auditCompliance', 'Detailed architectural and coordination drawings for execution.'),
    serviceItem('plan-3', '3D Visualisation', 'auditCompliance', 'Visual direction to align design decisions before construction.'),
  ]},
  financialAdvisory: { name: 'Renovation', shortDescription: 'Thoughtful upgrades and adaptive redesign for existing spaces.', icon: '🏗️', image: categoryImages.financialAdvisory, items: [
    serviceItem('reno-1', 'Home Upgrade', 'financialAdvisory', 'Practical spatial and material upgrades for existing homes.'),
    serviceItem('reno-2', 'Office Renovation', 'financialAdvisory', 'Workplace transformation planned around people, brand and operations.'),
    serviceItem('reno-3', 'Adaptive Redesign', 'financialAdvisory', 'Smart reuse and transformation of existing spaces.'),
  ]},
  consultation: { name: 'Consultation', shortDescription: 'Clear early-stage guidance for scope, design direction and budget.', icon: '💬', image: categoryImages.consultation, items: [
    serviceItem('consult-1', 'Project Consultation', 'consultation', 'A focused discussion around your site, needs, priorities and next steps.'),
    serviceItem('consult-2', 'Design Guidance', 'consultation', 'Professional direction for planning, interiors, materials and execution.'),
    serviceItem('consult-3', 'Budget & Scope Discussion', 'consultation', 'Align project ambition, deliverables and budget before design begins.'),
  ]},
}
export const servicesPreviewCards = [
  { key: 'taxGst' as const, name: 'Architecture Design', shortDescription: 'Residential, commercial and institutional planning.', icon: '✏️', image: categoryImages.incomeTax, href: '/services?cat=incomeTax' },
  { key: 'compliance' as const, name: 'Interior Design', shortDescription: 'Functional interiors with a distinctive material language.', icon: '◫', image: categoryImages.gstServices, href: '/services?cat=gstServices' },
  { key: 'audit' as const, name: 'Turnkey Projects', shortDescription: 'Coordinated design, execution and complete handover.', icon: '🔑', image: categoryImages.businessRegistration, href: '/services?cat=businessRegistration' },
  { key: 'planning' as const, name: 'Project Planning', shortDescription: 'Concepts, drawings, visualisation and site guidance.', icon: '📐', image: categoryImages.auditCompliance, href: '/services?cat=auditCompliance' },
] as const
