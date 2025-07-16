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
  createdAt: Date;
  updatedAt: Date;
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
