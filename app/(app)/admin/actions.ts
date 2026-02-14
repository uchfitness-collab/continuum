// app/(app)/admin/actions.ts
'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client that bypasses RLS
const getAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not found');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function getAllUsers() {
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    throw error;
  }

  return data.users.map(user => ({
    id: user.id,
    email: user.email || 'No email',
    created_at: user.created_at,
    last_sign_in_at: user.last_sign_in_at, // Add last sign in
  }));
}

// Get all user habits using service role (bypasses RLS)
export async function getAllUserHabits() {
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin
    .from('user_habits')
    .select('*');

  if (error) {
    console.error('Error fetching habits with service role:', error);
    return [];
  }

  return data || [];
}

// Get all daily logs using service role (bypasses RLS)
export async function getAllDailyLogs() {
  const supabaseAdmin = getAdminClient();

  const { data, error } = await supabaseAdmin
    .from('daily_logs')
    .select('user_id, log_date, sovereign_score')
    .order('log_date', { ascending: false });

  if (error) {
    console.error('Error fetching logs with service role:', error);
    return [];
  }

  return data || [];
}

// NEW: Get specific user's details (habits, goals, logs) using service role
export async function getUserDetails(userId: string) {
  const supabaseAdmin = getAdminClient();

  // Get user's logs
  const { data: logs } = await supabaseAdmin
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false });

  // Get user's habits
  const { data: habits } = await supabaseAdmin
    .from('user_habits')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  // Get user's goals
  const { data: goals } = await supabaseAdmin
    .from('user_goals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return {
    logs: logs || [],
    habits: habits || null,
    goals: goals || null,
  };
}