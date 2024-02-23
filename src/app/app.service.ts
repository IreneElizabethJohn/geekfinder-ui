import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment.local';
import {
  LoginResponse,
  SignInPayload,
  SignUpPayload,
  UserDetails,
} from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  private apiData = new BehaviorSubject<any>(null);
  public apiData$ = this.apiData.asObservable();

  signUp(payload: SignUpPayload): Observable<LoginResponse> {
    const url = environment.apiUrl + 'users/sign-up';
    return this.http.post<LoginResponse>(url, payload);
  }

  signIn(payload: SignInPayload): Observable<LoginResponse> {
    const url = environment.apiUrl + 'users/sign-in';
    return this.http.post<LoginResponse>(url, payload);
  }

  getUserDetails(id: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(environment.apiUrl + `users/${id}`);
  }

  setData(data: any, userType: string) {
    this.apiData.next({ id: data, userType });
  }

  updateUserDetails(id: string, payload: any): Observable<UserDetails> {
    return this.http.patch<UserDetails>(
      environment.apiUrl + `users/${id}`,
      payload
    );
  }

  commonSearch(searchKeyWord: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(
      environment.apiUrl + `common-search?searchString=${searchKeyWord}`
    );
  }

  addFollowing(payload: any): Observable<UserDetails> {
    const url =
      environment.apiUrl + `users/${localStorage.getItem('id')}/following`;
    return this.http.post<UserDetails>(url, payload);
  }
  //post
  getSignedUrl(fileName: string, contentType: string): Observable<any> {
    const url =
      environment.apiUrl +
      `posts/signedUrl?fileName=${fileName}&contentType=${contentType}`;
    return this.http.get<any>(url);
  }
  //post
  uploadImage(url: string, body: any, headers: any) {
    return this.http.put<any>(url, body, { headers });
  }
  //post
  createPost(payload: any) {
    const url = environment.apiUrl + `posts`;
    return this.http.post(url, payload);
  }
  addLikes(payload: Object, postId: string) {
    const url = environment.apiUrl + `posts/${postId}/likes`;
    return this.http.post(url, payload);
  }
  addComments(payload: Object, postId: string) {
    const url = environment.apiUrl + `posts/${postId}/comments`;
    return this.http.post(url, payload);
  }
  getComments(postId: string) {
    const url = environment.apiUrl + `posts/${postId}/comments`;
    return this.http.get(url);
  }
  addJoinRequests(payload: Object, postId: string) {
    const url = environment.apiUrl + `posts/${postId}/joinRequests`;
    return this.http.post(url, payload);
  }

  getFeed(userId: string) {
    const url = environment.apiUrl + `users/${userId}/feed`;
    return this.http.get(url);
  }
}
