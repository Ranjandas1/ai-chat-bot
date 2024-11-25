import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  //baseurl
  private URL: string = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  // post
  sendMessage(userMessage: string) {
    return this.http.post(`${this.URL}/chat`, { userMessage });
  }

  // get
  getMessages() {
    return this.http.get(`${this.URL}/history`);
  }
}
