import { supabase } from "../supabaseClient";

// Create a new blog post
export const createBlog = async (title: string, content: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .insert([{ title, content }])
    .select()
    .single();

  if (error) {
    console.error("Error creating blog:", error);
    throw new Error(error.message);
  }
  return data;
};

// Get paginated blogs
export const getBlogs = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    throw new Error(error.message);
  }
  return data;
};

export const getBlogById = async (id: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)  // id is string UUID
    .single();

  if (error) {
    console.error("Error fetching blog by ID:", error);
    throw new Error(error.message);
  }
  return data;
};

export const updateBlog = async (id: string, title: string, content: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .update({ title, content })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating blog:", error);
    throw new Error(error.message);
  }
  return data;
};

export const deleteBlog = async (id: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error deleting blog:", error);
    throw new Error(error.message);
  }
  return data;
};
