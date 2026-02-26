// app/api/send-daily-reminders/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const today = getLocalDate();

    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching users:', authError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    const allUsers = authData.users;

    const { data: todayLogs, error: logsError } = await supabase
      .from('daily_logs')
      .select('user_id')
      .eq('log_date', today);

    if (logsError) {
      console.error('Error fetching logs:', logsError);
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }

    const loggedUserIds = new Set(todayLogs?.map(log => log.user_id) || []);

    const usersToRemind = allUsers.filter(user => 
      user.email && 
      user.email_confirmed_at &&
      !loggedUserIds.has(user.id)
    );

    console.log(`Found ${usersToRemind.length} users to remind out of ${allUsers.length} total users`);

    // Send emails one at a time with delay to avoid rate limits
    const results = [];
    for (const user of usersToRemind) {
      try {
        const result = await resend.emails.send({
          from: 'Continuum <reminders@continuumgrowth.org>',
          to: user.email!,
          subject: "Don't forget to log your Continuum habits today",
          html: generateEmailHTML(user.email!),
        });
        console.log(`Email sent to ${user.email}:`, result);
        results.push({ success: true, email: user.email });
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        results.push({ success: false, email: user.email, error });
      }
      // Wait 600ms between emails to stay under rate limit
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} reminders, ${failureCount} failed`,
      details: {
        totalUsers: allUsers.length,
        alreadyLogged: loggedUserIds.size,
        reminded: successCount,
        failed: failureCount,
      }
    });

  } catch (error) {
    console.error('Error in send-daily-reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(userEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Reminder - Continuum</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #020617 0%, #0f172a 100%);">
              <h1 style="margin: 0; color: #22c55e; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                ⚡ Continuum
              </h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">
                Your daily discipline tracker
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; color: #e5e7eb; font-size: 24px; font-weight: 600;">
                Don't forget to log your habits today.
              </h2>
              
              <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                Your daily log is still empty. It only takes 2 minutes — but those 2 minutes are what separate the people who build real discipline from the ones who just talk about it.
              </p>

              <div style="background-color: #0f172a; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <p style="margin: 0; color: #22c55e; font-size: 14px; font-weight: 600; font-style: italic; line-height: 1.7;">
                  "Every action you take is a vote for the type of person you wish to become."
                </p>
                <p style="margin: 8px 0 0 0; color: #64748b; font-size: 13px;">— James Clear, Atomic Habits</p>
              </div>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="https://continuumgrowth.org/daily" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #020617; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                      Log Today's Habits
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                Every day you log is a vote for who you're becoming. Don't skip it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #0f172a; border-top: 1px solid #334155;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-align: center;">
                You're receiving this because you have an account at Continuum.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px; text-align: center;">
                Want to change your notification settings? <a href="https://continuumgrowth.org/settings" style="color: #22c55e; text-decoration: none;">Click here</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}