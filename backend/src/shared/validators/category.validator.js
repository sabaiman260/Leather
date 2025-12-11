import { z } from "zod";

// Helper to trim strings
const trimmedString = () =>
  z.preprocess((val) => (typeof val === "string" ? val.trim() : val), z.string());

export const createCategorySchema = z.object({
  type: trimmedString().refine((val) => ["Men", "Women", "Kids"].includes(val), {
    message: "Invalid type"
  }),
  name: trimmedString(),
  parentCategory: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional()
});

export const updateCategorySchema = z.object({
  type: trimmedString().optional().refine((val) => ["Men", "Women", "Kids"].includes(val), {
    message: "Invalid type"
  }),
  name: trimmedString().optional(),
  parentCategory: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional()
});
