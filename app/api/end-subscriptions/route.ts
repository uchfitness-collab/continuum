// app/api/end-subscriptions/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const now = new Date().toISOString();

    // Find all users whose program has ended and still have a subscription
    const { data: expiredUsers, error } = await supabase
      .from('user_profiles')
      .select('user_id, plan, stripe_subscription_id, program_end_date')
      .not('stripe_subscription_id', 'is', null)
      .not('plan', 'is', null)
      .lte('program_end_date', now);

    if (error) {
      console.error('Error fetching expired users:', error);
      return NextResponse.json({ error: 'Failed to fetch expired users' }, { status: 500 });
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      return NextResponse.json({ success: true, message: 'No expired subscriptions found' });
    }

    console.log(`Found ${expiredUsers.length} expired subscriptions to cancel`);

    const results: { user_id: string; success: boolean; error?: any }[] = [];

    for (const user of expiredUsers) {
      try {
        // Cancel the Stripe subscription
        await stripe.subscriptions.cancel(user.stripe_subscription_id);

        // Clear the subscription fields in Supabase
        await supabase
          .from('user_profiles')
          .update({
            stripe_subscription_id: null,
            plan: null,
          })
          .eq('user_id', user.user_id);

        console.log(`✓ Cancelled subscription for user ${user.user_id}`);
        results.push({ user_id: user.user_id, success: true });
      } catch (err) {
        console.error(`✗ Failed to cancel subscription for user ${user.user_id}:`, err);
        results.push({ user_id: user.user_id, success: false, error: err });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Cancelled ${successCount} subscriptions, ${failureCount} failed`,
      details: { total: expiredUsers.length, cancelled: successCount, failed: failureCount },
    });
  } catch (error) {
    console.error('Error in end-subscriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}