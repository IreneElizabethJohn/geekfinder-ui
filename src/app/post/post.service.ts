import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {}
  private apiKey = '93ec0cfc2ba98e1572cf93e42c1e6b3b';
  private apiUrl = this.environmentService.getApiUrl();

  getSignedUrl(fileName: string, contentType: string): Observable<any> {
    const url =
      this.apiUrl +
      `posts/signedUrl?fileName=${fileName}&contentType=${contentType}`;
    return this.http.get<any>(url);
  }

  uploadImage(url: string, body: any, headers: any) {
    return this.http.put<any>(url, body, { headers });
  }

  createPost(payload: any) {
    const url = this.apiUrl + `posts`;
    return this.http.post(url, payload);
  }

  addLikes(payload: Object, postId: string) {
    const url = this.apiUrl + `posts/${postId}/likes`;
    return this.http.post(url, payload);
  }

  addComments(payload: Object, postId: string) {
    const url = this.apiUrl + `posts/${postId}/comments`;
    return this.http.post(url, payload);
  }

  getComments(postId: string) {
    const url = this.apiUrl + `posts/${postId}/comments`;
    return this.http.get(url);
  }

  addJoinRequests(payload: Object, postId: string) {
    const url = this.apiUrl + `posts/${postId}/joinRequests`;
    return this.http.post(url, payload);
  }

  getFeed(userId: string) {
    const url = this.apiUrl + `users/${userId}/feed`;
    return this.http.get(url);
  }

  getLatestTechNews(): Observable<any> {
    const url = `https://gnews.io/api/v4/top-headlines?topic=technology&lang=en&token=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  removeJoinRequest(postId: string, userId: string) {
    const url = this.apiUrl + `posts/${postId}/joinRequests/${userId}`;
    return this.http.delete(url);
  }
}
