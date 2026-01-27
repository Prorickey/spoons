# Spoons

A web application for managing campus-wide elimination games at NCSSM (North Carolina School of Science and Mathematics). Players are assigned targets to "eliminate" using spoons and submit kills with GPS verification.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma 7 ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Maps**: Google Maps API for kill location verification

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)
- Google Cloud Console project with OAuth credentials
- Google Maps API key

## Local Development

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd spoons
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://spoonwebsite:spoonmasterpass@localhost:5432/spoons"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 3. Start the database

```bash
docker run --name spoons-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=spoonmasterpass \
  -e POSTGRES_DB=spoons \
  -e POSTGRES_USER=spoonwebsite \
  -d postgres
```

### 4. Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Docker Deployment

For production deployment using Docker Compose:

### 1. Create environment file

Create a `.env` file with your production secrets:

```env
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 2. Start the stack

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- Next.js application on port 3000

### 3. Run migrations

```bash
docker-compose exec web npx prisma migrate deploy
```

### 4. Seed initial data (first time only)

```bash
docker-compose exec web npx prisma db seed
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Check code formatting |
| `npm run format:fix` | Auto-fix formatting issues |
| `npm run make-gamemaster <email>` | Grant gamemaster privileges to a user |
| `npm run docker:build` | Build Docker image with version tag |
| `npm run docker:push` | Push Docker image to registry |
| `npm run docker:release` | Build and push Docker image |

## Admin Setup

To make a user a gamemaster (admin), they must first sign in once, then run:

```bash
npm run make-gamemaster user@ncssm.edu
```

Gamemasters can access the admin dashboard at `/spoonmaster` to:
- Assign and reshuffle targets
- View and manage all kills
- Approve or revert contested kills
- Configure game settings (FFA mode, sign-ups)

## Project Structure

```
spoons/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── admin/         # Admin-only endpoints
│   │   ├── auth/          # NextAuth.js configuration
│   │   └── ...            # Game endpoints (kills, targets, etc.)
│   ├── account/           # Player account page
│   ├── gameStatus/        # Leaderboard page
│   ├── spoonmaster/       # Admin dashboard
│   └── target/            # Current target page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   └── targetAssignment.ts # Target assignment algorithm
├── scripts/              # CLI utilities
│   └── make-gamemaster.ts # Grant admin privileges
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Data models
│   └── migrations/       # Migration files
└── prisma.config.ts      # Prisma 7 configuration
```

## How the Game Works

1. **Registration**: Players sign in with their `@ncssm.edu` Google account and complete their profile (hall, grade, phone number)

2. **Target Assignment**: The gamemaster assigns targets through the admin dashboard. Each player is assigned one target to eliminate, forming a circular chain

3. **Making Kills**: Players "eliminate" their target by tapping them with a spoon and submitting the kill through the app with:
   - GPS location verification
   - The name of their next target (to prove they saw the target's info)

4. **Contesting**: Victims can contest kills they believe are invalid. The gamemaster reviews and approves/rejects contested kills

5. **Winning**: The last player standing wins, or the player with the most kills when time runs out

## User Roles

- **Player**: Can view their target, submit kills, and contest their elimination
- **Gamemaster**: Has access to the admin dashboard (`/spoonmaster`) to manage the game, assign targets, and approve kills

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Random string for session encryption | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your environment variables

## License

MIT
