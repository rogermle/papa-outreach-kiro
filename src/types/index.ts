// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "manager" | "lead" | "volunteer";
  pilotTrainingStatus?:
    | "Initial(PPL, IR, Comm)"
    | "CFI/CFII"
    | "Airline Pilot-ATP";
  locationType?: "local" | "traveling";
  canProvidePickup?: boolean;
  needsTravelVoucher?: boolean;
  hotelInfo?: string;
  shippingAddress?: Address;
  discordProfile?: Record<string, unknown>;
  googleProfile?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "manager" | "lead" | "volunteer";
  name: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (provider: "google" | "discord") => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  locationAddress: string;
  locationCoordinates?: [number, number];
  capacity: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  timeSlots?: TimeSlot[];
  attachments?: EventAttachment[];
}

export interface TimeSlot {
  id: string;
  eventId: string;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  volunteers?: VolunteerSignup[];
  createdAt: Date;
}

export interface VolunteerSignup {
  id: string;
  userId: string;
  timeSlotId: string;
  eventId: string;
  flightInfo?: FlightInfo;
  signedUpAt: Date;
  user?: User;
}

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  arrivalTime: Date;
  departureTime: Date;
  status?: "on-time" | "delayed" | "cancelled";
}

// Checklist Types
export interface ChecklistTemplate {
  id: string;
  name: string;
  role: "manager" | "lead" | "volunteer";
  items: ChecklistItem[];
  createdBy: string;
  createdAt: Date;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  dueDate?: "event-creation" | "week-before" | "day-before" | "after-event";
  required: boolean;
  order: number;
}

export interface ChecklistProgress {
  id: string;
  userId: string;
  eventId: string;
  templateId: string;
  completedItems: string[];
  createdAt: Date;
}

// Package Tracking Types
export interface PackageTracking {
  id: string;
  trackingNumber: string;
  fromEventId?: string;
  toEventId?: string;
  recipientUserId: string;
  status: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  recipient?: User;
  fromEvent?: Event;
  toEvent?: Event;
}

// File and Attachment Types
export interface EventAttachment {
  id: string;
  eventId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
}

// Report Types
export interface AfterActionReport {
  id: string;
  eventId: string;
  submittedBy: string;
  reportData: Record<string, unknown>;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  status: "submitted" | "reviewed" | "archived";
  event?: Event;
  submitter?: User;
  reviewer?: User;
}

// Form Types
export interface EventForm {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    address: string;
    coordinates?: [number, number];
  };
  timeSlots: Omit<TimeSlot, "id" | "eventId" | "createdAt" | "volunteers">[];
  capacity: number;
  attachments?: File[];
}

export interface VolunteerProfileForm {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
  };
  pilotInfo: {
    trainingStatus: "Initial(PPL, IR, Comm)" | "CFI/CFII" | "Airline Pilot-ATP";
    location: "local" | "traveling";
  };
  logistics: {
    canProvidePickup?: boolean;
    needsTravelVoucher?: boolean;
    hotelInfo?: string;
    flightInfo?: FlightInfo;
    shippingAddress?: Address;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Notification Types
export interface NotificationScheduler {
  scheduleEventReminders: (eventId: string) => void;
  scheduleChecklistReminders: (userId: string, checklistId: string) => void;
  sendFlightDelayAlert: (volunteerId: string, flightInfo: FlightInfo) => void;
  sendEventUpdate: (eventId: string, changes: Record<string, unknown>) => void;
}

// Report Filter Types
export interface ReportFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  eventTypes: string[];
  volunteerRoles: ("manager" | "lead" | "volunteer")[];
  trainingStatus: string[];
  location: ("local" | "traveling")[];
}

// Database Types (matching Supabase schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "createdAt" | "updatedAt">;
        Update: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>;
      };
      time_slots: {
        Row: TimeSlot;
        Insert: Omit<TimeSlot, "id" | "createdAt">;
        Update: Partial<Omit<TimeSlot, "id" | "createdAt">>;
      };
      volunteer_signups: {
        Row: VolunteerSignup;
        Insert: Omit<VolunteerSignup, "id" | "signedUpAt">;
        Update: Partial<Omit<VolunteerSignup, "id" | "signedUpAt">>;
      };
      checklist_templates: {
        Row: ChecklistTemplate;
        Insert: Omit<ChecklistTemplate, "id" | "createdAt">;
        Update: Partial<Omit<ChecklistTemplate, "id" | "createdAt">>;
      };
      checklist_progress: {
        Row: ChecklistProgress;
        Insert: Omit<ChecklistProgress, "id" | "createdAt">;
        Update: Partial<Omit<ChecklistProgress, "id" | "createdAt">>;
      };
      package_tracking: {
        Row: PackageTracking;
        Insert: Omit<PackageTracking, "id" | "createdAt" | "updatedAt">;
        Update: Partial<
          Omit<PackageTracking, "id" | "createdAt" | "updatedAt">
        >;
      };
      event_attachments: {
        Row: EventAttachment;
        Insert: Omit<EventAttachment, "id" | "uploadedAt">;
        Update: Partial<Omit<EventAttachment, "id" | "uploadedAt">>;
      };
      after_action_reports: {
        Row: AfterActionReport;
        Insert: Omit<AfterActionReport, "id" | "submittedAt">;
        Update: Partial<Omit<AfterActionReport, "id" | "submittedAt">>;
      };
    };
  };
}

// Utility Types
export type UserRole = "manager" | "lead" | "volunteer";
export type PilotTrainingStatus =
  | "Initial(PPL, IR, Comm)"
  | "CFI/CFII"
  | "Airline Pilot-ATP";
export type LocationType = "local" | "traveling";
export type FlightStatus = "on-time" | "delayed" | "cancelled";
export type ReportStatus = "submitted" | "reviewed" | "archived";
export type ChecklistDueDate =
  | "event-creation"
  | "week-before"
  | "day-before"
  | "after-event";

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  filters?: Record<string, unknown>;
  pagination?: PaginationParams;
}

// Calendar Integration Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
}

export interface CalendarIntegration {
  createEvent: (event: CalendarEvent) => Promise<string>;
  updateEvent: (
    eventId: string,
    event: Partial<CalendarEvent>
  ) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  generateIcsFile: (event: CalendarEvent) => string;
}

// Email Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface EmailNotification {
  to: string[];
  template: string;
  variables: Record<string, unknown>;
  scheduledFor?: Date;
}

// External API Types
export interface USPSTrackingResponse {
  trackingNumber: string;
  status: string;
  estimatedDelivery?: Date;
  lastUpdate: Date;
  events: Array<{
    date: Date;
    status: string;
    location?: string;
  }>;
}

export interface FlightTrackingResponse {
  flightNumber: string;
  airline: string;
  status: FlightStatus;
  scheduledDeparture: Date;
  actualDeparture?: Date;
  scheduledArrival: Date;
  actualArrival?: Date;
  delay?: number;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  loading: boolean;
  error?: string;
}

// Hook Return Types
export type UseAuthReturn = AuthContextType;

export interface UseEventsReturn extends LoadingState {
  events: Event[];
  createEvent: (event: EventForm) => Promise<Event>;
  updateEvent: (id: string, event: Partial<EventForm>) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
  getEvent: (id: string) => Promise<Event>;
}

export interface UseVolunteerSignupsReturn extends LoadingState {
  signups: VolunteerSignup[];
  signUp: (signup: {
    timeSlotId: string;
    eventId: string;
    flightInfo?: FlightInfo;
  }) => Promise<VolunteerSignup>;
  cancelSignup: (id: string) => Promise<void>;
  getUserSignups: (userId: string) => Promise<VolunteerSignup[]>;
}

// Re-export validation input types
export type {
  AddressInput,
  FlightInfoInput,
  UserProfileInput,
  VolunteerProfileFormInput,
  TimeSlotInput,
  EventFormInput,
  ChecklistItemInput,
  ChecklistTemplateInput,
  ChecklistProgressInput,
  PackageTrackingInput,
  FileUploadInput,
  AfterActionReportInput,
  ReportFiltersInput,
  VolunteerSignupInput,
} from "../lib/validations/schemas";
