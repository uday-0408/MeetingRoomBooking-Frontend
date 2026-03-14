import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Booking } from '../services/api.service';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  deletingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load bookings';
        this.loading = false;
      }
    });
  }

  deleteBooking(id: number | undefined): void {
    if (!id) return;

    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Only admin users can cancel bookings.';
      return;
    }
    
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    this.deletingId = id;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.successMessage = 'Booking deleted successfully';
        this.deletingId = null;
        this.loadBookings(); // Reload the list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to delete booking';
        this.deletingId = null;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(timeString: string): string {
    // Handle both "HH:mm" and "HH:mm:ss" formats
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  }
}
