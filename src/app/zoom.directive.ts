import { Directive, ElementRef, Host, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[zoomDirective]',
  exportAs:'zoomDirective'
})



export class ZoomDirective {
    private scale: number = 1;
    private tx: number = 0;
    private ty: number = 0;
    private element: ElementRef;

    private maxZoom: number = 5;
    private minZoom: number = 0.75;
    private zoomFactor: number = 0.1;

    private isEnabled = true;

    constructor(
        private el: ElementRef, 
        private renderer: Renderer2,
    ) {
      this.element = el.nativeElement;
    }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (!this.isEnabled) {return}

    const element = this.el.nativeElement;

    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = event.deltaY > 0;

    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollTop + element.clientHeight === element.scrollHeight;

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
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', `center center`); // update this line for zoom
    this.updateZoom();
  }
  
  private updateZoom() {
    console.log("changed scale to: ", this.scale);
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${this.scale})`);
    //this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${tx}px ${ty}px) scale(${this.scale})`);
    //this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'top left');
    //this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease'); // Smooth transition
  }

  enableZoom() {
    this.isEnabled = true;
  }

  disableZoom() {
    this.isEnabled = false;
  }

  setZoom(amt: number) {
    this.scale = amt;
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', "top left");
    this.updateZoom();
  }

  getZoom() {
    return this.scale;
  }

  setZoomWithPosition(amt: number, left:number,top:number) {
    this.scale = amt;
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', left + "px " + top + "px");
    this.updateZoom();
  }

}