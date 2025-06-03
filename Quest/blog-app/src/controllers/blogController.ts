// src/controllers/blogController.ts
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../models/blogModel";

// Create blog
export const handleCreateBlog = async (title: string, content: string) => {
  try {
    const result = await createBlog(title, content);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get list of blogs (with pagination)
export const fetchBlogs = async (page = 1) => {
  try {
    return await getBlogs(page);
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

// Get a single blog by ID (id is string now)
export const fetchBlogById = async (id: string) => {
  try {
    return await getBlogById(id);
  } catch (error: any) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
};

// Update blog (id is string)
export const handleUpdateBlog = async (id: string, title: string, content: string) => {
  try {
    const result = await updateBlog(id, title, content);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Delete blog (id is string)
export const handleDeleteBlog = async (id: string) => {
  try {
    const result = await deleteBlog(id);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
