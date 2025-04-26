import { supabase } from "../supabase";

export class DocumentsRepository {
  static async getDocumentsByOwnerId(ownerId) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", ownerId);

    if (error) throw error;
    return data;
  }

  static async getDocumentsByProjectId(projectId) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", projectId);

    if (error) throw error;
    return data;
  }

  static async createDocument(projectId, ownerId, title, slug, content) {
    const { data, error } = await supabase
      .from("documents")
      .insert({
        title,
        slug,
        content,
        project_id: projectId,
        owner_id: ownerId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateDocument(ownerId, documentId, title, slug, content) {
    const { data, error } = await supabase
      .from("documents")
      .update({ title, slug, content })
      .eq("id", documentId)
      .eq("owner_id", ownerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteDocument(id) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user?.id) throw new Error("Not authenticated");

    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!document) throw new Error("Document not found");
    if (document.owner_id !== session.session.user.id)
      throw new Error("Not authorized");

    const { data, error } = await supabase
      .from("documents")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    return data;
  }

  static async getDocumentById(id) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getDocumentByProjectSlugAndDocumentId(projectSlug, documentId) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("slug, id")
      .eq("slug", projectSlug)
      .single();

    if (projectError) throw projectError;
    if (!project) throw new Error("Project not found");

    const { data: document, error: documentError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("project_id", project.id)
      .single();

    if (documentError) throw documentError;
    if (!document) throw new Error("Document not found");

    if (document.project_id !== project.id)
      throw new Error("Document not found");

    return document;
  }
}
