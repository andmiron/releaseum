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

  static async updateDocument(id, name, content) {
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
      .update({ name, content })
      .eq("id", id)
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
}
