import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MeetingRoom } from '../services/api.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: MeetingRoom[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  deletingRoomId: number | null = null;

  constructor(
    private roomService: RoomService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load rooms';
        this.loading = false;
      }
    });
  }

  bookRoom(room: MeetingRoom): void {
    // Navigate to booking form with room pre-selected
    this.router.navigate(['/book'], { 
      queryParams: { roomId: room.id } 
    });
  }

  deleteRoom(room: MeetingRoom): void {
    if (!this.authService.isAdmin()) {
      return;
    }

    if (!confirm(`Delete room "${room.roomName}"?`)) {
      return;
    }

    this.deletingRoomId = room.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.roomService.deleteRoom(room.id).subscribe({
      next: () => {
        this.successMessage = 'Meeting room deleted successfully.';
        this.deletingRoomId = null;
        this.loadRooms();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to delete room.';
        this.deletingRoomId = null;
      }
    });
  }
}
