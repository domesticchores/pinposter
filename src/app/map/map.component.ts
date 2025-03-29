import { Component, OnInit, ViewChild } from '@angular/core'
import * as dataB from '../../../assets/buildings.json'
import * as dataP from '../../../assets/posters.json'
import { ZoomDirective } from '../zoom.directive'
import { timeout } from 'rxjs';


interface Building {
  id: string,
  name: string,
  description: string,
  shape: string,
  position: {posX:number,posY:number},
  floors: number,
  posters: number[]
}

interface Poster {
  id: number,
  floor: number,
  description: string,
  location: string,
  position:{posX:number,posY:number}
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
  buildingData: Building[] = [];
  posterData: Poster[] = []; // {[id:number] : Poster} = {};
  resetZoom: boolean = true;
  floorNumArr: number[] = Array(5).fill(1).map((x,i)=>i+1);
  posterArr: Poster[] = [];

  // current selection with defaults
  building: Building = {"id":"TST","name":"test","description":"a building","shape":"stringdata","position":{"posX":0,"posY":0},"floors":1,"posters":[0]}
  floor: number = 1;

  constructor(
    // private zoomDirective: ZoomDirective
  ) {}

  position = { x: 0, y: 0 }; // Initial position
  isDragging = false; // Dragging state
  offset = { x: 0, y: 0 }; // Offset to handle smooth dragging
  oldPosition = { x: 0, y: 0 };

  ngOnInit() {
    let rawData: any = dataB;
    this.buildingData = rawData.default;
    this.buildingData.forEach(element => {
      console.log(element.name);
    });
    rawData = dataP;
    this.posterData = rawData.default;
    this.posterData.forEach(element => {
      element.position.posX+=4;
      console.log("poster " + element.id + " loaded");
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
    const elem: HTMLElement = document.getElementById(building.name)!;
    this.center(building.position, building.name, scale);

  }

  selectPoster(poster: Poster, scale: number) {
    // some sort of selection
    this.center(poster.position, "poster#"+poster.id, scale);
  }

  center(position: {posX:number,posY:number}, id:string, scale: number) {
    const mapWidth = document.getElementById("mapElement")?.getBoundingClientRect().width!;
    const mapHeight = document.getElementById("mapElement")?.getBoundingClientRect().height!;
    if(this.resetZoom) {
      this.oldPosition = this.position;
    }
    this.resetZoom = false;

    // offsets:
    //x: 231.03334045410156
    //y: 121.10000610351562

    this.zoomDirective.setZoom(scale);
    let bounds = document.getElementById(id)!.getBoundingClientRect();
    console.log(" object position: ", bounds.x + " " + bounds.y)
    this.position={
      x: -(bounds.width/2) + (mapWidth/2) - (position.posX/1600)*(1200*this.zoomDirective.getZoom()),
      y: -(bounds.height/2) + (mapHeight/2) - (position.posY/800)*(600*this.zoomDirective.getZoom())
    };
  }

  openMenu(building: Building) {
    document.getElementsByClassName("constraint-container")[0].setAttribute("style","width: 60%;")
    document.getElementById("information-container")?.setAttribute("style","width:40%;")
    this.zoomDirective.disableZoom();
    this.building = building;
    // set the number of buttons to the number of floors in building
    this.floorNumArr = Array(building.floors).fill(1).map((x,i)=>i+1);
    // checks to see if the next building has the same amount of floors as the last one, otherwise sets floor to 1
    if (this.floor in this.floorNumArr) {
      this.selectFloor(this.floor);
    } else {
      this.floor = 1;
      this.selectFloor(1);
    }
  }

  closeMenu() {
    document.getElementsByClassName("constraint-container")[0].setAttribute("style","width: 100%;");
    document.getElementById("information-container")?.setAttribute("style","display: none;");
    this.zoomDirective.setZoom(1);
    this.position=this.oldPosition;
    this.resetZoom = true;
    this.zoomDirective.enableZoom();
  }

  selectFloor(floorNum: number) {
    this.floor = floorNum;
    let buttonNodes: NodeList = document.getElementById("info-floor-selector")?.childNodes!;
    console.log("selected floor: ", floorNum);
    // set buttons styling for selected floor
    buttonNodes.forEach(b => {
      let button: Element = <Element>b;
      if(!(button instanceof HTMLButtonElement)) return
      if(button.textContent === ''+floorNum) {
        button.classList.add("selected-button");
        button.classList.remove("unselected-button");
      } else {
        button.classList.remove("selected-button");
        button.classList.add("unselected-button");
      }
    });

    // reset poster array
    this.posterArr = [];
    // add poster to floor selection if its the right floor and right building
    this.posterData.forEach(poster => {
      if(poster.floor == floorNum && poster.location === this.building.id) {
        this.posterArr.push(poster)
      }
    });
    
  }
}
