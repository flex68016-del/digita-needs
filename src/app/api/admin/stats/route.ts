import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const VALID_OPPORTUNITY_LEVELS = ['high', 'medium', 'low'] as const

const statsSchema = z.object({
  activity: z.string().optional(),
  opportunityLevel: z.enum(['all', ...VALID_OPPORTUNITY_LEVELS]).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = statsSchema.parse({
      activity: searchParams.get('activity') || undefined,
      opportunityLevel: searchParams.get('opportunityLevel') || undefined,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('[Stats API] Supabase URL configured:', !!supabaseUrl)
    console.log('[Stats API] Service role key configured:', !!serviceRoleKey)

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[Stats API] Missing Supabase configuration')
      return NextResponse.json({ error: 'Configuration Supabase manquante (service role)' }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
    const activity = params.activity || 'all'
    const opportunityLevel = params.opportunityLevel || 'all'

    console.log('[Stats API] Fetching data with filters:', { activity, opportunityLevel })

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
      { data: interestedLeads },
      { data: detailedResponses },
    ] = await Promise.all([
      query,
      supabaseAdmin.from('participants').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('challenges').select('challenge_name'),
      supabaseAdmin.from('digital_needs').select('need_name'),
      supabaseAdmin.from('investment_intention').select('budget_range, willing_to_invest'),
      supabaseAdmin.from('participants').select(`
        name,
        whatsapp,
        email,
        city,
        main_activity,
        opportunity_score,
        opportunity_level,
        contact(name, whatsapp, email)
      `).eq('contact_consent', true).order('created_at', { ascending: false }),
      supabaseAdmin
        .from('participants')
        .select(`
          id,
          name,
          city,
          age_range,
          main_activity,
          activity_years,
          whatsapp,
          email,
          contact_consent,
          opportunity_score,
          opportunity_level,
          digital_maturity,
          created_at,
          contact(name, whatsapp, email),
          digital_tools(tool_name),
          challenges(challenge_name),
          digital_needs(need_name),
          acquisition_methods(method_name),
          investment_intention(willing_to_invest, budget_range)
        `)
        .order('created_at', { ascending: false }),
    ])

    console.log('[Stats API] Participants error:', participantsError)
    console.log('[Stats API] Participants count:', participants?.length)
    console.log('[Stats API] Total participants:', totalParticipants)

    if (participantsError) {
      console.error('[Stats API] Participants query failed:', participantsError)
      return NextResponse.json({ error: participantsError.message }, { status: 500 })
    }

    return NextResponse.json({
      participants: participants || [],
      totalParticipants: totalParticipants || 0,
      challengesData: challengesData || [],
      needsData: needsData || [],
      investmentData: investmentData || [],
      interestedLeads: interestedLeads || [],
      detailedResponses: detailedResponses || [],
    })
  } catch (error) {
    console.error('[Stats API] Unexpected error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
