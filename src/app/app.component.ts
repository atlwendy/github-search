import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { map, startWith, switchMap, catchError, } from 'rxjs/operators';
import { merge, of, } from 'rxjs';
import { SearchHttpService } from './search-service';

export interface GithubApi {
  items: GithubUser[];
  total_count: number;
}

export interface GithubUser {
  [key: string]: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'github-search';
  term = new FormControl('', []);
  public searchForm: FormGroup = this.fb.group({
    term: this.term,
  });
  delayApiResponse = false;
  resultsLength = 0;

  displayedColumns: string[] = ['name', 'login', 'bio', 'url', 'html_url', 'followers_count'];
  dataSource = new MatTableDataSource<GithubUser>([]);


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchHttpService,
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
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.searchService
            .getUsers(searchFormValue.term, this.paginator.pageIndex, this.paginator.pageSize)
        }),
        switchMap((data) => {
          return this.searchService.getUser(data)
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
