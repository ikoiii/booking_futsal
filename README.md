# FutsalKu Booking System

A modern, responsive futsal field booking application built with Next.js, TypeScript, and shadcn/ui components.

## Features

### ✅ Completed Features

#### Authentication System
- **User Registration**: Secure sign-up with email validation
- **User Login**: Email/password authentication with session management
- **Profile Management**: Update personal information and view booking history
- **Logout**: Clean session termination

#### Booking System
- **Field Discovery**: Browse available futsal fields with images and details
- **Availability Check**: Real-time field availability based on date and time
- **Booking Creation**: Easy booking process with time selection
- **Booking Management**: View, cancel, and manage bookings
- **Booking History**: Complete history of past and upcoming bookings

#### Review System
- **Review Creation**: Post reviews and ratings for completed bookings
- **Review Display**: View average ratings and individual reviews
- **Review Validation**: Only users who booked can leave reviews

#### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design using shadcn/ui components
- **Toast Notifications**: User-friendly feedback for all actions
- **Loading States**: Smooth loading animations and placeholders

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with modern design principles
- **UI Components**: shadcn/ui for consistent, accessible components
- **State Management**: React hooks (useState, useEffect)

### Backend
- **API Routes**: Next.js API routes for server-side logic
- **Database**: MySQL with XAMPP integration
- **Database Library**: mysql2/promise for async database operations

### Key Features
- **Type Safety**: Full TypeScript integration across frontend and backend
- **Modern Design**: shadcn/ui components with consistent styling
- **Responsive Layout**: Mobile-first approach with responsive grid systems
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: Session-based authentication with proper validation

## Project Structure

```
my-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── bookings/          # Booking management
│   │   └── reviews/           # Review system
│   ├── booking/               # My Bookings page
│   ├── lapangan/              # Field listing and details
│   ├── login/                 # Login page
│   ├── profile/               # User profile management
│   └── register/              # Registration page
├── components/                # Reusable UI components
│   ├── ui/                   # shadcn/ui components
│   ├── Header.tsx            # Navigation header
│   └── Footer.tsx            # Footer component
├── lib/                      # Utility functions
│   ├── auth.ts              # Authentication types
│   ├── database.ts          # Database helpers
│   └── utils.ts             # Utility functions
├── public/                   # Static assets
└── database/                 # Database schema
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (via XAMPP or similar)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   - Start XAMPP MySQL
   - Create database `futsal_booking`
   - Run the SQL schema from `database/futsal_booking.sql`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit `http://localhost:3000`

## Database Schema

The application uses a MySQL database with the following tables:

- **users**: User information and authentication
- **lapangans**: Futsal field details and pricing
- **bookings**: Booking records with status tracking
- **reviews**: User reviews and ratings

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/session` - Get current session
- `PUT /api/auth/session` - Update profile
- `POST /api/auth/logout` - User logout

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/user/[id]` - Get user bookings
- `POST /api/bookings/cancel` - Cancel booking
- `GET /api/lapangan/[id]/availability` - Check availability

### Reviews
- `POST /api/reviews/create` - Create review
- `GET /api/lapangan/[id]/reviews` - Get field reviews

## Usage

1. **Registration/Login**: New users can register or existing users can log in
2. **Browse Fields**: View available futsal fields with details and prices
3. **Check Availability**: Select date and time to see available fields
4. **Make Booking**: Choose field and time slot, confirm booking
5. **Manage Bookings**: View booking history and cancel if needed
6. **Leave Reviews**: Rate and review completed bookings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**FutsalKu Booking System** - Modern, reliable, and user-friendly futsal field booking solution.
