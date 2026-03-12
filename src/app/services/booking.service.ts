import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BookingRequest {
  roomId: number;
  employeeName: string;
  bookingDate: string;  // YYYY-MM-DD
  startTime: string;    // HH:mm:ss
  endTime: string;      // HH:mm:ss
}

export interface BookingResponse {
  id?: number;
  roomId: number;
  employeeName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  roomName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new booking
   * Converts time from HH:mm format to HH:mm:ss format required by backend
   */
  createBooking(booking: BookingRequest): Observable<BookingResponse> {
    // Build request matching backend's camelCase format
    const bookingData = {
      roomId: booking.roomId,
      room: '',  // Backend expects this field (can be empty string or room name)
      employeeName: booking.employeeName,
      bookingDate: booking.bookingDate,
      startTime: this.ensureTimeFormat(booking.startTime),
      endTime: this.ensureTimeFormat(booking.endTime)
    };

    console.log('Sending to backend:', bookingData);

    return this.http.post<BookingResponse>(this.apiUrl, bookingData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all bookings
   */
  getBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a booking by ID
   */
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Ensure time is in HH:mm:ss format
   * If input is HH:mm, append :00
   * If already HH:mm:ss, return as is
   */
  private ensureTimeFormat(time: string): string {
    if (!time) return time;
    
    // If time is already in HH:mm:ss format, return as is
    if (time.split(':').length === 3) {
      return time;
    }
    
    // If time is in HH:mm format, append :00
    return time + ':00';
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400 && error.error) {
        // Handle validation errors from backend
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.errors) {
          // Handle ASP.NET Core validation errors
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join(', ');
        }
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Booking Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
