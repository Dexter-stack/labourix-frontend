import { http, HttpResponse, delay } from 'msw'
import {
  mockBookings,
  mockCertifications,
  mockEmployer,
  mockJobs,
  mockMatches,
  mockUsers,
  mockWorker,
  mockWorkerProfile,
} from './data'

const BASE = 'http://localhost:8000/api/v1'
const DELAY = 400

export const handlers = [
  // ─── Auth ──────────────────────────────────────────────────
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(DELAY)
    const body = await request.json() as { email: string }
    const isWorker = body.email.includes('worker') || body.email === 'danny@email.com'
    const isAdmin = body.email.includes('admin') || body.email === 'sarah@labourix.com'
    const user = isWorker
      ? mockWorker
      : isAdmin
        ? { ...mockEmployer, role: 'admin' as const, id: 'adm-1', name: 'Sarah Okonkwo', email: body.email }
        : { ...mockEmployer, email: body.email }
    return HttpResponse.json({
      data: { user, token: 'mock-token-abc123' },
    })
  }),

  // Single register endpoint (real API — no token returned, sends OTP)
  http.post(`${BASE}/auth/register`, async () => {
    await delay(DELAY)
    return HttpResponse.json(
      { message: 'Verification email sent. Please check your inbox.' },
      { status: 201 }
    )
  }),

  // Verify email (returns token after code check)
  http.post(`${BASE}/auth/verify-email`, async ({ request }) => {
    await delay(DELAY)
    const body = await request.json() as { email: string; code: string }
    const isWorker = body.email.includes('worker')
    const user = isWorker ? { ...mockWorker, email: body.email } : { ...mockEmployer, email: body.email }
    return HttpResponse.json({
      data: { user, token: 'mock-token-verified' },
    })
  }),

  http.post(`${BASE}/auth/resend-otp`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'OTP resent' })
  }),

  http.post(`${BASE}/auth/forgot-password`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'Reset code sent' })
  }),

  http.post(`${BASE}/auth/reset-password`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'Password reset successful' })
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    await delay(200)
    return HttpResponse.json({ message: 'Logged out' })
  }),

  http.get(`${BASE}/auth/me`, async () => {
    await delay(200)
    return HttpResponse.json({ data: mockEmployer })
  }),

  // ─── Employer Jobs ────────────────────────────────────────
  http.get(`${BASE}/employer/jobs`, async ({ request }) => {
    await delay(DELAY)
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const status = url.searchParams.get('status')

    let jobs = [...mockJobs]
    if (search) jobs = jobs.filter((j) => j.title.toLowerCase().includes(search) || j.location.toLowerCase().includes(search))
    if (status) jobs = jobs.filter((j) => j.status === status)

    return HttpResponse.json({
      data: jobs,
      meta: { current_page: 1, last_page: 1, per_page: 20, total: jobs.length },
    })
  }),

  http.get(`${BASE}/employer/jobs/:id`, async ({ params }) => {
    await delay(DELAY)
    const job = mockJobs.find((j) => j.id === params.id)
    if (!job) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json({ data: job })
  }),

  http.post(`${BASE}/employer/jobs`, async ({ request }) => {
    await delay(DELAY)
    const body = await request.json() as Partial<typeof mockJobs[0]>
    const newJob = {
      ...body,
      id: `job-${Date.now()}`,
      employer_id: 'emp-1',
      employer_name: 'Acme Construction Ltd',
      workers_filled: 0,
      status: 'open' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockJobs.unshift(newJob as typeof mockJobs[0])
    return HttpResponse.json({ data: newJob }, { status: 201 })
  }),

  http.put(`${BASE}/employer/jobs/:id`, async ({ params, request }) => {
    await delay(DELAY)
    const body = await request.json() as Partial<typeof mockJobs[0]>
    const idx = mockJobs.findIndex((j) => j.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    mockJobs[idx] = { ...mockJobs[idx], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json({ data: mockJobs[idx] })
  }),

  http.delete(`${BASE}/employer/jobs/:id`, async ({ params }) => {
    await delay(DELAY)
    const idx = mockJobs.findIndex((j) => j.id === params.id)
    if (idx !== -1) mockJobs.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${BASE}/employer/jobs/:id/publish`, async ({ params }) => {
    await delay(DELAY)
    const job = mockJobs.find((j) => j.id === params.id)
    if (!job) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    job.status = 'active'
    return HttpResponse.json({ data: job })
  }),

  // ─── Employer Stats & Optimisation ────────────────────────
  http.get(`${BASE}/employer/stats`, async () => {
    await delay(DELAY)
    return HttpResponse.json({
      data: {
        active_jobs: 3,
        total_bookings: 12,
        workers_hired: 19,
        avg_fill_time: 6,
        utilization_rate: 78,
      },
    })
  }),

  http.get(`${BASE}/employer/workforce-optimisation`, async () => {
    await delay(DELAY)
    return HttpResponse.json({
      data: {
        recommendations: [
          { type: 'underutilisation', message: 'Marcus Osei has been idle for 5 days. Consider reallocating to Job #job-2.', impact: 'high', worker_id: 'wkr-3' },
          { type: 'shortage_risk', message: 'You will need 3 additional electricians within 5 days based on upcoming projects.', impact: 'high' },
          { type: 'cost_saving', message: 'Booking workers 14+ days in advance reduces your average rate by 12%.', impact: 'medium' },
          { type: 'compliance', message: "1 worker's CSCS card expires within 30 days. Prompt renewal to avoid booking blocks.", impact: 'medium' },
        ],
        utilization_by_trade: [
          { trade: 'Electricians', rate: 92 },
          { trade: 'Plumbers', rate: 65 },
          { trade: 'Scaffolders', rate: 100 },
          { trade: 'Plasterers', rate: 40 },
          { trade: 'General Labour', rate: 85 },
        ],
      },
    })
  }),

  http.get(`${BASE}/employer/demand-forecast`, async () => {
    await delay(DELAY)
    return HttpResponse.json({
      data: [
        {
          period: 'Wk 18',
          forecasted_demand: 12,
          current_capacity: 14,
          gap: -2,
          trade_breakdown: [{ trade: 'Electricians', needed: 5, available: 6 }, { trade: 'Plumbers', needed: 4, available: 5 }, { trade: 'Labourers', needed: 3, available: 3 }],
          alerts: [],
        },
        {
          period: 'Wk 19',
          forecasted_demand: 18,
          current_capacity: 14,
          gap: 4,
          trade_breakdown: [{ trade: 'Electricians', needed: 8, available: 6 }, { trade: 'Plumbers', needed: 5, available: 5 }, { trade: 'Labourers', needed: 5, available: 3 }],
          alerts: [{ severity: 'critical', message: 'You will require 3 additional electricians within 5 days', days_until: 5 }],
        },
        {
          period: 'Wk 20',
          forecasted_demand: 22,
          current_capacity: 14,
          gap: 8,
          trade_breakdown: [{ trade: 'Electricians', needed: 10, available: 6 }, { trade: 'Plumbers', needed: 6, available: 5 }, { trade: 'Labourers', needed: 6, available: 3 }],
          alerts: [{ severity: 'warning', message: 'Significant labour shortage projected for week 20 — post jobs now', days_until: 12 }],
        },
        {
          period: 'Wk 21',
          forecasted_demand: 20,
          current_capacity: 16,
          gap: 4,
          trade_breakdown: [{ trade: 'Electricians', needed: 9, available: 7 }, { trade: 'Plumbers', needed: 6, available: 5 }, { trade: 'Labourers', needed: 5, available: 4 }],
          alerts: [],
        },
        {
          period: 'Wk 22',
          forecasted_demand: 15,
          current_capacity: 16,
          gap: -1,
          trade_breakdown: [{ trade: 'Electricians', needed: 6, available: 7 }, { trade: 'Plumbers', needed: 5, available: 5 }, { trade: 'Labourers', needed: 4, available: 4 }],
          alerts: [],
        },
      ],
    })
  }),

  // ─── AI Matches ───────────────────────────────────────────
  http.get(`${BASE}/employer/jobs/:id/matched-workers`, async () => {
    await delay(800)
    return HttpResponse.json({ data: mockMatches })
  }),

  // ─── Employer Bookings ────────────────────────────────────
  http.get(`${BASE}/employer/bookings`, async ({ request }) => {
    await delay(DELAY)
    const status = new URL(request.url).searchParams.get('status')
    const bookings = status ? mockBookings.filter((b) => b.status === status) : mockBookings
    return HttpResponse.json({
      data: bookings,
      meta: { current_page: 1, last_page: 1, per_page: 20, total: bookings.length },
    })
  }),

  http.post(`${BASE}/employer/bookings`, async () => {
    await delay(DELAY)
    const newBooking = {
      ...mockBookings[0],
      id: `bk-${Date.now()}`,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json({ data: newBooking }, { status: 201 })
  }),

  http.post(`${BASE}/employer/bookings/:id/confirm`, async ({ params }) => {
    await delay(DELAY)
    const booking = mockBookings.find((b) => b.id === params.id)
    if (!booking) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    booking.status = 'confirmed'
    return HttpResponse.json({ data: booking })
  }),

  http.post(`${BASE}/employer/bookings/:id/cancel`, async ({ params }) => {
    await delay(DELAY)
    const booking = mockBookings.find((b) => b.id === params.id)
    if (!booking) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    booking.status = 'cancelled'
    return HttpResponse.json({ data: booking })
  }),

  http.post(`${BASE}/employer/bookings/:id/rate`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'Rating submitted' })
  }),

  // ─── Worker Bookings ──────────────────────────────────────
  http.get(`${BASE}/worker/bookings`, async ({ request }) => {
    await delay(DELAY)
    const status = new URL(request.url).searchParams.get('status')
    const bookings = status ? mockBookings.filter((b) => b.status === status) : mockBookings
    return HttpResponse.json({
      data: bookings,
      meta: { current_page: 1, last_page: 1, per_page: 20, total: bookings.length },
    })
  }),

  // ─── Worker Profile & Jobs ────────────────────────────────
  http.get(`${BASE}/worker/profile`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ data: mockWorkerProfile })
  }),

  http.put(`${BASE}/worker/profile`, async ({ request }) => {
    await delay(DELAY)
    const body = await request.json() as Partial<typeof mockWorkerProfile>
    Object.assign(mockWorkerProfile, body)
    return HttpResponse.json({ data: mockWorkerProfile })
  }),

  http.get(`${BASE}/worker/jobs`, async ({ request }) => {
    await delay(DELAY)
    const search = new URL(request.url).searchParams.get('search')?.toLowerCase()
    const jobs = search
      ? mockJobs.filter((j) => j.title.toLowerCase().includes(search) || j.location.toLowerCase().includes(search))
      : mockJobs
    const available = jobs.filter((j) => j.status === 'open' || j.status === 'active')
    return HttpResponse.json({
      data: available,
      meta: { current_page: 1, last_page: 1, per_page: 20, total: available.length },
    })
  }),

  http.post(`${BASE}/worker/jobs/:id/apply`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'Application sent' })
  }),

  http.get(`${BASE}/worker/stats`, async () => {
    await delay(DELAY)
    return HttpResponse.json({
      data: {
        upcoming_jobs: 2,
        completed_jobs: 41,
        total_earnings: 28450,
        avg_rating: 4.8,
        availability_status: 'available',
      },
    })
  }),

  // ─── Certifications ───────────────────────────────────────
  http.get(`${BASE}/worker/certifications`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ data: mockCertifications })
  }),

  http.post(`${BASE}/worker/certifications`, async () => {
    await delay(800)
    const newCert = {
      id: `cert-${Date.now()}`,
      worker_id: 'wkr-1',
      name: 'New Certification',
      issuing_body: 'Certifying Body',
      issue_date: new Date().toISOString(),
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    }
    mockCertifications.push(newCert as unknown as typeof mockCertifications[0])
    return HttpResponse.json({ data: newCert }, { status: 201 })
  }),

  http.delete(`${BASE}/worker/certifications/:id`, async ({ params }) => {
    await delay(DELAY)
    const idx = mockCertifications.findIndex((c) => c.id === params.id)
    if (idx !== -1) mockCertifications.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Admin ────────────────────────────────────────────────
  http.get(`${BASE}/admin/users`, async ({ request }) => {
    await delay(DELAY)
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase()
    const role = url.searchParams.get('role')
    let users = [...mockUsers]
    if (search) users = users.filter((u) => u.name.toLowerCase().includes(search) || u.email.includes(search))
    if (role) users = users.filter((u) => u.role === role)
    return HttpResponse.json({ data: users, meta: { current_page: 1, last_page: 1, per_page: 20, total: users.length } })
  }),

  http.post(`${BASE}/admin/users/:id/suspend`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'User suspended' })
  }),

  http.get(`${BASE}/admin/jobs`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ data: mockJobs, meta: { current_page: 1, last_page: 1, per_page: 20, total: mockJobs.length } })
  }),

  http.get(`${BASE}/admin/analytics`, async () => {
    await delay(DELAY)
    return HttpResponse.json({
      data: {
        total_users: 1284,
        total_jobs: 347,
        total_bookings: 892,
        total_revenue: 284750,
        job_fill_rate: 84,
        avg_time_to_hire: 6.4,
        weekly_signups: [
          { week: 'Wk 13', employers: 8, workers: 24 },
          { week: 'Wk 14', employers: 12, workers: 31 },
          { week: 'Wk 15', employers: 9, workers: 28 },
          { week: 'Wk 16', employers: 15, workers: 42 },
          { week: 'Wk 17', employers: 11, workers: 36 },
          { week: 'Wk 18', employers: 14, workers: 39 },
        ],
      },
    })
  }),

  http.get(`${BASE}/admin/disputes`, async () => {
    await delay(DELAY)
    return HttpResponse.json({
      data: [
        { id: 'disp-1', booking_id: 'bk-2', reported_by: 'Acme Construction Ltd', reported_against: 'Priya Sharma', reason: 'Worker did not show up on site on the agreed start date without prior notice.', status: 'open', created_at: '2026-04-20T14:00:00Z' },
        { id: 'disp-2', booking_id: 'bk-3', reported_by: 'Marcus Osei', reported_against: 'Acme Construction Ltd', reason: 'Final payment not received 14 days after job completion.', status: 'investigating', created_at: '2026-04-15T10:00:00Z' },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 2 },
    })
  }),

  http.post(`${BASE}/admin/disputes/:id/resolve`, async () => {
    await delay(DELAY)
    return HttpResponse.json({ message: 'Dispute resolved' })
  }),
]
