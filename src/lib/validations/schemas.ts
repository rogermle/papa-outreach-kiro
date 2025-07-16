import { z } from "zod";

// User validation schemas
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export const flightInfoSchema = z.object({
  airline: z.string().min(1, "Airline is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  arrivalTime: z.date(),
  departureTime: z.date(),
  status: z.enum(["on-time", "delayed", "cancelled"]).optional(),
});

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  pilotTrainingStatus: z
    .enum(["Initial(PPL, IR, Comm)", "CFI/CFII", "Airline Pilot-ATP"])
    .optional(),
  locationType: z.enum(["local", "traveling"]).optional(),
  canProvidePickup: z.boolean().optional(),
  needsTravelVoucher: z.boolean().optional(),
  hotelInfo: z.string().optional(),
  shippingAddress: addressSchema.optional(),
});

export const volunteerProfileFormSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
  pilotInfo: z.object({
    trainingStatus: z.enum([
      "Initial(PPL, IR, Comm)",
      "CFI/CFII",
      "Airline Pilot-ATP",
    ]),
    location: z.enum(["local", "traveling"]),
  }),
  logistics: z.object({
    canProvidePickup: z.boolean().optional(),
    needsTravelVoucher: z.boolean().optional(),
    hotelInfo: z.string().optional(),
    flightInfo: flightInfoSchema.optional(),
    shippingAddress: addressSchema.optional(),
  }),
});

// Event validation schemas
export const timeSlotSchema = z.object({
  date: z.date(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

export const eventFormSchema = z
  .object({
    title: z.string().min(1, "Event title is required"),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    location: z.object({
      address: z.string().min(1, "Location address is required"),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    }),
    timeSlots: z
      .array(timeSlotSchema)
      .min(1, "At least one time slot is required"),
    capacity: z.number().min(1, "Event capacity must be at least 1"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Checklist validation schemas
export const checklistItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Checklist item title is required"),
  description: z.string(),
  dueDate: z
    .enum(["event-creation", "week-before", "day-before", "after-event"])
    .optional(),
  required: z.boolean(),
  order: z.number().min(0),
});

export const checklistTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  role: z.enum(["manager", "lead", "volunteer"]),
  items: z
    .array(checklistItemSchema)
    .min(1, "At least one checklist item is required"),
  eventType: z.string().optional(),
});

export const checklistProgressSchema = z.object({
  templateId: z.string(),
  completedItems: z.array(z.string()),
});

// Package tracking validation schemas
export const packageTrackingSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
  fromEventId: z.string().optional(),
  toEventId: z.string().optional(),
  recipientUserId: z.string().min(1, "Recipient is required"),
  status: z.string().default("shipped"),
  estimatedDelivery: z.date().optional(),
  actualDelivery: z.date().optional(),
  notes: z.string().optional(),
});

// File upload validation schemas
export const fileUploadSchema = z
  .object({
    file: z.instanceof(File),
    eventId: z.string().min(1, "Event ID is required"),
  })
  .refine(
    (data) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      return allowedTypes.includes(data.file.type);
    },
    {
      message: "File type not allowed",
      path: ["file"],
    }
  )
  .refine(
    (data) => data.file.size <= 10 * 1024 * 1024, // 10MB
    {
      message: "File size must be less than 10MB",
      path: ["file"],
    }
  );

// After action report validation schemas
export const afterActionReportSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  reportData: z.record(z.unknown()),
});

// Report filters validation schemas
export const reportFiltersSchema = z.object({
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .refine((data) => data.end >= data.start, {
      message: "End date must be after start date",
      path: ["end"],
    }),
  eventTypes: z.array(z.string()).optional(),
  volunteerRoles: z.array(z.enum(["manager", "lead", "volunteer"])).optional(),
  trainingStatus: z.array(z.string()).optional(),
  location: z.array(z.enum(["local", "traveling"])).optional(),
});

// Volunteer signup validation schemas
export const volunteerSignupSchema = z.object({
  timeSlotId: z.string().min(1, "Time slot is required"),
  eventId: z.string().min(1, "Event ID is required"),
  flightInfo: flightInfoSchema.optional(),
});

// API response validation schemas
export const apiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// Export type inference helpers
export type AddressInput = z.infer<typeof addressSchema>;
export type FlightInfoInput = z.infer<typeof flightInfoSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type VolunteerProfileFormInput = z.infer<
  typeof volunteerProfileFormSchema
>;
export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type ChecklistItemInput = z.infer<typeof checklistItemSchema>;
export type ChecklistTemplateInput = z.infer<typeof checklistTemplateSchema>;
export type ChecklistProgressInput = z.infer<typeof checklistProgressSchema>;
export type PackageTrackingInput = z.infer<typeof packageTrackingSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type AfterActionReportInput = z.infer<typeof afterActionReportSchema>;
export type ReportFiltersInput = z.infer<typeof reportFiltersSchema>;
export type VolunteerSignupInput = z.infer<typeof volunteerSignupSchema>;
