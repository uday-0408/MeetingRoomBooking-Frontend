import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  readonly maxBookingDate = '2026-12-31';
  readonly minBookingDate = this.getTodayDateString();
  activeTimeField: 'startTime' | 'endTime' | null = null;
  clockStep: 'hour' | 'minute' = 'hour';
  selectedHour12 = 9;
  selectedMinute = 0;
  selectedPeriod: 'AM' | 'PM' = 'AM';
  readonly hourDial = this.buildDial([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 38);
  readonly minuteDial = this.buildDial([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], 38, true);

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
    }, {
      validators: [
        this.bookingDateRangeValidator(),
        this.startBeforeEndValidator(),
        this.startAfterCurrentTimeValidator()
      ]
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

    if (fieldName === 'bookingDate' && this.bookingForm.errors?.['bookingDateRange']) {
      return `Booking date must be between ${this.minBookingDate} and ${this.maxBookingDate}.`;
    }

    if ((fieldName === 'startTime' || fieldName === 'endTime') && this.bookingForm.errors?.['invalidTimeRange']) {
      return 'Start time must be earlier than end time.';
    }

    if (fieldName === 'startTime' && this.bookingForm.errors?.['startTimePast']) {
      return 'Start time must be after the current time.';
    }

    return '';
  }

  getDurationSummary(): string {
    const start = this.bookingForm.get('startTime')?.value as string;
    const end = this.bookingForm.get('endTime')?.value as string;

    if (!start || !end || this.bookingForm.errors?.['invalidTimeRange']) {
      return '';
    }

    const startMinutes = this.toMinutes(start);
    const endMinutes = this.toMinutes(end);

    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
      return '';
    }

    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const hourPart = hours > 0 ? `${hours}h` : '';
    const minutePart = minutes > 0 ? `${minutes}m` : '0m';
    const duration = [hourPart, minutePart].filter(Boolean).join(' ');

    return `Duration: ${duration} (${start} - ${end})`;
  }

  openClockPicker(field: 'startTime' | 'endTime'): void {
    this.activeTimeField = field;
    this.clockStep = 'hour';

    const current = this.bookingForm.get(field)?.value as string;
    const parsed = this.parseTime(current);

    if (parsed) {
      this.selectedHour12 = parsed.hour12;
      this.selectedMinute = parsed.minute;
      this.selectedPeriod = parsed.period;
      return;
    }

    if (field === 'endTime') {
      const start = this.parseTime(this.bookingForm.get('startTime')?.value as string);
      if (start) {
        this.selectedHour12 = start.hour12;
        this.selectedMinute = start.minute;
        this.selectedPeriod = start.period;
      }
    }
  }

  closeClockPicker(): void {
    this.activeTimeField = null;
  }

  selectClockHour(hour: number): void {
    this.selectedHour12 = hour;
    this.clockStep = 'minute';
  }

  selectClockMinute(minute: number): void {
    this.selectedMinute = minute;
    this.applySelectedTime();
  }

  setClockStep(step: 'hour' | 'minute'): void {
    this.clockStep = step;
  }

  setPeriod(period: 'AM' | 'PM'): void {
    this.selectedPeriod = period;
  }

  isHourSelected(hour: number): boolean {
    return this.selectedHour12 === hour;
  }

  isMinuteSelected(minute: number): boolean {
    return this.selectedMinute === minute;
  }

  getActiveTimeValue(field: 'startTime' | 'endTime'): string {
    const value = this.bookingForm.get(field)?.value as string;
    return value || '--:--';
  }

  getClockPreview(): string {
    const minute = this.selectedMinute.toString().padStart(2, '0');
    return `${this.selectedHour12.toString().padStart(2, '0')}:${minute} ${this.selectedPeriod}`;
  }

  private applySelectedTime(): void {
    if (!this.activeTimeField) {
      return;
    }

    const hour24 = this.toHour24(this.selectedHour12, this.selectedPeriod);
    const value = `${hour24.toString().padStart(2, '0')}:${this.selectedMinute.toString().padStart(2, '0')}`;

    this.bookingForm.patchValue({ [this.activeTimeField]: value });
    this.bookingForm.get(this.activeTimeField)?.markAsTouched();
    this.bookingForm.updateValueAndValidity();
    this.closeClockPicker();
  }

  private parseTime(value: string | null | undefined): { hour12: number; minute: number; period: 'AM' | 'PM' } | null {
    if (!value) {
      return null;
    }

    const parts = value.split(':');
    if (parts.length < 2) {
      return null;
    }

    const hour24 = Number(parts[0]);
    const minute = Number(parts[1]);

    if (Number.isNaN(hour24) || Number.isNaN(minute)) {
      return null;
    }

    const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
    const hour12Raw = hour24 % 12;

    return {
      hour12: hour12Raw === 0 ? 12 : hour12Raw,
      minute,
      period
    };
  }

  private toHour24(hour12: number, period: 'AM' | 'PM'): number {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    }

    return hour12 === 12 ? 12 : hour12 + 12;
  }

  private buildDial(values: number[], radiusPercent: number, padLabels = false): Array<{ value: number; label: string; left: string; top: string }> {
    return values.map((value, index) => {
      const angle = ((index / values.length) * 2 * Math.PI) - (Math.PI / 2);
      const left = 50 + radiusPercent * Math.cos(angle);
      const top = 50 + radiusPercent * Math.sin(angle);

      return {
        value,
        label: padLabels ? value.toString().padStart(2, '0') : String(value),
        left: `${left}%`,
        top: `${top}%`
      };
    });
  }

  private bookingDateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const bookingDate = group.get('bookingDate')?.value as string;
      if (!bookingDate) {
        return null;
      }

      return bookingDate >= this.minBookingDate && bookingDate <= this.maxBookingDate
        ? null
        : { bookingDateRange: true };
    };
  }

  private startBeforeEndValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const startTime = group.get('startTime')?.value as string;
      const endTime = group.get('endTime')?.value as string;

      if (!startTime || !endTime) {
        return null;
      }

      return startTime < endTime ? null : { invalidTimeRange: true };
    };
  }

  private startAfterCurrentTimeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const bookingDate = group.get('bookingDate')?.value as string;
      const startTime = group.get('startTime')?.value as string;

      if (!bookingDate || !startTime) {
        return null;
      }

      const startDateTime = new Date(`${bookingDate}T${startTime}:00`);
      if (Number.isNaN(startDateTime.getTime())) {
        return null;
      }

      return startDateTime > new Date() ? null : { startTimePast: true };
    };
  }

  private getTodayDateString(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  }

  private toMinutes(timeValue: string): number | null {
    const parts = timeValue.split(':');
    if (parts.length < 2) {
      return null;
    }

    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return null;
    }

    return hour * 60 + minute;
  }
}
