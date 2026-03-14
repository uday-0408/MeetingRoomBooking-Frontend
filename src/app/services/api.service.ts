import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Room {
  id?: number;
  name: string;
  capacity: number;
  location: string;
}

export interface CreateRoomRequest {
  roomName: string;
  capacity: number;
  location: string;
}

export interface Booking {
  id?: number;
  employeeName: string;
  roomId: number;
//   roomName?: string;
  bookingDate: string;  // Backend expects "bookingDate" in YYYY-MM-DD format
  startTime: string;    // Backend expects "HH:mm:ss" format
  endTime: string;      // Backend expects "HH:mm:ss" format
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl; // Loaded from environment configuration

  constructor(private http: HttpClient) { }

  // Room endpoints
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/rooms`)
      .pipe(catchError(this.handleError));
  }

  createRoom(room: any): Observable<Room> {
    return this.http.post<Room>(`${this.baseUrl}/rooms`, room)
      .pipe(catchError(this.handleError));
  }

  // Booking endpoints
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings`)
      .pipe(catchError(this.handleError));
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/bookings`, booking)
      .pipe(catchError(this.handleError));
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/bookings/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
