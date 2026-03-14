import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  ApiService,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User
} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'mrbs_token';
  private readonly userKey = 'mrbs_user';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.apiService.login(payload).pipe(
      tap((response) => this.persistSession(response, payload.username))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.register(payload).pipe(
      tap((response) => this.persistSession(response, payload.username, payload.role))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey) || !!localStorage.getItem(this.userKey);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  getRole(): string {
    return this.getCurrentUser()?.role ?? '';
  }

  isAdmin(): boolean {
    return this.getRole().toLowerCase() === 'admin';
  }

  private persistSession(response: AuthResponse, fallbackUsername: string, fallbackRole = 'User'): void {
    const resolvedRole = response.user?.role ?? response.role ?? fallbackRole;
    const resolvedUser: User = {
      id: response.user?.id ?? response.id ?? 0,
      username: response.user?.username ?? response.username ?? fallbackUsername,
      password: response.user?.password ?? '',
      role: resolvedRole
    };

    localStorage.setItem(this.userKey, JSON.stringify(resolvedUser));

    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
    } else {
      localStorage.setItem(this.tokenKey, 'session');
    }
  }
}
