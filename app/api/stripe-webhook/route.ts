// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

function getPlanInfo(priceId: string): { plan: string; days: number } | null {
  if (priceId === process.env.STRIPE_SPARK_PRICE_ID) return { plan: 'spark', days: 30 };
  if (priceId === process.env.STRIPE_FORGE_PRICE_ID) return { plan: 'forge', days: 180 };
  if (priceId === process.env.STRIPE_SOVEREIGN_PRICE_ID) return { plan: 'sovereign', days: 365 };
  return null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0].price.id;
    const customerEmail = await getCustomerEmail(subscription.customer as string);

    if (!customerEmail) {
      console.error('No email found for customer:', subscription.customer);
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }

    const planInfo = getPlanInfo(priceId);

    if (!planInfo) {
      console.error('Unknown price ID:', priceId);
      return NextResponse.json({ error: 'Unknown price ID' }, { status: 400 });
    }

    const programEndDate = new Date();
    programEndDate.setDate(programEndDate.getDate() + planInfo.days);

    const { data: authData } = await supabase.auth.admin.listUsers();
    const user = authData?.users.find((u) => u.email === customerEmail);

    if (!user) {
      console.error('No user found for email:', customerEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({
        plan: planInfo.plan,
        program_end_date: programEndDate.toISOString(),
        stripe_subscription_id: subscription.id,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    console.log(`✓ Updated ${customerEmail} → ${planInfo.plan} plan, ends ${programEndDate.toDateString()}`);
  }

  return NextResponse.json({ received: true });
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return (customer as Stripe.Customer).email;
  } catch {
    return null;
  }
}