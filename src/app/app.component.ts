import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { map, startWith, switchMap, catchError, } from 'rxjs/operators';
import { Observable, merge, of, forkJoin, } from 'rxjs';

export interface GithubApi {
  items: GithubUser[];
  total_count: number;
}

export interface GithubUser {
  [key: string]: any;
}

export class SearchHttpDao {
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'github-search';
  public searchForm: FormGroup = this.fb.group({});
  delayApiResponse = false;
  searchDatabase!: SearchHttpDao;
  resultsLength = 0;

  displayedColumns: string[] = ['name', 'login', 'bio', 'url', 'html_url', 'followers_count'];
  dataSource = new MatTableDataSource<GithubUser>([]);


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      term: new FormControl('', []),
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public search = (searchFormValue) => {
    this.searchDatabase = new SearchHttpDao(this.http);
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.searchDatabase
            .getUsers(searchFormValue.term, this.paginator.pageIndex, this.paginator.pageSize)
        }),
        switchMap((data) => {
          return this.searchDatabase.getUser(data)
            .pipe(
              map((newData) => {
                data.items.concat(newData)
                this.resultsLength = data.total_count;
                let newItems = data.items;
                newItems.map((item, index) => {
                  item.followers_count = newData[index]['followers'];
                  item.bio = newData[index]['bio'];
                  item.name = newData[index]['name'];
                  return item;
                })
                return data.items;
              }));
        }),
        catchError(() => {
          console.warn('GitHub API rate limit has been reached!');
          return of([]);
        }),
      ).subscribe((data) => {
        this.dataSource = new MatTableDataSource<GithubUser>(data);
      });
  }

}