import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ZoomDirective } from './zoom.directive';
import { NgStyle } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { preventZoom } from './preventzoom.directive';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ScheduleComponent,
    preventZoom,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    ZoomDirective,
    NgStyle
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
