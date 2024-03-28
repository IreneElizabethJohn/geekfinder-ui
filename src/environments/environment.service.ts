import { Injectable } from '@angular/core';
import { environment } from './environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  private apiUrl: string;

  constructor() {
    // Set API URL based on environment
    if (environment.production) {
      this.apiUrl = environment.apiUrl;
    } else {
      this.apiUrl = environment.apiUrl;
    }
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
