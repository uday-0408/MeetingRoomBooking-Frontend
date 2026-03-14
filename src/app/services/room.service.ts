import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import {
  ApiService,
  CreateMeetingRoomRequest,
  MeetingRoom
} from './api.service';

export interface AddRoomFormValue {
  roomName: string;
  capacity: number;
  location: string;
  imageFile?: File | null;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private apiService: ApiService) {}

  getRooms(): Observable<MeetingRoom[]> {
    return this.apiService.getRooms();
  }

  createRoom(payload: CreateMeetingRoomRequest): Observable<MeetingRoom> {
    return this.apiService.createRoom(payload);
  }

  createRoomWithOptionalImage(formValue: AddRoomFormValue): Observable<MeetingRoom> {
    if (formValue.imageFile) {
      return this.apiService.uploadRoomImage(formValue.imageFile).pipe(
        switchMap((uploadResponse) => {
          const imageUrl = uploadResponse.imageUrl ?? uploadResponse.url ?? uploadResponse.path ?? null;

          const roomPayload: CreateMeetingRoomRequest = {
            roomName: formValue.roomName,
            capacity: formValue.capacity,
            location: formValue.location,
            imageUrl
          };

          return this.apiService.createRoom(roomPayload);
        })
      );
    }

    const payload: CreateMeetingRoomRequest = {
      roomName: formValue.roomName,
      capacity: formValue.capacity,
      location: formValue.location,
      imageUrl: null
    };

    return this.apiService.createRoom(payload);
  }

  deleteRoom(id: number): Observable<void> {
    return this.apiService.deleteRoom(id);
  }
}
