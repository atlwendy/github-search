import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatPaginator, MatPaginatorModule, MatButtonModule } from '@angular/material';
import { TsInputModule, TsButtonModule, TsAutocompleteModule, TsOptionModule, TsSelectModule, TsCardModule } from '@terminus/ui'
import { SearchHttpService } from './search-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    TsAutocompleteModule,
    TsOptionModule,
    TsButtonModule,
    TsInputModule,
    TsSelectModule,
    TsCardModule,
  ],
  providers: [
    SearchHttpService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
