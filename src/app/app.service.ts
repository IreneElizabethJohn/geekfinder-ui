import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  LoginResponse,
  SignInPayload,
  SignUpPayload,
  UserDetails,
} from './models/user.model';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}

  private apiData = new BehaviorSubject<any>(null);
  public apiData$ = this.apiData.asObservable();
  private apiUrl = this.environmentService.getApiUrl();

  signUp(payload: SignUpPayload): Observable<LoginResponse> {
    const url = this.apiUrl + 'users/sign-up';
    return this.http.post<LoginResponse>(url, payload);
  }

  signIn(payload: SignInPayload): Observable<LoginResponse> {
    const url = this.apiUrl + 'users/sign-in';
    return this.http.post<LoginResponse>(url, payload);
  }

  getUserDetails(id: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(this.apiUrl + `users/${id}`);
  }

  setData(data: any, userType: string) {
    this.apiData.next({ id: data, userType });
  }

  updateUserDetails(id: string, payload: any): Observable<UserDetails> {
    return this.http.patch<UserDetails>(this.apiUrl + `users/${id}`, payload);
  }

  commonSearch(searchKeyWord: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(
      this.apiUrl + `common-search?searchString=${searchKeyWord}`
    );
  }

  addFollowing(payload: any): Observable<UserDetails> {
    const url = this.apiUrl + `users/${localStorage.getItem('id')}/following`;
    return this.http.post<UserDetails>(url, payload);
  }

  getUserProjects(id: string) {
    const url = this.apiUrl + `users/${id}/projects`;
    return this.http.get(url);
  }
}
