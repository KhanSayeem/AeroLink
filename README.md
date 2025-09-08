# AeroLink

A comprehensive airline ticket booking system featuring flight search, seat selection, payment processing, and multi-role user management. Built with vanilla HTML, CSS, and JavaScript for maximum compatibility and performance.

## ✈️ About AeroLink

AeroLink is a complete airline booking platform that handles the entire customer journey from flight search to ticket issuance, while providing staff and administrative tools for managing bookings and flight schedules.

## 🚀 Features

### Customer Features
- **Flight Search**: Search flights by origin, destination, date, and class
- **Interactive Seat Map**: Visual seat selection with real-time availability
- **Booking Management**: Complete booking workflow with passenger details
- **Payment Processing**: Secure payment form with validation
- **User Accounts**: Registration, login, and profile management
- **Booking History**: View past and current bookings with status tracking
- **Ticket Downloads**: Generate and download HTML invoices/tickets
- **Notifications**: Real-time booking updates and flight alerts
- **Preferences**: Save preferred flight classes and settings

### Staff Features (Ticket Management)
- **Booking Overview**: View all customer bookings across the system
- **Ticket Operations**: Issue, reissue, and refund tickets
- **Status Updates**: Modify booking statuses with automatic customer notifications
- **Customer Communication**: Send updates and notifications to passengers

### Admin Features (Flight Management)
- **Flight Scheduling**: Add new flights with full details
- **Aircraft Management**: Configure different aircraft types and seat layouts
- **Flight Operations**: Cancel flights with automatic passenger refunds
- **Capacity Management**: Monitor and adjust flight capacities
- **Route Management**: Manage origin-destination pairs and schedules

### System Features
- **Multi-Role Authentication**: Passenger, Staff, and Admin access levels
- **Real-Time Updates**: Live seat availability and booking status
- **Data Persistence**: Browser localStorage with JSON import/export
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Notification System**: Unread booking badges and status alerts

## 🎯 User Roles & Access

### Default Login Credentials
- **Passenger**: `passenger` / `1234`
- **Admin**: `admin` / `1234`
- **Staff**: `staff` / `password`

### Role Permissions
- **Passengers**: Search flights, make bookings, manage profile, view booking history
- **Staff**: All passenger features + ticket management for all bookings
- **Admin**: All features + flight schedule management and system configuration

## 🛠️ Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Responsive grid layouts with Google Fonts integration
- **Vanilla JavaScript**: No frameworks - pure JavaScript implementation
- **Local Storage**: Browser-based data persistence

### Key Technical Features
- **Dynamic Seat Maps**: Visual seat selection with aircraft-specific layouts
- **Modal System**: Confirmation dialogs and interactive popups
- **Form Validation**: Comprehensive input validation and error handling
- **State Management**: Centralized application state with persistence
- **Event-Driven Architecture**: Modular event handling system
- **Spinner Loading**: Visual feedback for asynchronous operations

## 📁 Project Structure

```
AeroLink/
├── index.html              # Main application interface
├── script.js               # Core application logic
├── payment.js              # Payment processing module
├── data.js                 # Sample data and configuration
├── style.css               # Main stylesheet
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely client-side

### Installation
1. Download or clone the project files
2. Open `index.html` in your web browser
3. Start by searching for flights or logging in with demo credentials

### First Steps
1. **Search Flights**: Use the flight search form on the homepage
2. **Create Account**: Register a new passenger account or use demo login
3. **Book Flight**: Select a flight, choose seat, enter passenger details, and pay
4. **Admin Access**: Login as admin to manage flights and view system data

## 🛫 Sample Flight Data

The system includes pre-loaded flights:
- **AL101**: New York → London (Oct 15, 2025)
- **AL102**: London → New York (Oct 20, 2025)
- **AL203**: Paris → Tokyo (Nov 1, 2025)
- **AL304**: Sydney → Los Angeles (Nov 10, 2025)
- **AL405**: Dubai → Singapore (Nov 15, 2025)

## 🏗️ Architecture Overview

### Data Models
- **Flights**: Flight number, route, schedule, aircraft, pricing, seat availability
- **Users**: Username, password, role, preferences
- **Bookings**: Passenger details, flight selection, seat assignment, payment status
- **Aircraft**: Aircraft types with seat configurations and layouts

### State Management
- All data stored in browser localStorage
- Automatic persistence on data changes
- JSON import/export capabilities for data portability
- Session management for user authentication

## 💺 Seat Map System

The seat map feature provides:
- **Visual Layout**: Grid-based seat representation with aisles
- **Real-Time Availability**: Live updates on seat booking status
- **Interactive Selection**: Click-to-select interface
- **Aircraft Variants**: Support for different aircraft configurations
- **Status Indicators**: Available, selected, and booked seat states

## 🔔 Notification System

- **Real-Time Alerts**: Instant notifications for booking changes
- **Unread Badges**: Visual indicators for new notifications
- **Status Updates**: Automatic notifications for ticket operations
- **Persistent Storage**: Notification history preserved across sessions

## 📱 Responsive Design

Optimized for all device types:
- **Desktop**: Full-featured interface with grid layouts
- **Tablet**: Touch-friendly controls with adapted layouts
- **Mobile**: Streamlined interface with collapsible navigation

## 🔧 Customization

### Adding New Flights
Use the admin interface to add flights with:
- Flight number and route information
- Schedule and pricing details
- Aircraft selection and capacity
- Service class availability

### Modifying Aircraft Types
Edit `data.js` to add new aircraft configurations:
```javascript
{
    name: "New Aircraft",
    seats: 200,
    seatLayout: [/* seat configuration */]
}
```

### Customizing Appearance
Modify `style.css` to change:
- Color scheme and branding
- Layout and spacing
- Typography and fonts
- Component styling

## ⚠️ Limitations

- **Data Persistence**: Limited to browser localStorage
- **Payment Processing**: Demo implementation only
- **Multi-Device Sync**: Data doesn't sync across devices
- **Scalability**: Client-side storage has capacity limits
- **Security**: Demo authentication not production-ready

## 🚀 Production Considerations

For real-world deployment, consider:
- **Backend Integration**: Database and server-side processing
- **Payment Gateway**: Real payment processing integration
- **User Authentication**: Secure login and session management
- **Email Systems**: Booking confirmations and notifications
- **API Integration**: Real flight data and booking systems
- **Performance Optimization**: Caching and data optimization

## 📊 Sample Data Overview

### Users
- Multiple role types with different access levels
- Demo accounts for testing all features
- Preference storage for personalization

### Flights
- International and domestic routes
- Various aircraft types and configurations
- Different service classes and pricing

### Bookings
- Sample booking history for demonstration
- Various booking statuses and scenarios
- Realistic passenger information

## 🤝 Contributing

This is a demonstration project showcasing airline booking system functionality. For production use, significant backend development and security enhancements would be required.

## 📄 License

Educational/Demo project - not licensed for commercial use without proper backend implementation and security measures.

---

*Built with vanilla web technologies for educational purposes and system demonstration.*
