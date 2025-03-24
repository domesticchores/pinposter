import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core'
import * as data from '../../../assets/buildings.json'
import { ZoomDirective } from '../zoom.directive'


interface Building {
  id: number,
  name: string,
  shape: string,
  position:{posX:number,posY:number},
  floors: number,
  posters:number[]
}
// {"id":0,"name":"shed","shape":"stringdata","position":{"posX":0,"posY":0},"posters":[0]}
@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit, AfterViewInit {
  rawData: any
  buildingData: Building[] = []
  b: Building = {"id":0,"name":"shed","shape":"stringdata","position":{"posX":0,"posY":0},"floors":1,"posters":[0]}

  constructor(
    // private zoomDirective: ZoomDirective
    private renderer: Renderer2
  ) {this.renderer = renderer}

  position = { x: 0, y: 0 }; // Initial position
  isDragging = false; // Dragging state
  offset = { x: 0, y: 0 }; // Offset to handle smooth dragging
  oldPosition = { x: 0, y: 0 };

  private scale: number = 1;
  private tx: number = 0;
  private ty: number = 0;

  private maxZoom: number = 5;
  private minZoom: number = 0.75;
  private zoomFactor: number = 0.1;

  private isEnabled = true;
  private element!: HTMLElement;

  ngOnInit() {
    this.rawData = data;
    this.buildingData = this.rawData.default;
    this.buildingData.forEach(element => {
      console.log(element.name);
    });
  }

  ngAfterViewInit() {
    this.element = this.renderer.selectRootElement(".draggable-container")
    console.log("map element: ", this.element)
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
    // this.zoomDirective.setZoom(100);
    console.log("selecting: ", building.name);
  }

  onWheel(event: WheelEvent): void {
    if (!this.isEnabled) {return}

    this.element = this.renderer.selectRootElement(".draggable-container",true);

    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = event.deltaY > 0;

    const atTop = this.element.scrollTop === 0;
    const atBottom = this.element.scrollTop + this.element.clientHeight === this.element.scrollHeight;

    if ((isScrollingUp && atTop) || (isScrollingDown && atBottom)) {
      event.preventDefault();
    }

    if (event.deltaY > 0) {
        this.scale-=this.zoomFactor*this.scale;
        if(this.scale<this.minZoom) {
            this.scale=this.minZoom;
        }
    } else {
        this.scale+=this.zoomFactor*this.scale;
        if(this.scale>this.maxZoom) {
            this.scale=this.maxZoom;
        }
    }
    this.updateZoom();
  }

  private updateZoom() {
    this.renderer.setStyle(this.element, 'transform', `scale(${this.scale})`);
    this.renderer.setStyle(this.element, 'transition', 'transform 0.1s ease');
  }
}
