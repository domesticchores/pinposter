import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
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
  photo: string
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

export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('zoomInstance') zoomDirective!: ZoomDirective;
  @ViewChild('mapElement') mapElement!: HTMLElement;
  buildingData: Building[] = [];
  posterData: Poster[] = []; // {[id:number] : Poster} = {};
  resetZoom: boolean = true;
  floorNumArr: number[] = Array(5).fill(1).map((x,i)=>i+1);
  posterArr: Poster[] = [];

  // current selection with defaults
  building: Building = {"id":"TST","name":"test","description":"a building","shape":"stringdata","position":{"posX":0,"posY":0},"floors":1,"photo":""}
  floor: number = 1;
  poster: Poster = {"id":1,"floor":1,"description":"test","location":"ABC","position":{posX:0,posY:0}}

  constructor(
    // private zoomDirective: ZoomDirective
  ) {}

  position = { x: 0, y: 0 }; // Initial position
  isDragging = false; // Dragging state
  offset = { x: 0, y: 0 }; // Offset to handle smooth dragging
  oldPosition = { x: 0, y: 0 };
  scaleOffset = 0;

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

  ngAfterViewInit() {
    let boundingMap = document.getElementsByClassName("map-background")[0]!.getBoundingClientRect();
    let boundingContainer = document.getElementById("mapElement")!.getBoundingClientRect();
    this.scaleOffset = boundingContainer.width/boundingMap.width;
    console.log("map offset: ", this.scaleOffset);
    this.zoomDirective.setZoom(this.scaleOffset);
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
      document.getElementById("draggable-containter")?.setAttribute("style",`transform-origin: ${this.position.x}px ${this.position.y}px`)
    }
  }

  onDragEnd(): void {
    this.isDragging = false;
  }
  
  select(building: Building, scale: number) {
    this.openMenu(building);
    const elem: HTMLElement = document.getElementById(building.name)!;
    this.center(building.position, building.name, scale);
    this.showPosterList();

  }

  selectPoster(poster: Poster, scale: number) {
    // some sort of selection
    this.poster = poster;
    this.center({posX:poster.position.posX-3,posY:poster.position.posY}, "poster#"+poster.id, scale);
    this.showPosterInfo();
  }

  center(position: {posX:number,posY:number}, id:string, scale: number) {
    const mapWidth = document.getElementById("mapElement")?.getBoundingClientRect().width!;
    const mapHeight = document.getElementById("mapElement")?.getBoundingClientRect().height!;
    // const boundingMap = document.getElementsByClassName("map-background")[0]!.getBoundingClientRect();
    // const scaleOffset = {x:boundingMap.width/1800,y:boundingMap.height/600}
    if(this.resetZoom) {
      this.oldPosition = this.position;
    }
    this.resetZoom = false;

    // offsets:
    //x: 231.03334045410156
    //y: 121.10000610351562

    this.zoomDirective.setZoom(scale);
    let bounds = document.getElementById(id)!.getBoundingClientRect();
    console.log(" object position: ", bounds.x + " " + bounds.y);
    this.position={
      x: -(bounds.width/2) + (mapWidth/2) - (position.posX/1600)*(1200*this.zoomDirective.getZoom()),
      y: -(bounds.height/2) + (mapHeight/2) - (position.posY/800)*(600*this.zoomDirective.getZoom())
    };
  }

  openMenu(building: Building) {
    document.getElementsByClassName("constraint-container")[0].setAttribute("style","width: 60%;");
    document.getElementById("information-container")?.setAttribute("style","width:40%;");
    if(building.photo !== "") {
      document.getElementById("header-location-image")?.setAttribute("src",building.photo)
    } else {
      document.getElementById("header-location-image")?.setAttribute("src","https://placehold.jp/200x150.png")
    }
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
    this.showPosterList();
  }

  closeMenu() {
    document.getElementsByClassName("constraint-container")[0].setAttribute("style","width: 100%;");
    document.getElementById("information-container")?.setAttribute("style","display: none;");
    this.zoomDirective.setZoom(this.scaleOffset);
    this.position=this.oldPosition;
    this.resetZoom = true;
    this.posterArr = [];
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

    this.showPosterList();
    
  }

  showPosterList() {
    document.getElementById("poster-list-container")?.setAttribute("style","display: relative");
    document.getElementById("poster-info-container")?.setAttribute("style","display: none");
  }

  showPosterInfo() {
    document.getElementById("poster-list-container")?.setAttribute("style","display: none");
    document.getElementById("poster-info-container")?.setAttribute("style","display: relative");
  }
}
