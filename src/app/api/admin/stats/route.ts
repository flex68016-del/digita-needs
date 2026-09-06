import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Configuration Supabase manquante (service role)' }, { status: 500 })
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
  const { searchParams } = new URL(request.url)
  const activity = searchParams.get('activity') || 'all'
  const opportunityLevel = searchParams.get('opportunityLevel') || 'all'

  let query = supabaseAdmin
    .from('participants')
    .select('main_activity, opportunity_score, opportunity_level, digital_maturity, city')

  if (activity !== 'all') query = query.eq('main_activity', activity)
  if (opportunityLevel !== 'all') query = query.eq('opportunity_level', opportunityLevel)

  const [
    { data: participants, error: participantsError },
    { count: totalParticipants },
    { data: challengesData },
    { data: needsData },
    { data: investmentData },
  ] = await Promise.all([
    query,
    supabaseAdmin.from('participants').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('challenges').select('challenge_name'),
    supabaseAdmin.from('digital_needs').select('need_name'),
    supabaseAdmin.from('investment_intention').select('budget_range, willing_to_invest'),
  ])

  if (participantsError) {
    return NextResponse.json({ error: participantsError.message }, { status: 500 })
  }

  return NextResponse.json({
    participants: participants || [],
    totalParticipants: totalParticipants || 0,
    challengesData: challengesData || [],
    needsData: needsData || [],
    investmentData: investmentData || [],
  })
}
