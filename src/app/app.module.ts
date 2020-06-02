import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FilterQueryComponent, SingleFilterQueryComponent } from './filter-query';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    FilterQueryComponent,
    SingleFilterQueryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
