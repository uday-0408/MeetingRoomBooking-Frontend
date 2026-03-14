import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Booking } from '../services/api.service';
import { BookingService } from '../services/booking.service';
import { RoomService } from '../services/room.service';
import { MeetingRoom } from '../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  rooms: MeetingRoom[] = [];
  bookings: Booking[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    public authService: AuthService,
    private roomService: RoomService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/rooms']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.bookingService.getBookings().subscribe({
          next: (bookings) => {
            this.bookings = bookings;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = error.message || 'Failed to load bookings.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load rooms.';
        this.loading = false;
      }
    });
  }

  deleteRoom(roomId: number): void {
    this.roomService.deleteRoom(roomId).subscribe({
      next: () => {
        this.successMessage = 'Room deleted successfully.';
        this.loadData();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to delete room.';
      }
    });
  }

  cancelBooking(bookingId: number): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.successMessage = 'Booking cancelled successfully.';
        this.loadData();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to cancel booking.';
      }
    });
  }
}
