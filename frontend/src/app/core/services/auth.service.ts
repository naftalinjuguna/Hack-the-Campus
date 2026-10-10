import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { User } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly defaultUser: User = {
    id: 1,
    username: 'brian',
    email: 'brian@maseno.ac.ke',
    fullName: 'Brian Kiprono',
    course: 'BSc. Comp Sci',
    role: 'ROLE_STUDENT'
  };

  readonly currentUser = signal<User>(this.loadUser());

  constructor(private http: HttpClient, private api: ApiService) {}

  private loadUser(): User {
    const saved = localStorage.getItem('campusdinga_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return this.defaultUser;
  }

  saveUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('campusdinga_user', JSON.stringify(user));
  }

  login(credentials: { username: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.api.baseUrl}/auth/login`, credentials).pipe(
      tap(res => this.saveUser(res)),
      catchError(err => {
        // Fallback demo simulation if backend is offline
        const simulated: User = credentials.username.toLowerCase().includes('admin')
          ? { id: 2, username: 'admin', email: 'admin@maseno.ac.ke', fullName: 'Campus Administrator', course: 'Estates & GIS Dept', role: 'ROLE_ADMIN' }
          : { id: 1, username: 'brian', email: 'brian@maseno.ac.ke', fullName: 'Brian Kiprono', course: 'BSc. Comp Sci', role: 'ROLE_STUDENT' };
        this.saveUser(simulated);
        return of(simulated);
      })
    );
  }

  register(data: any): Observable<User> {
    return this.http.post<User>(`${this.api.baseUrl}/auth/register`, data).pipe(
      tap(res => this.saveUser(res)),
      catchError(err => {
        const newUser: User = {
          id: Date.now(),
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          course: data.course || 'BSc. Computer Science',
          role: 'ROLE_STUDENT'
        };
        this.saveUser(newUser);
        return of(newUser);
      })
    );
  }

  switchRole(role: 'ROLE_STUDENT' | 'ROLE_ADMIN') {
    if (role === 'ROLE_ADMIN') {
      const admin: User = {
        id: 2,
        username: 'admin',
        email: 'admin@maseno.ac.ke',
        fullName: 'Campus Administrator',
        course: 'Estates & GIS Dept',
        role: 'ROLE_ADMIN'
      };
      this.saveUser(admin);
    } else {
      this.saveUser(this.defaultUser);
    }
  }

  logout() {
    this.currentUser.set(this.defaultUser);
    localStorage.removeItem('campusdinga_user');
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ROLE_ADMIN';
  }
}
