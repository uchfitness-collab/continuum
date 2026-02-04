import { supabase } from "./supabaseClient";

interface SignUpParams {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export async function signUp({
  email,
  password,
  username,
  firstName,
  lastName,
}: SignUpParams) {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const user = data.user;
  if (!user) {
    throw new Error("User creation failed");
  }

  // 2. Create profile
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      email_verified: false,
    });

  if (profileError) throw profileError;

  return user;
}