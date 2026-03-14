import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingRoom } from '../services/api.service';
import { BookingService } from '../services/booking.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  rooms: MeetingRoom[] = [];
  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      employeeName: ['', [Validators.required, Validators.minLength(2)]],
      roomId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRooms();
    
    // Pre-select room if roomId is provided in query params
    this.route.queryParams.subscribe(params => {
      if (params['roomId']) {
        this.bookingForm.patchValue({ roomId: params['roomId'] });
      }
    });
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load rooms: ' + error.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.createBookingFromForm(this.bookingForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Booking created successfully!';
        this.bookingForm.reset();
        
        // Redirect to bookings list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/bookings']);
        }, 2000);
      },
      error: (error) => {
        this.submitting = false;
        // Display specific error messages from backend (e.g., "Room already booked for this time slot.")
        this.errorMessage = error.message || 'Failed to create booking';
        console.error('Booking error:', error);
      }
    });
  }

  // Helper method to check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get error message for a field
  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors?.['required']) {
      return `${fieldName} is required`;
    }
    if (field?.errors?.['minlength']) {
      return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
