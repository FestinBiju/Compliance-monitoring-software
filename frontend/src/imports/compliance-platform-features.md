CORE PRODUCT FEATURES (MVP)
1️⃣ Source Monitoring
What it does
Monitor selected regulatory sources

Store snapshots

Track last checked time

Track last change detected

Backend Needs
Source table

id

name

url

category (DPDP, RBI, etc.)

last_checked

last_changed

status (active/inactive)

Frontend Screen:
👉 Sources Dashboard

Must show:

Source Name

URL

Last Checked

Last Change Detected

Status indicator (Active / Error)

Also:

Add new source

Edit source

Toggle monitoring

2️⃣ Change Detection Engine
What it does
Compare new content with previous snapshot

Generate diff

Store change record

Backend Needs
Change table

id

source_id

change_summary

raw_diff

risk_level

detected_at

Frontend Screen:
👉 Changes Feed

Display:

Chronological list of changes

Risk level badge

Short summary

View details button

Think: Compliance version of GitHub commits.

3️⃣ AI Summary Generator
What it does
Convert raw diff into:

Plain summary

Who is affected

What to do

Backend Needs
Store:

ai_summary

recommended_action

affected_sector

Frontend Screen:
👉 Change Details Page

Must show:

Original source name

Full AI summary

Risk level

Recommended actions

Expandable raw diff

This is your “wow” screen.

4️⃣ Risk Classification
What it does
Assign:

Low

Medium

High

Critical

Based on:

Keywords

Type of update

Deadline change

Frontend Needs:
Color-coded badges

Risk filter

5️⃣ Alerting System
What it does
Email alert

Slack webhook

Telegram optional

Backend Needs:
Basic notification service

Store last alert sent

Frontend Screen:
👉 Settings Page

Allow:

Enable email alerts

Configure webhook

Select risk threshold

6️⃣ Monitoring Status & Health
What it does
Show:

Last system run

DB status

Source fetch status

Frontend:
Add small:
👉 System Status Panel

Green / Red indicator

Backend health

DB health

📊 Frontend Screen Map (What You Actually Need)
Now let’s convert features → UI layout.

🏠 1. Dashboard (Main Page)
Sections:

Total Sources Monitored

Total Changes This Month

High Risk Alerts Count

Latest 5 Changes

This is your summary screen.

📡 2. Sources Page
Table layout:
| Name | URL | Status | Last Checked | Last Change | Actions |

Actions:

Edit

Delete

Toggle On/Off

Add Source button on top.

🔔 3. Changes Feed Page
Filter bar:

Risk Level

Source

Date range

Card layout:

Source name

Summary

Risk badge

Date

View Details

📄 4. Change Detail Page
Layout:

Left side:

AI Summary

Affected Category

Risk level

Right side:

Recommended Actions

Compliance Checklist

Below:

Expandable raw diff viewer

⚙ 5. Settings Page
Email notification toggle

Slack webhook input

Risk threshold dropdown

Test notification button

🖥 6. System Status Page (Optional but strong)
Show:

Backend connection

Database connection

Scheduler running

Last job run

Makes it look enterprise.

🎨 UI Style Direction (Important)
You are building:

NOT:
❌ Startup toy app
NOT:
❌ News dashboard

You are building:
✅ Compliance Intelligence Platform

So design should be:

Clean

Structured

Minimal color

Dark blue / slate theme

Risk colors: Green, Yellow, Orange, Red