# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spoons is a Next.js web app for managing campus-wide elimination games. Players are assigned targets to eliminate and submit kills with GPS verification. See README.md for full setup instructions.

## Quick Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run format:fix   # Auto-fix formatting
```

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Prisma 7 + PostgreSQL + NextAuth.js

## Key Files

- `lib/prisma.ts` - Shared Prisma client instance
- `lib/targetAssignment.ts` - Target assignment algorithm
- `prisma.config.ts` - Prisma 7 configuration (database URL lives here)
- `prisma/schema.prisma` - Database models
- `app/api/` - API routes
- `app/spoonmaster/` - Admin dashboard (gamemaster-only)

## Database Models

- **User** - Players with game state (currentTarget, totalKills, killed, killedBy)
- **Kill** - Kill records with GPS coordinates and approval status
- **GameConfiguration** - Key-value store (status, sign_ups_open, ffa)
- **TargetRules** - Constraints for target assignment

## Authentication

Google OAuth restricted to `@ncssm.edu` emails. Users with `gamemaster: true` can access `/spoonmaster`.

## Prisma 7 Notes

- Uses `@prisma/adapter-pg` driver adapter
- Generated client at `prisma/generated/prisma/client`
- Database URL in `prisma.config.ts`, not in schema.prisma
- Run `npx prisma generate` after schema changes
