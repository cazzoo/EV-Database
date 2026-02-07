# EV Community Hub

A community-driven electric vehicle database clone of ev-database.org, featuring gamification, contribution rewards, and tiered API access.

## 🎯 Purpose & Goals

- **Community-First**: Build the most comprehensive, community-curated EV database
- **Gamified Contributions**: Reward contributors with XP, badges, and virtual credits
- **Merit-Based Roles**: Users unlock roles through meaningful contributions
- **Sustainable Ecosystem**: Virtual credits can be earned or purchased, funding development

## ✨ Key Features

### 🔋 EV Database
- Comprehensive electric vehicle catalog with detailed specs
- Community-editable data with verification system
- Advanced search and filtering (range, price, charging, etc.)
- Side-by-side comparison tools
- User reviews and ratings

### 🏆 Gamification System
- **XP (Experience Points)**: Earned through contributions
- **Levels**: Unlock at specific XP thresholds
- **Badges**: Achievement-based rewards
- **Leaderboards**: Weekly, monthly, and all-time rankings
- **Streaks**: Bonus XP for consistent contributions

### 👥 Roles (Merit-Based)
| Role | XP Required | Benefits |
|------|-------------|----------|
| Newcomer | 0 | Basic browsing, limited API |
| Contributor | 100 | Edit data, earn credits |
| Expert | 500 | Verify edits, create guides |
| Moderator | 2000 | Content moderation, events |
| Champion | 5000 | Feature requests priority |
| Legend | 15000 | Advisory board voting |

### 💰 Virtual Credits
- **Free Tier**: Earn through contributions (5 credits/day limit)
- **Premium**: Purchase with real money ($1 = 100 credits)
- **API Usage**: Public (free) and Registered (credits-based) endpoints

### 🔌 API Access
- **Public API**: Basic vehicle data, rate-limited
- **Registered API**: Full data, higher limits, credits per request
- **Commercial License**: Unlimited access for partners

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, DaisyUI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (EV data, contributions, credits)
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard with stats
│   ├── ev/[slug]/         # EV detail pages
│   ├── leaderboard/       # Gamification rankings
│   └── contribute/        # Contribution workflows
├── components/            # Reusable UI components
│   ├── ui/               # Base DaisyUI components
│   ├── ev/               # EV-specific components
│   └── gamification/     # Badges, XP, leaderboards
├── lib/                   # Utility functions and configs
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── gamification.ts   # XP and level logic
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Bun 1.0+
- PostgreSQL database

### Installation
```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and auth secrets

# Initialize database
bun db:generate
bun db:push

# Run development server
bun dev
```

### Environment Variables
```
DATABASE_URL="postgresql://user:password@localhost:5432/ev_hub"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📝 Major Changes

### v1.0.0 (2025-01-08)
- Initial project setup with Next.js 15, Tailwind CSS v4, DaisyUI
- Prisma schema with comprehensive EV data models
- Gamification system with XP, levels, badges, and leaderboards
- User roles with merit-based progression
- Virtual credits system (earn through contributions or purchase)
- Dual-tier API access (public and registered with credits)

## 🎨 Design Principles

1. **Accessibility First**: All components meet WCAG 2.1 AA standards
2. **Mobile Responsive**: Fluid design from mobile to desktop
3. **Performance**: Server components by default, lazy load heavy UI
4. **Progressive Enhancement**: Core features work without JavaScript
5. **Community Voice**: Feature prioritization based on user feedback

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Earn XP for your contribution!
