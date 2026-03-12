# Quick Start Guide

## Welcome to Meeting Room Booking System!

This guide will help you get the application running quickly.

## Step 1: Install Dependencies

Open a terminal in this folder and run:

```bash
npm install
```

This will install all required packages including:
- Angular framework
- Bootstrap for styling
- RxJS for reactive programming
- All development dependencies

**Note**: If you don't have Angular CLI installed globally, install it:
```bash
npm install -g @angular/cli
```

## Step 2: Configure Backend URL

**Option 1: Quick Edit (Recommended)**

1. Open `src/environments/environment.ts`
2. Update the `apiUrl`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api', // <-- Change this to your backend URL
     appName: 'Meeting Room Booking System',
     version: '1.0.0'
   };
   ```

**Option 2: Production Configuration**

For production deployment, edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api', // <-- Your production URL
  appName: 'Meeting Room Booking System',
  version: '1.0.0'
};
```

> 📖 **For more details, see [ENVIRONMENT_CONFIG.md](ENVIRONMENT_CONFIG.md)**

## Step 3: Start the Application

Run the development server:

```bash
npm start
```

Or:

```bash
ng serve
```

The application will be available at: **http://localhost:4200/**

## Step 4: Verify Backend Connection

Make sure your ASP.NET Core backend is running and accessible at the URL you configured.

### Backend CORS Configuration

Your backend must allow CORS from the Angular app. Add this to your ASP.NET Core `Program.cs`:

```csharp
// Add this before building the app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add this after building the app (before app.Run())
app.UseCors("AllowAngular");
```

## Application Structure

```
Meeting Room Booking System
│
├── Navigation Bar
│   ├── Meeting Rooms    → View all available rooms
│   ├── Book Room        → Create a new booking
│   └── All Bookings     → View and manage bookings
│
├── Rooms Page (/)
│   └── Displays all meeting rooms with booking buttons
│
├── Booking Form (/book)
│   └── Form to create a new booking
│
└── Bookings List (/bookings)
    └── Table of all bookings with delete functionality
```

## Testing the Application

### 1. View Rooms
- Navigate to "Meeting Rooms"
- You should see all available rooms from the backend
- If you see an error, check your backend connection

### 2. Create a Booking
- Click "Book Room" or "Book This Room" on a room card
- Fill in all required fields:
  - Employee Name (minimum 2 characters)
  - Room (select from dropdown)
  - Date (future date)
  - Start Time and End Time
- Click "Book Room"
- You should see a success message and be redirected

### 3. View and Delete Bookings
- Navigate to "All Bookings"
- View the table of all bookings
- Click "Delete" on any booking to remove it
- Confirm the deletion in the dialog

## Common Issues and Solutions

### Issue: "Cannot find module '@angular/core'"
**Solution**: Run `npm install` to install dependencies

### Issue: "ng: command not found"
**Solution**: Install Angular CLI globally: `npm install -g @angular/cli`

### Issue: CORS Error in Browser Console
**Solution**: Configure CORS in your backend (see Step 4 above)

### Issue: 404 Error on API Calls
**Solution**: 
- Check that backend is running
- Verify the URL in `api.service.ts`
- Check browser console for exact error

### Issue: Blank Page
**Solution**: 
- Check browser console for errors
- Verify all dependencies are installed
- Make sure you're accessing `http://localhost:4200`

## Folder Structure

```
src/app/
├── services/
│   └── api.service.ts              # HTTP service for all API calls
├── rooms/                          # Rooms list component
│   ├── rooms.component.ts
│   ├── rooms.component.html
│   └── rooms.component.css
├── booking-form/                   # Booking form component
│   ├── booking-form.component.ts
│   ├── booking-form.component.html
│   └── booking-form.component.css
├── booking-list/                   # Bookings list component
│   ├── booking-list.component.ts
│   ├── booking-list.component.html
│   └── booking-list.component.css
├── app.component.*                 # Root component
├── app.module.ts                   # Main module
└── app-routing.module.ts           # Routing configuration
```

## Next Steps

After getting the application running:

1. **Customize the styling** - Edit component CSS files or `src/styles.css`
2. **Update the API URL** - Configure for production environment
3. **Add features** - Implement additional functionality as needed
4. **Deploy** - Build and deploy to your hosting service

## Need Help?

- Check the main README.md for detailed documentation
- Verify backend API is working with tools like Postman
- Check browser console for detailed error messages
- Ensure all required backend endpoints are implemented

## Building for Production

When ready to deploy:

```bash
ng build --configuration production
```

The production-ready files will be in the `dist/meeting-room-booking/` folder.

---

**Happy Coding! 🚀**
