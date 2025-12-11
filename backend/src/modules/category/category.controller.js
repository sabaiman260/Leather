import { asyncHandler } from "../../core/utils/async-handler.js";
import Category from "../../models/Category.model.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js";

// Get all categories
const getAllCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return res.status(200).json(new ApiResponse(200, categories, "Categories fetched"));
});

// Create category (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existing = await Category.findOne({ name });
  if (existing) throw new ApiError(400, "Category already exists");

  const category = await Category.create({ name, description });
  return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
});

// Update category (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  const { name, description, isActive } = req.body;

  if (name) category.name = name;
  if (description !== undefined) category.description = description;
  if (isActive !== undefined) category.isActive = isActive;

  await category.save();
  return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

// Delete category (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  await category.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});

// Search categories
const searchCategories = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) throw new ApiError(400, "Search query is required");

  const categories = await Category.find({
    name: { $regex: name, $options: "i" },
    isActive: true
  });

  return res.status(200).json(new ApiResponse(200, categories, "Categories fetched"));
});

export {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories
};

