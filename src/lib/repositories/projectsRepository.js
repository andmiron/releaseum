import { supabase } from "../supabase";

export class ProjectsRepository {
  static async getProjectByIdAndOwnerId(projectId, ownerId) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("owner_id", ownerId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjectBySlug(slug) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjectsByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", ownerId);

    if (error) throw error;
    return data;
  }

  static async createProject(name, slug, description) {
    const { data, error } = await supabase
      .from("projects")
      .insert({ name, slug, description })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProject(id, name, slug, description) {
    const { data, error } = await supabase
      .from("projects")
      .update({ name, slug, description })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProject(id) {
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  }
}
