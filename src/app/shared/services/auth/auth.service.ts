import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { UserDetailsDTO } from 'src/app/modules/user/model/user-details';
import { environment } from '../../../../environments/environment';

interface AuthDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userDetailsSubject = new BehaviorSubject<UserDetailsDTO | null>(null);
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('userDetails');
    if (storedUser) {
      this.userDetailsSubject.next(JSON.parse(storedUser));
    }
  }

  register(registerDTO: RegisterDTO) {
    return this.http.post(`${this.baseApiUrl}/api/auth/register`, registerDTO, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === 201) {
          return response.body || {};
        } else {
          throw new Error('Unexpected response status: ' + response.status);
        }
      })
    );
  }

  login(authDTO: AuthDTO) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserDetailsDTO>(`${this.baseApiUrl}/api/auth/login`, authDTO, { headers }).pipe(
      tap((userDetails: UserDetailsDTO) => {
        this.setUserDetails(userDetails);
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    this.clearUserDetails();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('userDetails');
  }

  getUserDetails() {
    return this.userDetailsSubject.value;
  }

  getUserDetailsObservable() {
    return this.userDetailsSubject.asObservable();
  }


  setUserDetails(userDetails: UserDetailsDTO) {
    this.userDetailsSubject.next(userDetails);
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
  }

  private clearUserDetails() {
    this.userDetailsSubject.next(null);
    localStorage.removeItem('userDetails');
  }
}
