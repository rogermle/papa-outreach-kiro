import { z } from "zod";
import {
  addressSchema,
  flightInfoSchema,
  userProfileSchema,
  volunteerProfileFormSchema,
  timeSlotSchema,
  eventFormSchema,
  checklistItemSchema,
  checklistTemplateSchema,
  checklistProgressSchema,
  packageTrackingSchema,
  fileUploadSchema,
  afterActionReportSchema,
  reportFiltersSchema,
  volunteerSignupSchema,
  apiResponseSchema,
} from "../schemas";

describe("Address Schema", () => {
  it("should validate a complete address", () => {
    const validAddress = {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    };

    const result = addressSchema.safeParse(validAddress);
    expect(result.success).toBe(true);
  });

  it("should reject address with missing required fields", () => {
    const invalidAddress = {
      street: "123 Main St",
      city: "",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    };

    const result = addressSchema.safeParse(invalidAddress);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("City is required");
    }
  });

  it("should reject address with invalid zip code", () => {
    const invalidAddress = {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "123",
      country: "USA",
    };

    const result = addressSchema.safeParse(invalidAddress);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Valid zip code is required");
    }
  });
});

describe("Flight Info Schema", () => {
  it("should validate complete flight information", () => {
    const validFlightInfo = {
      airline: "United Airlines",
      flightNumber: "UA123",
      arrivalTime: new Date("2024-12-01T10:00:00Z"),
      departureTime: new Date("2024-12-01T08:00:00Z"),
      status: "on-time" as const,
    };

    const result = flightInfoSchema.safeParse(validFlightInfo);
    expect(result.success).toBe(true);
  });

  it("should validate flight info without optional status", () => {
    const validFlightInfo = {
      airline: "Delta",
      flightNumber: "DL456",
      arrivalTime: new Date("2024-12-01T10:00:00Z"),
      departureTime: new Date("2024-12-01T08:00:00Z"),
    };

    const result = flightInfoSchema.safeParse(validFlightInfo);
    expect(result.success).toBe(true);
  });

  it("should reject flight info with missing required fields", () => {
    const invalidFlightInfo = {
      airline: "",
      flightNumber: "UA123",
      arrivalTime: new Date("2024-12-01T10:00:00Z"),
      departureTime: new Date("2024-12-01T08:00:00Z"),
    };

    const result = flightInfoSchema.safeParse(invalidFlightInfo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Airline is required");
    }
  });
});

describe("User Profile Schema", () => {
  it("should validate complete user profile", () => {
    const validProfile = {
      name: "John Doe",
      phone: "+1-555-123-4567",
      pilotTrainingStatus: "CFI/CFII" as const,
      locationType: "local" as const,
      canProvidePickup: true,
      needsTravelVoucher: false,
      hotelInfo: "Marriott Downtown",
      shippingAddress: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        country: "USA",
      },
    };

    const result = userProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it("should validate minimal user profile", () => {
    const minimalProfile = {
      name: "Jane Smith",
    };

    const result = userProfileSchema.safeParse(minimalProfile);
    expect(result.success).toBe(true);
  });

  it("should reject profile with empty name", () => {
    const invalidProfile = {
      name: "",
    };

    const result = userProfileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });
});

describe("Volunteer Profile Form Schema", () => {
  it("should validate complete volunteer profile form", () => {
    const validForm = {
      personalInfo: {
        name: "John Pilot",
        email: "john@example.com",
        phone: "5551234567",
      },
      pilotInfo: {
        trainingStatus: "Airline Pilot-ATP" as const,
        location: "traveling" as const,
      },
      logistics: {
        canProvidePickup: false,
        needsTravelVoucher: true,
        hotelInfo: "Holiday Inn",
        flightInfo: {
          airline: "American Airlines",
          flightNumber: "AA789",
          arrivalTime: new Date("2024-12-01T14:00:00Z"),
          departureTime: new Date("2024-12-01T12:00:00Z"),
        },
        shippingAddress: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
        },
      },
    };

    const result = volunteerProfileFormSchema.safeParse(validForm);
    expect(result.success).toBe(true);
  });

  it("should reject form with invalid email", () => {
    const invalidForm = {
      personalInfo: {
        name: "John Pilot",
        email: "invalid-email",
        phone: "5551234567",
      },
      pilotInfo: {
        trainingStatus: "CFI/CFII" as const,
        location: "local" as const,
      },
      logistics: {},
    };

    const result = volunteerProfileFormSchema.safeParse(invalidForm);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Valid email is required");
    }
  });
});

describe("Time Slot Schema", () => {
  it("should validate valid time slot", () => {
    const validTimeSlot = {
      date: new Date("2024-12-01"),
      startTime: "09:00",
      endTime: "17:00",
      capacity: 10,
    };

    const result = timeSlotSchema.safeParse(validTimeSlot);
    expect(result.success).toBe(true);
  });

  it("should reject time slot with invalid time format", () => {
    const invalidTimeSlot = {
      date: new Date("2024-12-01"),
      startTime: "9:00 AM",
      endTime: "17:00",
      capacity: 10,
    };

    const result = timeSlotSchema.safeParse(invalidTimeSlot);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid time format");
    }
  });

  it("should reject time slot with zero capacity", () => {
    const invalidTimeSlot = {
      date: new Date("2024-12-01"),
      startTime: "09:00",
      endTime: "17:00",
      capacity: 0,
    };

    const result = timeSlotSchema.safeParse(invalidTimeSlot);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Capacity must be at least 1"
      );
    }
  });
});

describe("Event Form Schema", () => {
  it("should validate complete event form", () => {
    const validEvent = {
      title: "Aviation Career Fair",
      description: "Annual career fair for pilots",
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-02"),
      location: {
        address: "123 Airport Blvd, San Francisco, CA",
        coordinates: [-122.4194, 37.7749] as [number, number],
      },
      timeSlots: [
        {
          date: new Date("2024-12-01"),
          startTime: "09:00",
          endTime: "17:00",
          capacity: 20,
        },
      ],
      capacity: 50,
    };

    const result = eventFormSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });

  it("should reject event with end date before start date", () => {
    const invalidEvent = {
      title: "Aviation Career Fair",
      startDate: new Date("2024-12-02"),
      endDate: new Date("2024-12-01"),
      location: {
        address: "123 Airport Blvd, San Francisco, CA",
      },
      timeSlots: [
        {
          date: new Date("2024-12-01"),
          startTime: "09:00",
          endTime: "17:00",
          capacity: 20,
        },
      ],
      capacity: 50,
    };

    const result = eventFormSchema.safeParse(invalidEvent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "End date must be after start date"
      );
    }
  });

  it("should reject event without time slots", () => {
    const invalidEvent = {
      title: "Aviation Career Fair",
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-02"),
      location: {
        address: "123 Airport Blvd, San Francisco, CA",
      },
      timeSlots: [],
      capacity: 50,
    };

    const result = eventFormSchema.safeParse(invalidEvent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "At least one time slot is required"
      );
    }
  });
});

describe("Checklist Item Schema", () => {
  it("should validate complete checklist item", () => {
    const validItem = {
      id: "item-1",
      title: "Confirm venue booking",
      description: "Call venue to confirm booking details",
      dueDate: "week-before" as const,
      required: true,
      order: 1,
    };

    const result = checklistItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it("should reject checklist item with empty title", () => {
    const invalidItem = {
      id: "item-1",
      title: "",
      description: "Call venue to confirm booking details",
      required: true,
      order: 1,
    };

    const result = checklistItemSchema.safeParse(invalidItem);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Checklist item title is required"
      );
    }
  });
});

describe("Checklist Template Schema", () => {
  it("should validate complete checklist template", () => {
    const validTemplate = {
      name: "Event Manager Checklist",
      role: "manager" as const,
      items: [
        {
          id: "item-1",
          title: "Book venue",
          description: "Reserve event space",
          required: true,
          order: 1,
        },
      ],
      eventType: "career-fair",
    };

    const result = checklistTemplateSchema.safeParse(validTemplate);
    expect(result.success).toBe(true);
  });

  it("should reject template without items", () => {
    const invalidTemplate = {
      name: "Empty Template",
      role: "manager" as const,
      items: [],
    };

    const result = checklistTemplateSchema.safeParse(invalidTemplate);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "At least one checklist item is required"
      );
    }
  });
});

describe("Package Tracking Schema", () => {
  it("should validate complete package tracking", () => {
    const validPackage = {
      trackingNumber: "1Z999AA1234567890",
      fromEventId: "event-1",
      toEventId: "event-2",
      recipientUserId: "user-123",
      status: "in-transit",
      estimatedDelivery: new Date("2024-12-05"),
      notes: "Fragile items included",
    };

    const result = packageTrackingSchema.safeParse(validPackage);
    expect(result.success).toBe(true);
  });

  it("should reject package without recipient", () => {
    const invalidPackage = {
      trackingNumber: "1Z999AA1234567890",
      recipientUserId: "",
    };

    const result = packageTrackingSchema.safeParse(invalidPackage);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Recipient is required");
    }
  });
});

describe("File Upload Schema", () => {
  it("should validate allowed file types", () => {
    const mockFile = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });

    const validUpload = {
      file: mockFile,
      eventId: "event-123",
    };

    const result = fileUploadSchema.safeParse(validUpload);
    expect(result.success).toBe(true);
  });

  it("should reject disallowed file types", () => {
    const mockFile = new File(["test content"], "test.exe", {
      type: "application/x-executable",
    });

    const invalidUpload = {
      file: mockFile,
      eventId: "event-123",
    };

    const result = fileUploadSchema.safeParse(invalidUpload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("File type not allowed");
    }
  });

  it("should reject files that are too large", () => {
    // Create a mock file that's larger than 10MB
    const mockFile = new File(
      ["x".repeat(11 * 1024 * 1024)],
      "large-file.pdf",
      {
        type: "application/pdf",
      }
    );

    const invalidUpload = {
      file: mockFile,
      eventId: "event-123",
    };

    const result = fileUploadSchema.safeParse(invalidUpload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "File size must be less than 10MB"
      );
    }
  });
});

describe("Report Filters Schema", () => {
  it("should validate complete report filters", () => {
    const validFilters = {
      dateRange: {
        start: new Date("2024-01-01"),
        end: new Date("2024-12-31"),
      },
      eventTypes: ["career-fair", "training"],
      volunteerRoles: ["manager", "lead"] as const,
      trainingStatus: ["CFI/CFII", "Airline Pilot-ATP"],
      location: ["local", "traveling"] as const,
    };

    const result = reportFiltersSchema.safeParse(validFilters);
    expect(result.success).toBe(true);
  });

  it("should reject filters with invalid date range", () => {
    const invalidFilters = {
      dateRange: {
        start: new Date("2024-12-31"),
        end: new Date("2024-01-01"),
      },
    };

    const result = reportFiltersSchema.safeParse(invalidFilters);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "End date must be after start date"
      );
    }
  });
});

describe("Volunteer Signup Schema", () => {
  it("should validate volunteer signup", () => {
    const validSignup = {
      timeSlotId: "slot-123",
      eventId: "event-456",
      flightInfo: {
        airline: "Southwest",
        flightNumber: "SW123",
        arrivalTime: new Date("2024-12-01T10:00:00Z"),
        departureTime: new Date("2024-12-01T08:00:00Z"),
      },
    };

    const result = volunteerSignupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });

  it("should validate signup without flight info", () => {
    const validSignup = {
      timeSlotId: "slot-123",
      eventId: "event-456",
    };

    const result = volunteerSignupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });
});

describe("API Response Schema", () => {
  it("should validate successful API response", () => {
    const stringSchema = apiResponseSchema(z.string());
    const validResponse = {
      data: "success",
      message: "Operation completed",
    };

    const result = stringSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it("should validate error API response", () => {
    const stringSchema = apiResponseSchema(z.string());
    const errorResponse = {
      error: "Something went wrong",
      message: "Please try again",
    };

    const result = stringSchema.safeParse(errorResponse);
    expect(result.success).toBe(true);
  });
});
