import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, CreateRoomRequest } from '../services/api.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent {
  addRoomForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.addRoomForm = this.fb.group({
      roomName: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required]
    });
  }

  get formControls() {
    return this.addRoomForm.controls;
  }

  onSubmit(): void {
    this.addRoomForm.markAllAsTouched();

    if (this.addRoomForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: CreateRoomRequest = {
      roomName: this.formControls['roomName'].value,
      capacity: Number(this.formControls['capacity'].value),
      location: this.formControls['location'].value
    };

    this.apiService.createRoom(payload).subscribe({
      next: () => {
        this.successMessage = 'Meeting room created successfully.';
        this.isSubmitting = false;

        // Navigate back to rooms list. The rooms component loads latest data on init.
        setTimeout(() => {
          this.router.navigate(['/rooms']);
        }, 800);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to create meeting room.';
        this.isSubmitting = false;
      }
    });
  }
}
