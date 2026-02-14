'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabaseClient';
import { getAllUsers, getAllUserHabits, getAllDailyLogs, getUserDetails } from './actions';

// Add your email here to restrict access
const ADMIN_EMAIL = 'uchfitness@gmail.com';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: auth } = await supabase.auth.getUser();
      
      if (!auth.user || auth.user.email !== ADMIN_EMAIL) {
        router.push('/dashboard');
        return;
      }

      setAuthorized(true);
      await loadStats();
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadStats = async () => {
    try {
      console.log('=== ADMIN DEBUG START ===');
      
      // Get ALL users from Supabase Auth using server action
      const authUsers = await getAllUsers();
      console.log('✅ Auth users fetched:', authUsers.length);
      
      if (!authUsers || authUsers.length === 0) {
        console.log('No users found');
        setStats({
          totalUsers: 0,
          totalLogs: 0,
          avgLogsPerUser: 0,
          activeUsers: 0,
          usersWithHabits: 0,
        });
        setUsers([]);
        return;
      }

      // Get all logs using server action (bypasses RLS)
      const allLogs = await getAllDailyLogs();
      console.log('✅ Logs fetched:', allLogs.length);

      // Get all habits using server action (bypasses RLS)
      const allHabits = await getAllUserHabits();
      console.log('✅ Habits fetched:', allHabits.length);
      console.log('Sample habits:', allHabits.slice(0, 3));

      const userIds = authUsers.map(u => u.id);
      const usersWithHabitsSet = new Set(allHabits.map(h => h.user_id));
      console.log('✅ Users with habits:', Array.from(usersWithHabitsSet));

      // Create user map
      const userMap = new Map();
      
      // Initialize all auth users
      authUsers.forEach(authUser => {
        const hasHabits = usersWithHabitsSet.has(authUser.id);
        
        userMap.set(authUser.id, {
          user_id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          has_habits: hasHabits,
          total_logs: 0,
          last_log: null,
          avg_score: 0,
          scores: []
        });
      });

      // Add log data
      if (allLogs) {
        allLogs.forEach(log => {
          if (userMap.has(log.user_id)) {
            const user = userMap.get(log.user_id);
            user.total_logs++;
            if (!user.last_log || log.log_date > user.last_log) {
              user.last_log = log.log_date;
            }
            user.scores.push(log.sovereign_score);
          }
        });
      }

      // Calculate averages and format
      const usersWithData = Array.from(userMap.values()).map(user => {
        const avg = user.scores.length > 0 
          ? user.scores.reduce((a: number, b: number) => a + b, 0) / user.scores.length 
          : 0;
        
        let status;
        if (!user.has_habits) {
          status = 'No habits set';
        } else if (user.total_logs === 0) {
          status = 'No logs yet';
        } else if (user.total_logs < 3) {
          status = 'Getting started';
        } else if (user.total_logs < 7) {
          status = 'Building habit';
        } else {
          status = 'Active';
        }
        
        return {
          ...user,
          avg_score: avg > 0 ? avg.toFixed(1) : 'N/A',
          status,
        };
      });

      // Sort by total logs (most active first), then by created date
      usersWithData.sort((a, b) => {
        if (b.total_logs !== a.total_logs) {
          return b.total_logs - a.total_logs;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setUsers(usersWithData);

      // Overall stats
      const totalUsers = userMap.size;
      const totalLogs = allLogs?.length || 0;
      const avgLogsPerUser = totalUsers > 0 ? (totalLogs / totalUsers).toFixed(1) : '0';
      
      // Active users (logged in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const activeUsers = Array.from(userMap.values()).filter((u: any) => 
        u.last_log && new Date(u.last_log) >= sevenDaysAgo
      ).length;

      const usersWithHabitsCount = usersWithHabitsSet.size;

      console.log('=== FINAL STATS ===');
      console.log('Total users:', totalUsers);
      console.log('Users with habits:', usersWithHabitsCount);
      console.log('Active users (7d):', activeUsers);
      console.log('Total logs:', totalLogs);

      setStats({
        totalUsers,
        totalLogs,
        avgLogsPerUser,
        activeUsers,
        usersWithHabits: usersWithHabitsCount,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      alert('Error loading users. Check console for details.');
    }
  };

  const loadUserDetails = async (userId: string) => {
    setSelectedUser(userId);

    // Use server action to get user details (bypasses RLS)
    const details = await getUserDetails(userId);

    // Calculate streak
    let currentStreak = 0;
    if (details.logs && details.logs.length > 0) {
      const sortedDates = details.logs.map(l => l.log_date).sort().reverse();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedDates.length; i++) {
        const logDate = new Date(sortedDates[i] + 'T00:00:00');
        logDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);
        
        const logDateStr = logDate.toISOString().split('T')[0];
        const expectedDateStr = expectedDate.toISOString().split('T')[0];
        
        if (logDateStr === expectedDateStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    setUserDetails({
      logs: details.logs,
      habits: details.habits,
      goals: details.goals,
      currentStreak,
      totalDays: details.logs.length,
      avgScore: details.logs.length ? (details.logs.reduce((sum: number, log: any) => sum + log.sovereign_score, 0) / details.logs.length).toFixed(1) : 'N/A',
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#020617',
        color: '#e5e7eb',
      }}>
        Loading admin dashboard...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'clamp(40px, 6vw, 60px) clamp(16px, 4vw, 24px)',
      background: 'radial-gradient(circle at top, #020617, #01030f)',
      color: '#e5e7eb',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 600, marginBottom: 8 }}>
            🔐 Admin Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 16 }}>
            Monitor user engagement and app health
          </p>
        </div>

        {/* OVERALL STATS */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}>
            <StatCard label="Total Users" value={stats.totalUsers} color="#22c55e" />
            <StatCard label="With Habits" value={stats.usersWithHabits} color="#3b82f6" />
            <StatCard label="Active (7d)" value={stats.activeUsers} color="#a855f7" />
            <StatCard label="Total Logs" value={stats.totalLogs} color="#fbbf24" />
          </div>
        )}

        {/* USER LIST */}
        <div style={{
          background: '#020617',
          borderRadius: 16,
          border: '1px solid #1e293b',
          padding: 'clamp(20px, 4vw, 24px)',
          marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginBottom: 20 }}>
            All Users ({users.length})
          </h2>
          
          {users.length === 0 ? (
            <div style={{ 
              padding: 40, 
              textAlign: 'center', 
              color: '#94a3b8' 
            }}>
              No users found.
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gap: 12,
              maxHeight: 600,
              overflowY: 'auto',
            }}>
              {users.map(user => (
                <div
                  key={user.user_id}
                  onClick={() => loadUserDetails(user.user_id)}
                  style={{
                    padding: 16,
                    background: selectedUser === user.user_id ? '#1e293b' : '#01030f',
                    borderRadius: 10,
                    border: `1px solid ${selectedUser === user.user_id ? '#22c55e' : '#334155'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>
                        {user.email}
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8' }}>
                        {user.last_log 
                          ? `Last log: ${new Date(user.last_log).toLocaleDateString()}`
                          : user.last_sign_in_at
                          ? `Last login: ${new Date(user.last_sign_in_at).toLocaleDateString()}`
                          : `Signed up: ${new Date(user.created_at).toLocaleDateString()}`
                        }
                      </div>
                      <div style={{ 
                        fontSize: 12, 
                        color: !user.has_habits ? '#64748b' :
                               user.total_logs === 0 ? '#ef4444' : 
                               user.total_logs < 7 ? '#fbbf24' : '#22c55e',
                        marginTop: 4,
                        fontWeight: 500,
                      }}>
                        {user.status}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: 16,
                      fontSize: 14,
                    }}>
                      <div>
                        <span style={{ color: '#94a3b8' }}>Logs: </span>
                        <span style={{ 
                          color: user.total_logs === 0 ? '#64748b' : '#22c55e', 
                          fontWeight: 600 
                        }}>
                          {user.total_logs}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8' }}>Avg: </span>
                        <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                          {user.avg_score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USER DETAILS */}
        {selectedUser && userDetails && (
          <div style={{
            background: '#020617',
            borderRadius: 16,
            border: '2px solid #22c55e40',
            padding: 'clamp(20px, 4vw, 24px)',
          }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', marginBottom: 12 }}>
                User Details
              </h2>
              
              {!userDetails.habits ? (
                <div style={{
                  padding: 24,
                  background: '#1e1e1e',
                  borderRadius: 10,
                  border: '1px solid #64748b',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#94a3b8', margin: 0 }}>
                    This user hasn't set up their habits yet.
                  </p>
                </div>
              ) : userDetails.totalDays === 0 ? (
                <div style={{
                  padding: 24,
                  background: '#1e0a0a',
                  borderRadius: 10,
                  border: '1px solid #ef4444',
                  textAlign: 'center',
                }}>
                  <p style={{ color: '#ef4444', margin: 0 }}>
                    This user has set up their habits but hasn't logged any days yet.
                  </p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 16,
                  padding: 16,
                  background: '#01030f',
                  borderRadius: 10,
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Current Streak</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>
                      {userDetails.currentStreak} days
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Total Days</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                      {userDetails.totalDays}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>Avg Score</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: '#fbbf24' }}>
                      {userDetails.avgScore}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* HABITS */}
            {userDetails.habits && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 18, marginBottom: 12, color: '#22c55e' }}>
                  Habits
                </h3>
                <div style={{ 
                  display: 'grid',
                  gap: 8,
                  fontSize: 14,
                  color: '#94a3b8',
                }}>
                  <div>💪 Physical: {userDetails.habits.body_physical_activity_name || 'Not set'}</div>
                  <div>💪 Reps: {userDetails.habits.body_daily_reps_name || 'Not set'}</div>
                  <div>💪 Nutrition: {userDetails.habits.body_nutritional_discipline_name || 'Not set'}</div>
                  <div>🧠 Positive: {userDetails.habits.mind_positive_habit_name || 'Not set'}</div>
                  <div>🧠 Avoid: {userDetails.habits.mind_negative_habit_name || 'Not set'}</div>
                  <div>⚡ Mission: {userDetails.habits.identity_daily_mission_name || 'Not set'}</div>
                  <div>⚡ Philosophy: {userDetails.habits.identity_philosophy_practice_name || 'Not set'}</div>
                </div>
              </div>
            )}

            {/* GOALS */}
            {userDetails.goals && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 18, marginBottom: 12, color: '#3b82f6' }}>
                  Goals
                </h3>
                <div style={{ 
                  display: 'grid',
                  gap: 8,
                  fontSize: 14,
                  color: '#94a3b8',
                }}>
                  <div>💪 Body: {userDetails.goals.body_goal || 'Not set'}</div>
                  <div>🧠 Mind: {userDetails.goals.mind_goal || 'Not set'}</div>
                  <div>⚡ Identity: {userDetails.goals.identity_goal || 'Not set'}</div>
                </div>
              </div>
            )}

            {/* RECENT LOGS */}
            {userDetails.logs.length > 0 && (
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 12, color: '#a855f7' }}>
                  Recent Logs (Last 10)
                </h3>
                <div style={{ 
                  display: 'grid',
                  gap: 8,
                  maxHeight: 400,
                  overflowY: 'auto',
                }}>
                  {userDetails.logs.slice(0, 10).map((log: any) => (
                    <div
                      key={log.log_date}
                      style={{
                        padding: 12,
                        background: '#01030f',
                        borderRadius: 8,
                        border: '1px solid #334155',
                        fontSize: 14,
                      }}
                    >
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}>
                        <div>
                          {new Date(log.log_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {log.is_rest_day && (
                            <span style={{ 
                              marginLeft: 8,
                              fontSize: 12,
                              color: '#94a3b8',
                            }}>
                              (Rest Day)
                            </span>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#fbbf24',
                        }}>
                          {log.sovereign_score.toFixed(1)}
                        </div>
                      </div>
                      
                      {!log.is_rest_day && (
                        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                          <span>
                            Body: <strong style={{ color: '#22c55e' }}>{log.body_score}</strong>
                          </span>
                          <span>
                            Mind: <strong style={{ color: '#3b82f6' }}>{log.mind_score}</strong>
                          </span>
                          <span>
                            Identity: <strong style={{ color: '#a855f7' }}>{log.identity_score}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  color 
}: { 
  label: string; 
  value: any; 
  color: string;
}) {
  return (
    <div style={{
      background: '#020617',
      padding: 'clamp(20px, 4vw, 24px)',
      borderRadius: 12,
      border: `2px solid ${color}30`,
    }}>
      <div style={{ 
        color: '#94a3b8', 
        fontSize: 13, 
        marginBottom: 8 
      }}>
        {label}
      </div>
      <div style={{ 
        fontSize: 'clamp(24px, 4vw, 32px)',
        fontWeight: 600,
        color,
      }}>
        {value}
      </div>
    </div>
  );
}