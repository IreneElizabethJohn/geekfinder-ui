import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  getSignedUrl(fileName: string, contentType: string): Observable<any> {
    const url =
      environment.apiUrl +
      `posts/signedUrl?fileName=${fileName}&contentType=${contentType}`;
    return this.http.get<any>(url);
  }

  uploadImage(url: string, body: any, headers: any) {
    return this.http.put<any>(url, body, { headers });
  }

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
