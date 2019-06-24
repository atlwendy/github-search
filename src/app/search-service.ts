import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GithubApi, GithubUser } from './app.component';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchHttpService {
  public defaultHeaders;

  constructor(private http: HttpClient) {
    this.defaultHeaders = new HttpHeaders();
    this.defaultHeaders.set('Authorization', '3634fcd8e0b747d82dc18d9600990fe39055a886');
   }

  getUsers(term: string, page: number, perPage: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/users';
    const requestParams = `${href}?q=${term}&page=${page + 1}&per_page=${perPage}`;
    return this.http.get<GithubApi>(`${requestParams}`, {headers: this.defaultHeaders});
  }

  getUser(data): Observable<GithubUser> {
    return forkJoin(...data.items.map((d) => {
      const href = `https://api.github.com/users/${d.login}`;
      return this.http.get(`${href}`, { headers: this.defaultHeaders })
        .pipe(
          map((c: GithubUser) => {
            return { 'followers': c.followers, 'name': c.name, 'bio': c.bio }
          })
        )
    }));
  }
}