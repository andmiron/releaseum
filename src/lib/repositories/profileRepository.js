import { supabase } from "../supabase";

export class ProfileRepository {
  static async createUserProfile(userId, email, name, company) {
    const { data, error } = await supabase
      .from("profiles")
      .insert({ id: userId, email, name, company_name: company })
      .select()
      .single();

    return { data, error };
  }

  static async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId);

    return { data, error };
  }
}
