# Meeting Room Booking System - Angular Frontend

A modern Angular application for managing meeting room bookings, integrated with an ASP.NET Core Web API backend.

## Features

### 1. **Rooms Page**
- Display all available meeting rooms
- Show room details (name, capacity, location)
- Quick book button for each room

### 2. **Booking Form**
- Reactive form with validation
- Fields: Employee Name, Room, Date, Start Time, End Time
- Real-time validation feedback
- Success/error message handling

### 3. **Booking List**
- Display all bookings in a table
- View employee name, room, date, and times
- Delete bookings with confirmation
- Auto-refresh after deletion

## Technical Stack

- **Framework**: Angular 17
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Styling**: Bootstrap 5.3
- **Routing**: Angular Router

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   └── api.service.ts          # HTTP service for API calls
│   ├── rooms/
│   │   ├── rooms.component.ts      # Rooms list component
│   │   ├── rooms.component.html
│   │   └── rooms.component.css
│   ├── booking-form/
│   │   ├── booking-form.component.ts    # Booking form component
│   │   ├── booking-form.component.html
│   │   └── booking-form.component.css
│   ├── booking-list/
│   │   ├── booking-list.component.ts    # Bookings list component
│   │   ├── booking-list.component.html
│   │   └── booking-list.component.css
│   ├── app.component.ts            # Root component
│   ├── app.component.html
│   ├── app.component.css
│   ├── app.module.ts               # Main module
│   └── app-routing.module.ts       # Routing configuration
├── index.html
├── main.ts
└── styles.css
```

## API Endpoints

The application connects to the following backend endpoints:

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a new room
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a booking
- `DELETE /api/bookings/{id}` - Delete a booking

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API URL**:
   Edit `src/environments/environment.ts` for development:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api', // Change to your backend URL
     appName: 'Meeting Room Booking System',
     version: '1.0.0'
   };
   ```
   
   Edit `src/environments/environment.prod.ts` for production:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-production-api.com/api', // Change to your production API
     appName: 'Meeting Room Booking System',
     version: '1.0.0'
   };
   ```
   
   > **See [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md) for detailed configuration guide**

3. **Install Angular CLI globally** (if not already installed):
   ```bash
   npm install -g @angular/cli
   ```

### Running the Application

1. **Development server**:
   ```bash
   npm start
   ```
   Or:
   ```bash
   ng serve
   ```

2. Navigate to `http://localhost:4200/` in your browser

3. The application will automatically reload if you change any source files

### Building for Production

```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Usage Guide

### 1. View Meeting Rooms
- Navigate to "Meeting Rooms" from the navigation bar
- Browse available rooms with their details
- Click "Book This Room" to create a booking

### 2. Create a Booking
- Click "Book Room" in the navigation bar or "Book This Room" on a room card
- Fill in the form:
  - Employee Name (required, min 2 characters)
  - Select a Room
  - Choose Date
  - Set Start Time and End Time
- Click "Book Room" to submit
- You'll be redirected to the bookings list after successful submission

### 3. View and Manage Bookings
- Navigate to "All Bookings" from the navigation bar
- View all bookings in a table format
- Click "Delete" to remove a booking (with confirmation)
- Click "+ New Booking" to create another booking

## Features Implemented

✅ **Angular HttpClient** for API communication  
✅ **ApiService** for centralized HTTP methods  
✅ **Reactive Forms** with validation  
✅ **Bootstrap 5** for responsive styling  
✅ **Loading States** with spinners  
✅ **Error Handling** with user-friendly messages  
✅ **Success Messages** for user feedback  
✅ **Form Validation** with real-time feedback  
✅ **Delete Confirmation** dialogs  
✅ **Responsive Design** for all screen sizes  
✅ **Routing** between components  
✅ **Navigation Bar** with active route highlighting  

## Configuration

### Update Backend URL

**Development Environment:**
Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', // Your development backend
  appName: 'Meeting Room Booking System',
  version: '1.0.0'
};
```

**Production Environment:**
Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api.com/api', // Your production backend
  appName: 'Meeting Room Booking System',
  version: '1.0.0'
};
```

> 📖 **For detailed configuration options, see [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md)**

### CORS Configuration

Make sure your ASP.NET Core backend allows CORS from the Angular application:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowAngular");
```

## Troubleshooting

### Issue: "ng: command not found"
**Solution**: Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

### Issue: CORS Error
**Solution**: Ensure your backend has CORS configured correctly to allow requests from `http://localhost:4200`

### Issue: API Connection Failure
**Solution**: Verify the backend URL in `api.service.ts` matches your running backend server

## Future Enhancements

- Add authentication and authorization
- Implement room availability checking
- Add filtering and search functionality
- Export bookings to CSV/PDF
- Email notifications for bookings
- Calendar view for bookings
- Edit existing bookings
- Recurring bookings

## License

This project is created for educational purposes.

## Support

For issues or questions, please contact your development team.
