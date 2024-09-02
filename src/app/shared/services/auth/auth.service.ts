import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs';


interface AuthDTO {
  email: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router: Router, private http: HttpClient) {
  }


  register(authDTO: AuthDTO) {
    return this.http.post('/api/auth/register', authDTO, {observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        // Ensure it treats 201 as a successful response
        if (response.status === 201) {
          console.log('Registration successful');
          return response.body || {};
        } else {
          throw new Error('Unexpected response status: ' + response.status);
        }
      })
    );
  }


  login() {
    this.router.navigate(['/']);
    localStorage.setItem('isLogged', 'true');
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('isLogged');
  }

  isLoggedIn() {
    return localStorage.getItem('isLogged');
  }
}
