# AI Career Agent

## UiPath AgentHack 2026

**Track:** UiPath Maestro Case

---

# Overview

AI Career Agent is an AI-powered job application platform that helps candidates organize and optimize their entire job search in one place.

Instead of manually tracking applications across spreadsheets, documents, and emails, AI Career Agent creates an intelligent application case for every opportunity and guides candidates through the complete hiring process.

The platform combines AI, workflow automation, and structured case management to simplify job searching while keeping the user in control.

---

# Problem

Finding a new job involves many repetitive and time-consuming tasks:

- Tracking dozens of applications
- Comparing job descriptions
- Understanding how well your skills match
- Writing tailored cover letters
- Following interview progress
- Managing offers and rejections

Most candidates rely on spreadsheets, notes, or memory.

AI Career Agent centralizes the entire process into a single intelligent workspace.

---

# Solution

AI Career Agent automatically creates an application workflow for every job opportunity.

The platform uses AI to:

- Analyze the candidate's professional profile
- Compare it with a job description
- Calculate a compatibility score
- Identify strengths and missing skills
- Generate personalized cover letters
- Organize every application into a structured case
- Track the complete hiring process from start to finish

---

# Why Track 1 – UiPath Maestro Case

Every application becomes its own case.

Each case progresses through multiple stages while AI agents assist the candidate throughout the process.

```text
Job Added
      ↓
AI Match Analysis
      ↓
Cover Letter Generation
      ↓
Application Case Created
      ↓
Ready to Apply
      ↓
Applied
      ↓
Interview
      ↓
Offer
      ↓
Hired / Rejected
```

Humans remain in control of every important decision while AI automates repetitive work.

This aligns closely with the UiPath Maestro Case challenge, where work progresses through dynamic stages involving AI agents, automations, and human approvals.

---

# Features

- AI Job Match Analysis
- AI Cover Letter Generation
- Secure User Authentication
- Personal User Profiles
- User-specific Data Isolation
- Application Case Management
- Hiring Pipeline Tracking
- Dashboard & Analytics
- Responsive UI
- Cloud Deployment

---

# Architecture

```text
React + TypeScript
        │
        ▼
Spring Boot REST API
        │
        ▼
PostgreSQL Database
        │
        ▼
OpenAI API
```

For the hackathon, UiPath Maestro orchestrates the complete application lifecycle while AI agents perform specialized tasks such as profile evaluation, job matching, and cover letter generation.

---

# User Workflow

1. Create an account
2. Complete your professional profile
3. Add a job posting
4. AI analyzes the job description
5. AI generates a personalized cover letter
6. Create an application case
7. Track the application through each hiring stage
8. Manage interviews, offers, and final outcomes

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack React Query
- Axios

## Backend

- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL

## Artificial Intelligence

- OpenAI API

## Deployment

- Vercel
- Railway

---

# UiPath Components

This project is designed to integrate with:

- UiPath Maestro Case
- UiPath Automation Cloud
- UiPath API Workflows
- UiPath Coding Agents
- External AI Agents (OpenAI)

UiPath acts as the orchestration layer while AI agents perform intelligent analysis and document generation.

---

# Future UiPath Workflow

A future version of AI Career Agent will orchestrate every application through UiPath Maestro Case.

Examples include:

- Automatically creating new application cases
- Scheduling follow-up reminders
- Sending interview preparation tasks
- Escalating inactive applications
- Coordinating AI agents with human approvals
- Automating recruiter communications

---

# Installation

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

## Backend

```env
OPENAI_API_KEY=your_openai_api_key
```

## Frontend

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

# License

MIT License

---

# Built For

Built for **UiPath AgentHack 2026** using **UiPath Maestro Case**, **Spring Boot**, **React**, **OpenAI**, and **PostgreSQL**.
