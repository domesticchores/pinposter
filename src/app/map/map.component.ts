import { Component, OnInit, ViewChild } from '@angular/core'
import * as data from '../../../assets/buildings.json'
import { ZoomDirective } from '../zoom.directive'
import { timeout } from 'rxjs';


interface Building {
  id: number,
  name: string,
  description: string,
  shape: string,
  position: {posX:number,posY:number},
  floors: number,
  posters: number[]
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
  @ViewChild('mapElement') mapElement!: HTMLElement;
  rawData: any
  buildingData: Building[] = []
  b: Building = {"id":0,"name":"shed","description":"a building","shape":"stringdata","position":{"posX":0,"posY":0},"floors":1,"posters":[0]}
  buildingName: string = "BUILDING";
  buildingDescription: string = "DESCRIPTION";
  resetZoom: boolean = true;

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
      console.log(this.position);
    }
  }

  onDragEnd(): void {
    this.isDragging = false;
  }
  
  select(building: Building, scale: number) {
    this.openMenu(building);
    const mapWidth = document.getElementById("mapElement")?.getBoundingClientRect().width!;
    const mapHeight = document.getElementById("mapElement")?.getBoundingClientRect().height!;
    const elem: HTMLElement = document.getElementById(building.name)!;
    if(this.resetZoom) {
      this.oldPosition = this.position;
    }
    this.resetZoom = false;

    // offsets:
    //x: 231.03334045410156
    //y: 121.10000610351562

    this.zoomDirective.setZoom(scale);
    var bounds = elem.getBoundingClientRect();
    console.log(" object position: ", bounds.x + " " + bounds.y)
    this.position={
      x: -(bounds.width/2) + (mapWidth/2) - (building.position.posX/1600)*(1200*this.zoomDirective.getZoom()),
      y: -(bounds.height/2) + (mapHeight/2) - (building.position.posY/800)*(600*this.zoomDirective.getZoom())
    };
  }

  openMenu(building: Building) {
    document.getElementsByClassName("constraint-container")[0].setAttribute("style","width: 60%;")
    document.getElementById("information-container")?.setAttribute("style","width:40%;")
    this.buildingName = building.name;
    this.buildingDescription = building.description;
    this.selectFloor(-1);
  }

  closeMenu() {
    document.getElementsByClassName("constraint-container")[0].setAttribute("style","width: 100%;");
    document.getElementById("information-container")?.setAttribute("style","display: none;");
    this.zoomDirective.setZoom(1);
    this.position=this.oldPosition;
    this.resetZoom = true;
  }

  selectFloor(floorNum: number) {
    let buttonNodes: NodeList = document.getElementById("info-floor-selector")?.childNodes!;
    buttonNodes.forEach(b => {
      let button: Element = <Element>b;
      if(button.textContent === ''+floorNum) {
        button.setAttribute("style","background-color: red;");
      } else {
        button.setAttribute("style","");
      }
    });
  }
}
