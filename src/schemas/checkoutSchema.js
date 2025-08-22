import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  email: z.string().email("A valid email is required").optional(),
  address: z
    .string()
    .min(10, "A valid delivery address is required")
    .optional(),
  type: z.enum(["pickup", "delivery"]),
  paymentMethod: z.enum(["card", "pickup"], {
    required_error: "Please select a payment method",
  }),
});
