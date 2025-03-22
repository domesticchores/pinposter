import { Component, Inject, Injectable, Input } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})

@Injectable({
  providedIn: 'root'
})

export class MapComponent {
  protected vw: number = window.innerWidth / 100;
  protected vh: number = window.innerHeight / 100;
  constructor(
  ) {}

}
