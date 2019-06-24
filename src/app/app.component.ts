import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { map, startWith, switchMap, catchError, } from 'rxjs/operators';
import { merge, of, Observable, BehaviorSubject, } from 'rxjs';
import { SearchHttpService } from './search-service';

export interface GithubApi {
  items: GithubUser[];
  total_count: number;
}

export interface GithubUser {
  [key: string]: any;
}

export interface State {
  name: string;
  population: string;
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
    private formBuilder: FormBuilder,
  ) {
    this.filteredStates = this.myQuery$
      .pipe(
        map((state) => {
          const val = state ? this.filterStates(state) : [];
          console.log('in pipe: ', state, val);
          return val;
        }),
      );
   }

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

  stateCtrl = new FormControl(null, [Validators.required]);

  filteredStates!: Observable<State[]>;
  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
    },
    {
      name: 'Alabama',
      population: '3.29M',
    },
    {
      name: 'Alaska',
      population: '1.341M',
    },
    {
      name: 'California',
      population: '39.14M',
    },
    {
      name: 'Florida',
      population: '20.27M',
    },
    {
      name: 'Texas',
      population: '27.47M',
    },
    {
      name: 'Arizona',
      population: '24.112M',
    },
    {
      name: 'Arkansas 2',
      population: '2.978M',
    },
    {
      name: 'Alabama 2',
      population: '3.29M',
    },
    {
      name: 'Alaska 2',
      population: '1.341M',
    },
    {
      name: 'California 2',
      population: '39.14M',
    },
    {
      name: 'Florida 2',
      population: '20.27M',
    },
    {
      name: 'Texas 2',
      population: '27.47M',
    },
    {
      name: 'Arizona 2',
      population: '24.112M',
    },
    {
      name: 'Arkansas 3',
      population: '2.978M',
    },
    {
      name: 'Alabama 3',
      population: '3.29M',
    },
    {
      name: 'Alaska 3',
      population: '1.341M',
    },
    {
      name: 'California 3',
      population: '39.14M',
    },
    {
      name: 'Florida 3',
      population: '20.27M',
    },
    {
      name: 'Texas 3',
      population: '27.47M',
    },
    {
      name: 'Arizona 3',
      population: '24.112M',
    },
  ];
  myQuery$: BehaviorSubject<string> = new BehaviorSubject('');
  fakeAsync = false;

  comparator: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  private filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    const r = this.states.filter((state) => state.name.toLowerCase().indexOf(filterValue) === 0);
    return r;
  }

  myFormatUIFn = (v: any): string => v.name;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1.text === f2.text;
  }
  compareByReference(f1: any, f2: any) {
    return f1 === f2;
  }

  panelChange(e: boolean): void {
    console.log(`Panel ${e ? 'opened' : 'closed'}`);
  }

  isSelected(v) {
    console.log('optionSelected: ', v);
  }

  isDeselected(v) {
    console.log('optionDeselected: ', v);
  }

  log(v: any): void {
    console.log('Form value: ', v);
  }

  queryHasChanged(v) {
    console.log('query string changed: ', v);
    this.myQuery$.next(v);
  }

  duplicate(e) {
    console.log('Duplicate selection: ', e);
  }



  simpleItems: number[] = [1, 2, 3, 4];
  initialSimpleItemsSelection = 2;
  useSpacing = false;
  obj = {
    id: 3,
    text: 'baz',
  };
  singleWithCustomTrigger: Observable<any[]> = of([
    {
      foo: 'Foo bar baz foo bar baz foo bar baz',
      slug: 'foo',
      bar: {
        id: 1,
        text: 'foo',
      },
    },
    {
      foo: 'Bar Hic saepe ad sunt temporibus.',
      slug: 'bar',
      bar: {
        id: 2,
        text: 'bar',
      },
    },
    {
      // tslint:disable: max-line-length
      foo: 'Consequuntur eum eveniet accusamus ea saepe. Alias occaecati eos reprehenderit expedita. Ab perferendis nemo molestias nulla est inventore voluptate.',
      // tslint:enable: max-line-length
      /*
       *foo: 'Consequuntur eum eveniet accusamus ea saepe.',
       */
      slug: 'con',
      disabled: false,
      bar: this.obj,
      /*
       *bar: {
       *  id: 3,
       *  text: 'baz',
       *},
       */
    },
    {
      foo: 'Eligendi magni quod quas',
      slug: 'eli',
    },
    {
      foo: 'Necessitatibus corporis officiis atque sed.',
      slug: 'nec',
      disabled: true,
    },
    {
      foo: 'Baz Neque numquam reiciendis',
      slug: 'baz',
      disabled: true,
    },
    {
      foo: 'Vel eos nam porro. Vel eos nam porro.',
      slug: 'vel',
    },
    {
      foo: 'Dolores ducimus magnamomnis.',
      slug: 'dol',
    },
    {
      foo: 'Dolorem neque quae ducimus',
      slug: 'neq',
    },
    {
      foo: 'Foo2 bar baz foo bar baz foo bar baz',
      slug: 'foo2',
    },
    {
      foo: 'Bar2 Hic saepe ad sunt temporibus.',
      slug: 'bar2',
    },
    {
      foo: 'Consequuntur eum eveniet accusamus ea saepe.',
      slug: 'con2',
      disabled: true,
    },
    {
      foo: 'Eligendi2 magni quod quas',
      slug: 'eli2',
    },
    {
      foo: 'Necessitatibus2 corporis officiis atque sed.',
      slug: 'nec2',
      disabled: true,
    },
    {
      foo: 'Baz2 Neque numquam reiciendis',
      slug: 'baz2',
      disabled: true,
    },
    {
      foo: 'Vel2 eos nam porro. Vel eos nam porro.',
      slug: 'vel2',
    },
    {
      foo: 'Dolores2 ducimus magnamomnis.',
      slug: 'dol2',
    },
    {
      foo: 'Dolorem2 neque quae ducimus',
      slug: 'neq2',
    },
  ]);
  itemsWithGroups: Observable<any[]> = of([
    {
      foo: 'Foo bar baz foo bar baz foo bar baz',
      slug: 'foo',
      children: [
        {
          foo: 'Baz Neque numquam reiciendis ipsa perspiciatis voluptatem.',
          slug: 'baz',
        },
        {
          foo: 'Vel eos nam porro. Vel eos nam porro.',
          slug: 'vel',
        },
      ],
    },
    {
      foo: 'Bar Hic saepe ad adipisci totam porro sunt temporibus.',
      slug: 'bar',
      children: [
        {
          foo: 'Consequuntur eum eveniet accusamus ea saepe.',
          slug: 'con',
        },
        {
          foo: 'Eligendi magni quod quas commodi ratione necessitatibus.',
          slug: 'eli',
          disabled: true,
        },
        {
          foo: 'Necessitatibus corporis officiis atque sed.',
          slug: 'nec',
        },
      ],
    },
    {
      foo: 'Dolores ducimus magnam eius quo omnis.',
      slug: 'dol',
      disabled: true,
      children: [
        {
          foo: 'Dolorem neque quae ducimus dolore molestiae dolorem.',
          slug: 'neq',
        },
        {
          foo: 'Explicabo quos harum culpa labore aut cupiditate vero.',
          slug: 'quos',
        },
      ],
    },
  ]);
  label = 'Select a Thing';
  blank = 'none';
  multipleAllowed = true;
  myForm: FormGroup = this.formBuilder.group({
    myChoices1: [
      /*
       *this.obj,
       */
      'bar2',

      /*
       *['eli'],
       */
      /*
       *null,
       */
      /*
       *[Validators.required],
       */
    ],
    myChoices2: [
      null,
      [Validators.required],
    ],
    myChoices3: [
      null,
      [Validators.required],
    ],
  });



  firstOptions: Observable<any[]> = this.singleWithCustomTrigger;


  isChanged(e: any[]): void {
    console.log('changed: ', e);
    this.firstOptions = this.singleWithCustomTrigger;
  }


  onFilterOptions(v) {
    console.log('filtering options: ', v);
    if (!v) {
      this.firstOptions = this.singleWithCustomTrigger;
    } else {
      const regex = new RegExp(v, 'i');
      this.firstOptions = this.singleWithCustomTrigger
        .pipe(map((a) => a.filter((i) => i.slug.match(regex))));
    }
  }


}
