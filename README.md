# CHARBT Web

React frontend for CHARBT, a trading-analysis web app focused on market sessions, screenshots, billing, account management, and public trading data.

## Features

- User authentication, registration, email confirmation, and password reset flows.
- Trading workspace with chart views, session controls, position lists, and market data requests.
- Screenshot gallery backed by a configurable public asset collection.
- Subscription and checkout UI built with Stripe Elements.
- Referral, profile, billing, support, terms, and privacy pages.
- AWS S3 and CloudFront deployment workflow through GitHub Actions.

## Tech Stack

- React 18 with Create React App
- Redux Toolkit and React Redux
- React Router
- React Bootstrap / Bootstrap
- Chart.js, lightweight-charts, and AG Charts
- Stripe React SDK
- Axios

## Configuration

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required values depend on the API and deployment environment:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_PUB_URL=http://localhost:5000/pub
REACT_APP_WEB_URL=http://localhost:3000
REACT_APP_SCREENSHOT_COLLECTION=
REACT_APP_STRIPE_PUBLISHABLE_KEY=
REACT_APP_GA_TRACKING_ID=
```

Stripe uses a publishable key on the frontend. Secret Stripe keys, AWS credentials, and backend secrets must stay outside this repository.

## Development

```bash
npm install
npm start
```

Run tests:

```bash
npm test
```

Build production assets:

```bash
npm run build
```

## Deployment

The included GitHub Actions workflow builds the React app and syncs `build/` to S3, then invalidates CloudFront. The workflow expects AWS credentials and the CloudFront distribution id to be configured as GitHub Actions secrets.
