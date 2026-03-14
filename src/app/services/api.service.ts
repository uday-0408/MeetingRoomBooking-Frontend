import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface MeetingRoom {
  id: number;
  roomName: string;
  capacity: number;
  location: string;
  imageUrl: string | null;
}

export interface CreateMeetingRoomRequest {
  roomName: string;
  capacity: number;
  location: string;
  imageUrl: string | null;
}

export interface Booking {
  id: number;
  roomId: number;
  employeeName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

export interface CreateBookingRequest {
  roomId: number;
  employeeName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  role?: string;
  username?: string;
  id?: number;
}

export interface UploadResponse {
  imageUrl?: string;
  url?: string;
  path?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRooms(): Observable<MeetingRoom[]> {
    return this.http.get<MeetingRoom[]>(`${this.baseUrl}/rooms`)
      .pipe(catchError(this.handleError));
  }

  createRoom(room: CreateMeetingRoomRequest): Observable<MeetingRoom> {
    return this.http.post<MeetingRoom>(`${this.baseUrl}/rooms`, room)
      .pipe(catchError(this.handleError));
  }

  updateRoom(id: number, room: CreateMeetingRoomRequest): Observable<MeetingRoom> {
    return this.http.put<MeetingRoom>(`${this.baseUrl}/rooms/${id}`, room)
      .pipe(catchError(this.handleError));
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/rooms/${id}`)
      .pipe(catchError(this.handleError));
  }

  uploadRoomImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(`${this.baseUrl}/rooms/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`)
      .pipe(catchError(this.handleError));
  }

  createBooking(booking: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/bookings`, booking)
      .pipe(catchError(this.handleError));
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/bookings/${id}`)
      .pipe(catchError(this.handleError));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload)
      .pipe(catchError(this.handleError));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (typeof error.error === 'string' && error.error.trim()) {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.title) {
        errorMessage = error.error.title;
      } else if (error.error?.errors) {
        const modelErrors = Object.values(error.error.errors)
          .flat()
          .map((item) => String(item));
        if (modelErrors.length > 0) {
          errorMessage = modelErrors.join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
