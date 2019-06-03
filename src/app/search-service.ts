import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GithubApi, GithubUser } from './app.component';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchHttpService {
  constructor(private http: HttpClient) { }

  getUsers(term: string, page: number, perPage: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/users';
    const requestParams = `${href}?q=${term}&page=${page + 1}&per_page=${perPage}`;
    return this.http.get<GithubApi>(`${requestParams}`);
  }

  getUser(data): Observable<GithubUser> {
    return forkJoin(...data.items.map((d) => {
      const href = `https://api.github.com/users/${d.login}`;
      return this.http.get(`${href}`)
        .pipe(
          map((c: GithubUser) => {
            return { 'followers': c.followers, 'name': c.name, 'bio': c.bio }
          })
        )
    }));
  }
}