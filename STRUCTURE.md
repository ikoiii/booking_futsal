# 📁 Project Structure Documentation

## 🏗️ Updated Folder Structure

This project has been reorganized to follow modern Next.js best practices and align with the app flow defined in `lib/app-flow-final.md`.

```
my-app/
├── 📂 app/                           # Next.js App Router pages
│   ├── 📂 api/                      # API routes
│   │   ├── 📂 auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts       # POST - User login
│   │   │   ├── logout/route.ts      # POST - User logout
│   │   │   ├── register/route.ts    # POST - User registration
│   │   │   └── session/route.ts     # GET - Check session status
│   │   ├── 📂 bookings/             # Booking management
│   │   │   ├── available/route.ts   # POST - Check availability
│   │   │   ├── cancel/route.ts      # POST - Cancel booking
│   │   │   ├── create/route.ts      # POST - Create booking
│   │   │   ├── user/route.ts        # GET - User bookings
│   │   │   └── 📂 [id]/             # Dynamic booking routes
│   │   └── 📂 admin/                # Admin endpoints
│   │       ├── bookings/route.ts    # GET - All bookings
│   │       └── users/route.ts       # GET - User management
│   ├── 📂 admin/                    # Admin dashboard pages
│   ├── 📂 booking/                  # Booking pages
│   ├── 📂 lapangan/                 # Field listing & details
│   ├── 📂 profile/                  # User profile management
│   ├── 📂 auth/                     # Auth pages (login, register)
│   └── layout.tsx                   # Root layout
├── 📂 components/                   # Reusable React components
│   ├── 📂 ui/                       # shadcn/ui components
│   ├── 📂 auth/                     # Authentication components
│   ├── 📂 booking/                  # Booking related components
│   ├── Header.tsx                   # Main navigation
│   └── Footer.tsx                   # Page footer
├── 📂 lib/                          # Utility libraries
│   ├── database.ts                  # Database connection
│   ├── database.helpers.ts          # Database query helpers
│   ├── auth.ts                      # Authentication logic
│   ├── validation.ts                # Form validation schemas
│   ├── utils.ts                     # General utilities
│   └── lapangan.ts                  # Field related utilities
├── 📂 types/                        # TypeScript type definitions
│   ├── auth.ts                      # User & auth types
│   ├── booking.ts                   # Booking & field types
│   ├── review.ts                    # Review types
│   └── api.ts                       # API response types
├── 📂 config/                       # Configuration files
│   ├── database.ts                  # Database configuration
│   └── auth.ts                      # Authentication configuration
├── 📂 middleware/                   # Next.js middleware
│   └── auth.ts                      # Authentication middleware
├── 📂 hooks/                        # Custom React hooks
│   └── use-api.ts                   # API call hooks
├── 📂 constants/                    # Application constants
│   └── index.ts                     # All constants
├── 📂 public/                       # Static assets
├── 📂 database/                     # Database schema
│   └── futsal_booking.sql           # SQL schema
└── 📄 lib/app-flow-final.md         # Application flow documentation
```

## 🔄 Key Improvements

### ✅ **Better Organization**
- **Types separated by domain** (`types/auth.ts`, `types/booking.ts`, etc.)
- **Configuration centralized** in `config/` folder
- **Middleware** properly organized
- **Custom hooks** for reusable logic

### ✅ **Cleaner Imports**
- Database helpers use proper TypeScript imports
- Configuration separated from implementation
- Types properly organized and re-exported

### ✅ **Following app-flow-final.md**
- Structure aligns with defined user journey
- API routes organized by feature
- Component structure supports the application flow

## 🚀 Quick Start

1. **Database Setup**
   ```bash
   # Start XAMPP MySQL
   # Import database schema
   mysql -u root -p futsal_booking < database/futsal_booking.sql
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 Environment Variables

Create `.env.local` file with:

```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=futsal_booking
DB_PORT=3306

# Authentication
SESSION_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔧 Development Guidelines

### **Adding New Features**

1. **Create types** in appropriate `types/` file
2. **Add database helpers** in `lib/database.helpers.ts`
3. **Create API routes** in `app/api/`
4. **Build components** in `components/`
5. **Add pages** in `app/`

### **Database Operations**

- Use `lib/database.helpers.ts` for all database operations
- Import types from `types/` directory
- Follow the existing helper class patterns

### **Authentication**

- Use middleware functions for protected routes
- Import auth config from `config/auth.ts`
- Use auth helpers from `lib/auth.ts`

## 🎯 Aligned with App Flow

This structure supports the complete user journey:

- **Guest users** → Browse → Register → Login
- **Authenticated users** → Dashboard → Bookings → Profile
- **Admin users** → Admin Panel → Management

Each folder and file placement supports the logical flow defined in `lib/app-flow-final.md`.