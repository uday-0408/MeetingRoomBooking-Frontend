import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Room } from '../services/api.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.apiService.getRooms().subscribe({
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

  bookRoom(room: Room): void {
    // Navigate to booking form with room pre-selected
    this.router.navigate(['/book'], { 
      queryParams: { roomId: room.id } 
    });
  }
}
