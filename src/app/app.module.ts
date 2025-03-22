import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ZoomDirective } from './zoom.directive';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    ZoomDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
