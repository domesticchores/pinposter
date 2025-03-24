import { Component, OnInit, ViewChild } from '@angular/core'
import * as data from '../../../assets/buildings.json'
import { ZoomDirective } from '../zoom.directive'


interface Building {
  id: number,
  name: string,
  shape: string,
  position:{posX:number,posY:number},
  posters:number[]
}
// {"id":0,"name":"shed","shape":"stringdata","position":{"posX":0,"posY":0},"posters":[0]}
@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit {
  @ViewChild('zoomInstance') zoomDirective!: ZoomDirective;
  rawData: any
  buildingData: Building[] = []
  b: Building = {"id":0,"name":"shed","shape":"stringdata","position":{"posX":0,"posY":0},"posters":[0]}

  constructor(
    // private zoomDirective: ZoomDirective
  ) {}

  position = { x: 0, y: 0 }; // Initial position
  isDragging = false; // Dragging state
  offset = { x: 0, y: 0 }; // Offset to handle smooth dragging
  oldPosition = { x: 0, y: 0 };

  ngOnInit() {
    this.rawData = data;
    this.buildingData = this.rawData.default;
    this.buildingData.forEach(element => {
      console.log(element.name);
    });
  }

  onDragStart(event: MouseEvent): void {
    this.isDragging = true;
    this.offset = {
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y,
    };
  }

  onDrag(event: MouseEvent): void {
    if (this.isDragging) {
      this.position = {
        x: event.clientX - this.offset.x,
        y: event.clientY - this.offset.y,
      };
    }
  }

  onDragEnd(): void {
    this.isDragging = false;
  }
  
  select(building: Building) {
    this.oldPosition = this.position;
    this.zoomDirective.setZoom(10);
    console.log("selecting: ", building.name);
  }
}
