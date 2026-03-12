# Environment Configuration Guide

## Overview

This project uses Angular's environment configuration system to manage settings like API URLs across different environments (development, production, etc.).

## Files Created

### 1. **Environment Files** (Angular Standard)

#### `src/environments/environment.ts` (Development)
- Used during local development (`ng serve`)
- Contains development API URL and settings
- **Edit this file** to change your local backend URL

#### `src/environments/environment.prod.ts` (Production)
- Used when building for production (`ng build --configuration production`)
- Contains production API URL and settings
- **Edit this file** before deploying to production

### 2. **Reference File**

#### `.env.example`
- Documentation and reference file
- Copy this to `.env` if you want to keep local settings
- **Note**: Angular doesn't natively read `.env` files without additional packages

## How to Change Backend URL

### For Development

1. Open `src/environments/environment.ts`
2. Change the `apiUrl` value:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api', // <-- Change this
     appName: 'Meeting Room Booking System',
     version: '1.0.0'
   };
   ```

### For Production

1. Open `src/environments/environment.prod.ts`
2. Change the `apiUrl` value:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-api.com/api', // <-- Change this
     appName: 'Meeting Room Booking System',
     version: '1.0.0'
   };
   ```

## Usage in Code

The API service automatically uses the environment configuration:

```typescript
import { environment } from '../../environments/environment';

export class ApiService {
  private baseUrl = environment.apiUrl; // Automatically loads correct URL
}
```

You can also use environment variables in any component:

```typescript
import { environment } from '../environments/environment';

export class MyComponent {
  apiUrl = environment.apiUrl;
  appName = environment.appName;
  isProduction = environment.production;
}
```

## Running the Application

### Development Mode
```bash
# Uses environment.ts (development settings)
ng serve
# or
npm start
```

### Production Build
```bash
# Uses environment.prod.ts (production settings)
ng build --configuration production
```

### Development Build
```bash
# Uses environment.ts explicitly
ng build --configuration development
```

## Adding More Configuration

You can add any settings to the environment files:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  appName: 'Meeting Room Booking System',
  version: '1.0.0',
  
  // Add your custom settings
  enableLogging: true,
  maxUploadSize: 5242880, // 5MB
  apiTimeout: 30000, // 30 seconds
  features: {
    darkMode: true,
    notifications: true
  }
};
```

## Multiple Environments

You can create additional environment files for staging, testing, etc.:

1. Create new file: `src/environments/environment.staging.ts`
2. Add configuration to `angular.json`:
   ```json
   "configurations": {
     "staging": {
       "fileReplacements": [
         {
           "replace": "src/environments/environment.ts",
           "with": "src/environments/environment.staging.ts"
         }
       ]
     }
   }
   ```
3. Build with: `ng build --configuration staging`

## Common URLs by Environment

### Development (Local Backend)
```typescript
apiUrl: 'http://localhost:5000/api'
apiUrl: 'http://localhost:5001/api'
apiUrl: 'http://127.0.0.1:5000/api'
```

### Development (Network Backend)
```typescript
apiUrl: 'http://192.168.1.100:5000/api' // Replace with your machine's IP
```

### Production (Deployed)
```typescript
apiUrl: 'https://api.yourdomain.com/api'
apiUrl: 'https://yourdomain.com/api'
```

## CORS Configuration Reminder

When you change the backend URL, make sure your backend allows CORS from your frontend URL:

### ASP.NET Core Backend (Program.cs)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",        // Development
            "https://your-app.com"          // Production
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

app.UseCors("AllowAngular");
```

## Security Best Practices

1. ✅ **Never commit sensitive data** to environment files
2. ✅ **Use different URLs** for development and production
3. ✅ **Don't expose API keys** in frontend code (use backend for sensitive operations)
4. ✅ **Add `.env`** to `.gitignore` if you create local `.env` files
5. ✅ **Use HTTPS** in production

## Troubleshooting

### Issue: Changes not reflected
**Solution**: Restart the dev server (`ng serve`)

### Issue: Wrong environment used
**Solution**: Check the build configuration:
- `ng serve` uses development by default
- `ng build` uses production by default
- Use `--configuration` flag to specify

### Issue: Environment file not found
**Solution**: Make sure the file exists and path in `angular.json` is correct

## Quick Reference

| Command | Environment Used | Config File |
|---------|-----------------|-------------|
| `ng serve` | development | `environment.ts` |
| `ng build` | production | `environment.prod.ts` |
| `ng build --configuration development` | development | `environment.ts` |
| `ng build --configuration production` | production | `environment.prod.ts` |

---

**Now you can easily manage your backend URL and other settings!** 🎉

Just edit `src/environments/environment.ts` for development and `src/environments/environment.prod.ts` for production.
