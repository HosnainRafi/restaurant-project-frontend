import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().positive("Price must be a positive number"),
  categoryId: z.string().min(1, "Please select a category"),
  isAvailable: z.boolean().default(true),
});
