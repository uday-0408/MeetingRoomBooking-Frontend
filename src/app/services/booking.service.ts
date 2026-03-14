import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Booking, CreateBookingRequest } from './api.service';

export interface BookingFormValue {
  roomId: number;
  employeeName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private apiService: ApiService) {}

  getBookings(): Observable<Booking[]> {
    return this.apiService.getBookings();
  }

  createBookingFromForm(formValue: BookingFormValue): Observable<Booking> {
    const payload: CreateBookingRequest = {
      roomId: Number(formValue.roomId),
      employeeName: formValue.employeeName.trim(),
      bookingDate: this.ensureDateFormat(formValue.bookingDate),
      startTime: this.ensureTimeSpanFormat(formValue.startTime),
      endTime: this.ensureTimeSpanFormat(formValue.endTime)
    };

    return this.apiService.createBooking(payload);
  }

  deleteBooking(id: number): Observable<void> {
    return this.apiService.deleteBooking(id);
  }

  private ensureDateFormat(value: string): string {
    // HTML date input already returns YYYY-MM-DD, this keeps strict backend format.
    return value;
  }

  private ensureTimeSpanFormat(value: string): string {
    if (!value) {
      return value;
    }

    return value.length === 5 ? `${value}:00` : value;
  }
}
