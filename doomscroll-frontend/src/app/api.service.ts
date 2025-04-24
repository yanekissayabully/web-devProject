import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api/';
  isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('access'));

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(this.baseUrl + 'login/', { username, password }).pipe(
      tap(res => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        this.isLoggedIn$.next(true);
      })
    );
  }

  register(username: string, password: string) {
    return this.http.post(this.baseUrl + 'register/', { username, password });
  }

  getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('access') || ''}`
      })
    };
  }

  getPosts() {
    return this.http.get<any[]>(this.baseUrl + 'posts/', this.getAuthHeaders());
  }

  likePost(postId: number) {
    return this.http.post(this.baseUrl + `posts/${postId}/like/`, {}, this.getAuthHeaders());
  }

  createPost(content: string) {
    return this.http.post(this.baseUrl + 'posts/create/', { content }, this.getAuthHeaders());
  }

  // 💥 Исправленный метод
  createPostWithImage(formData: FormData) {
    return this.http.post(this.baseUrl + 'posts/create/', formData, this.getAuthHeaders());
  }

  getComments(postId: number) {
    return this.http.get<any[]>(this.baseUrl + `posts/${postId}/comments/`, this.getAuthHeaders());
  }

  createComment(postId: number, text: string) {
    return this.http.post(this.baseUrl + 'comments/create/', { post: postId, text }, this.getAuthHeaders());
  }

  getMyProfile() {
    return this.http.get(this.baseUrl + 'profile/me/', this.getAuthHeaders());
  }

  updateMyProfile(profile: any) {
    const formData = new FormData();
    formData.append('bio', profile.bio || '');
    formData.append('doom_level', profile.doom_level || 0);
    if (profile.avatar) {
      formData.append('avatar', profile.avatar);
    }

    return this.http.put(this.baseUrl + 'profile/update/', formData, this.getAuthHeaders());
  }

  getProfileByUsername(username: string) {
    return this.http.get(this.baseUrl + `profile/${username}/`, this.getAuthHeaders());
  }

  follow(username: string) {
    return this.http.post(this.baseUrl + `follow/${username}/`, {}, this.getAuthHeaders());
  }

  unfollow(username: string) {
    return this.http.post(this.baseUrl + `unfollow/${username}/`, {}, this.getAuthHeaders());
  }

  getFollowStats(username: string) {
    return this.http.get<{ followers: number, following: number }>(
      this.baseUrl + `profile/${username}/follows/`, this.getAuthHeaders()
    );
  }

  checkFollow(username: string) {
    return this.http.get<{ is_following: boolean }>(
      this.baseUrl + `follow/status/${username}/`, this.getAuthHeaders()
    );
  }

  getOrCreateThread(username: string) {
    return this.http.post<any>(
      this.baseUrl + `thread/create-or-get/${username}/`,
      {},
      this.getAuthHeaders()
    );
  }
  
  
  getMessages(threadId: number) {
    return this.http.get<any[]>(this.baseUrl + `messages/${threadId}/`, this.getAuthHeaders());
  }
  
  sendMessage(threadId: number, text: string) {
    return this.http.post<any>(this.baseUrl + `chat/messages/${threadId}/send/`, { text }, this.getAuthHeaders());
  }
  
}
