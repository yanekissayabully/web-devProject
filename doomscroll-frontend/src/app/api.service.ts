import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService{
    private baseUrl = 'http://127.0.0.1:8000/api/';
    isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('access'));

    constructor(private http: HttpClient){}

    login(username: string, password: string){
        return this.http.post<any>(this.baseUrl + 'login/', {username,password}).pipe(
            tap(res => {
                localStorage.setItem('access', res.access);
                localStorage.setItem('refresh', res.refresh);
                this.isLoggedIn$.next(true);
            })
        );
    }

    getPosts(){
        return this.http.get<any[]>(this.baseUrl + 'posts/');
    }

    likePost(postId: number){
        return this.http.post(this.baseUrl + `post/${postId}/like/`,{});
    }

    createPost(content: string) {
        return this.http.post(this.baseUrl + 'posts/create/', { content });
      }
      
    getComments(postId:number){
        return this.http.get<any[]>(this.baseUrl + `posts/${postId}/comments/`);
    }

    createComment(postId:number, text:string){
        return this.http.post(this.baseUrl + `comments/create/`, {
            post: postId,
            text: text
        });
    }

    getMyProfile() {
        return this.http.get(this.baseUrl + 'profile/me/');
    }

    updateMyProfile(profile: any) {
        return this.http.put(this.baseUrl + 'profile/update/', profile);
    }

    getProfileByUsername(username: string) {
        return this.http.get(this.baseUrl + 'profile/' + username + '/');
    }
}