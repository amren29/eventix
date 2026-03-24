// ─── Event ────────────────────────────────────────────────────────────────────
export type EventStatus = "draft" | "published" | "cancelled" | "past";
export type EventVisibility = "public" | "unlisted" | "private";

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerUrl?: string;
  category: string;
  tags: string[];
  status: EventStatus;
  visibility: EventVisibility;
  startDate: string;
  endDate: string;
  timezone: string;
  isOnline: boolean;
  venue?: Venue;
  organizerId: string;
  ticketTypes: TicketType[];
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  country: string;
  lat?: number;
  lng?: number;
}

// ─── Ticket ───────────────────────────────────────────────────────────────────
export type TicketPriceType = "paid" | "free" | "donation";
export type TicketStatus = "available" | "sold_out" | "sale_ended" | "upcoming";

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  priceType: TicketPriceType;
  price: number; // in cents
  currency: string;
  quantity: number | null; // null = unlimited
  quantitySold: number;
  saleStartDate?: string;
  saleEndDate?: string;
  isHidden: boolean;
  status: TicketStatus;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "paid" | "refunded" | "cancelled";

export interface Order {
  id: string;
  reference: string; // EVT-2026-XXXXX
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  tickets: OrderTicket[];
  subtotal: number;  // cents
  serviceFee: number; // cents
  total: number;     // cents
  currency: string;
  status: OrderStatus;
  promoCode?: string;
  discount: number;  // cents
  createdAt: string;
}

export interface OrderTicket {
  id: string;
  orderId: string;
  ticketTypeId: string;
  ticketTypeName: string;
  attendeeName: string;
  attendeeEmail: string;
  qrCode: string;
  checkedInAt?: string;
  checkedInGate?: string;
}

// ─── User / Auth ──────────────────────────────────────────────────────────────
export type UserRole = "platform_admin" | "organizer" | "staff" | "attendee";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
}

// ─── Organization ─────────────────────────────────────────────────────────────
export type PlanType = "free" | "pro" | "enterprise";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  plan: PlanType;
  ownerId: string;
  createdAt: string;
}

// ─── Promo Code ───────────────────────────────────────────────────────────────
export type DiscountType = "percentage" | "fixed" | "free";

export interface PromoCode {
  id: string;
  eventId?: string; // null = applies to all events
  code: string;
  discountType: DiscountType;
  discountValue: number; // percent or cents
  maxUses: number | null;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface SalesSummary {
  grossRevenue: number;
  netRevenue: number;
  ticketsSold: number;
  ordersCount: number;
  conversionRate: number;
  checkInRate: number;
  periodStart: string;
  periodEnd: string;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  tickets: number;
}
