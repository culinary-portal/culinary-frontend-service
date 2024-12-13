import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetailsDTO } from '../model/user-details';
import { SpecificDetails } from 'src/app/modules/specific/model/specific';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/user`; // Replace with your backend endpoint

  constructor(private http: HttpClient) {
  }

  // Fetch user details from the backend
  getUserDetails(userId: number): Observable<UserDetailsDTO> {
    return this.http.get<UserDetailsDTO>(`${this.apiUrl}/${userId}`);
  }

  // Update user details
  updateUserDetails(user: UserDetailsDTO): Observable<UserDetailsDTO> {
    return this.http.put<UserDetailsDTO>(`${this.apiUrl}/${user.id}`, user);
  }

  // Add a specific detail for the user
  addSpecific(userId: number, specific: SpecificDetails): Observable<UserDetailsDTO> {
    return this.http.post<UserDetailsDTO>(`${this.apiUrl}/${userId}/specifics`, specific);
  }

  // Delete a specific detail for the user
  deleteSpecific(userId: number, specificId: number): Observable<UserDetailsDTO> {
    return this.http.delete<UserDetailsDTO>(
      `${this.apiUrl}/${userId}/specifics/${specificId}`
    );
  }
}
