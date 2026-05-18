# StayFlow AI 🏨

**AI-powered front desk SaaS for independent hotels.**

> Answer every call, book more rooms, reduce missed reservations, and operate 24/7 — without hiring additional reception staff.

---

## Product Overview

StayFlow AI is a multi-tenant SaaS platform that gives independent and boutique hotels a 24/7 AI receptionist. It handles inbound calls, answers FAQs, captures booking leads, sends SMS follow-ups, and provides rich analytics — all from a clean, modern dashboard.

---

## Pages & Features

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page with live call demo, ROI calculator, pricing |
| `/dashboard` | Hotel metrics, call volume chart, AI performance, live reservations |
| `/call-analytics` | Full call log, transcripts, sentiment & intent analysis |
| `/reservations` | Guest leads & booking pipeline with estimated revenue |
| `/knowledge-base` | RAG document manager — train the AI on hotel docs |
| `/ai-config` | Voice, tone, greeting, languages, escalation rules |
| `/team` | Role-based access control, invite flow, notification settings |
| `/billing` | Subscription plans, usage meters, invoice history |

---

## Data Entities

- **Hotel** — multi-tenant hotel workspace with AI config, usage limits, Twilio integration
- **Call** — every inbound call with transcript, sentiment, intent, booking outcome
- **Reservation** — guest leads and confirmed bookings captured via AI
- **KnowledgeBase** — hotel documents for RAG-based FAQ answering
- **StaffMember** — team members with roles and notification preferences
- **SMSLog** — automated SMS messages sent after calls

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS
- **Backend/DB:** Base44 (managed BaaS — entities, auth, storage)
- **AI:** OpenAI (voice, RAG, conversation intelligence)
- **Telephony:** Twilio Voice API
- **Payments:** Stripe
- **Design:** Dark stone/amber palette — Linear/Stripe-level polish

---

## Subscription Plans

| Plan | Price | Minutes | Properties |
|------|-------|---------|------------|
| Starter | $149/mo | 200 min | 1 |
| Pro | $349/mo | 500 min | 3 |
| Multi-Property | $799/mo | Unlimited | Unlimited |

---

## Roadmap (V2)

- [ ] Twilio webhook handler (live call processing)
- [ ] OpenAI Realtime API integration
- [ ] PMS integrations (Opera, Cloudbeds, etc.)
- [ ] Outbound AI calling
- [ ] WhatsApp concierge
- [ ] OTA sync
- [ ] Voice cloning

---

Built with [Base44](https://base44.com) · © 2026 StayFlow AI
