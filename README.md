# AI Resume Assistant

An AI-powered resume analysis web application built for the FlyRank AI Capstone.

## Live Demo

https://ai-resume-assistant-lac.vercel.app

## GitHub

https://github.com/yashkapoor-codes/ai-resume-assistant

## Features

- Paste resume content and analyze it with AI
- AI-generated overall assessment
- Resume strengths
- Areas to improve
- Missing keywords
- Actionable improvement suggestions
- Loading and error states
- Responsive dark UI
- Accessible form controls and keyboard focus states
- Client-side validation
- Automated component tests
- Production deployment on Vercel

## Tech Stack

- React
- Vite
- JavaScript
- Vercel Serverless Functions
- Google Gemini API
- Vitest
- React Testing Library

## AI Integration

The application sends the resume to a secure serverless API endpoint:

`POST /api/analyze`

The serverless function uses Google's Gemini API and returns structured JSON containing:

- summary
- strengths
- weaknesses
- missingKeywords
- suggestions

The Gemini API key is stored as a server-side environment variable and is not exposed to the frontend.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yashkapoor-codes/ai-resume-assistant.git
cd ai-resume-assistant