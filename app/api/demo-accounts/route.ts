import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch demo accounts from Supabase users table
    // Look for users with demo email patterns or specific roles
    const { data: demoUsers, error } = await (supabase as any)
      .from('users')
      .select('email, full_name, role, created_at')
      .or('email.eq.admin@example.com,email.eq.student@example.com,email.eq.lecturer@example.com,email.eq.labstaff@example.com')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching demo accounts:', error)
      // Return fallback demo accounts if database fails
      return NextResponse.json({
        demoAccounts: [
          {
            email: 'admin@example.com',
            password: 'admin123',
            role: 'Admin',
            description: 'Akses penuh sistem',
            full_name: 'Demo Admin',
            isDatabase: false
          },
          {
            email: 'student@example.com',
            password: 'student123',
            role: 'Student',
            description: 'Mahasiswa biasa',
            full_name: 'Demo Student',
            isDatabase: false
          },
          {
            email: 'lecturer@example.com',
            password: 'lecturer123',
            role: 'Lecturer',
            description: 'Dosen pengajar',
            full_name: 'Demo Lecturer',
            isDatabase: false
          },
          {
            email: 'labstaff@example.com',
            password: 'labstaff123',
            role: 'Lab Staff',
            description: 'Staff laboratorium',
            full_name: 'Demo Lab Staff',
            isDatabase: false
          }
        ]
      })
    }

    // Get temp passwords from local storage fallback
    const getDemoPassword = (email: string, role: string) => {
      const passwords: { [key: string]: string } = {
        'admin@example.com': 'admin123',
        'student@example.com': 'student123',
        'lecturer@example.com': 'lecturer123',
        'labstaff@example.com': 'labstaff123'
      }
      return passwords[email] || `${role.toLowerCase()}123`
    }

    // Transform database users to demo account format
    const demoAccounts = demoUsers.map((user: any) => ({
      email: user.email,
      password: getDemoPassword(user.email, user.role),
      role: user.role,
      description: getDescriptionForRole(user.role),
      full_name: user.full_name,
      isDatabase: true,
      created_at: user.created_at
    }))

    // If no demo users found in database, return default demo accounts
    if (demoAccounts.length === 0) {
      return NextResponse.json({
        demoAccounts: [
          {
            email: 'admin@example.com',
            password: 'admin123',
            role: 'Admin',
            description: 'Akses penuh sistem',
            full_name: 'Demo Admin',
            isDatabase: false
          },
          {
            email: 'student@example.com',
            password: 'student123',
            role: 'Student',
            description: 'Mahasiswa biasa',
            full_name: 'Demo Student',
            isDatabase: false
          },
          {
            email: 'lecturer@example.com',
            password: 'lecturer123',
            role: 'Lecturer',
            description: 'Dosen pengajar',
            full_name: 'Demo Lecturer',
            isDatabase: false
          },
          {
            email: 'labstaff@example.com',
            password: 'labstaff123',
            role: 'Lab Staff',
            description: 'Staff laboratorium',
            full_name: 'Demo Lab Staff',
            isDatabase: false
          }
        ]
      })
    }

    return NextResponse.json({ demoAccounts })

  } catch (error) {
    console.error('Error in demo accounts API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo accounts' },
      { status: 500 }
    )
  }
}

function getDescriptionForRole(role: string): string {
  const descriptions: { [key: string]: string } = {
    'admin': 'Akses penuh sistem',
    'student': 'Mahasiswa biasa',
    'lecturer': 'Dosen pengajar',
    'labstaff': 'Staff laboratorium'
  }
  return descriptions[role.toLowerCase()] || 'Pengguna sistem'
}