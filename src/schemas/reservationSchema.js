import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  partySize: z.coerce
    .number()
    .min(1, "Party must have at least 1 person")
    .max(20, "For parties larger than 20, please call us"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  note: z.string().max(200, "Note is too long").optional(),
});
