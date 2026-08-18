import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseURL = 'api';

  constructor(private http: HttpClient) { }

  /**
   * GET API Request
   */
  get<T>(path: string, params?: HttpParams):  Observable<T> {
    const url = `${this.baseURL}/${path}`;
    return this.http.get<T>(url, { params: params });
  }

  /**
   * POST API Request
   */
  post<T>(path: string, body: any, params?: HttpParams): Observable<T> {
    const url = `${this.baseURL}/${path}`;
    return this.http.post<T>(url, body, { params: params });
  }

  /**
   * PUT API Request
   */
  put<T>(path: string, body: any, params?: HttpParams): Observable<T> {
    const url = `${this.baseURL}/${path}`;
    return this.http.put<T>(url, body, { params: params });
  }

  /**
   * DELETE API Request
   */
  delete<T>(path: string, params?: HttpParams): Observable<T> {
    const url = `${this.baseURL}/${path}`;
    return this.http.delete<T>(url, { params: params });
  }
}
