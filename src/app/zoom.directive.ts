import { AfterViewInit, Directive, ElementRef, Host, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Directive({
  selector: '[zoomDirective]'
})



export class ZoomDirective implements AfterViewInit{
  @ViewChild('mapMain', { static: false }) elementRef!: ElementRef;
    private scale: number = 1;
    private tx: number = 0;
    private ty: number = 0;

    private maxZoom: number = 5;
    private minZoom: number = 0.75;
    private zoomFactor: number = 0.1;

    private isEnabled = true;

    constructor(
        private el: ElementRef, 
        private renderer: Renderer2,
    ) {}

  ngAfterViewInit(): void {
    console.log("map found: ", this.elementRef)
    const htmlElement: HTMLElement = this.elementRef.nativeElement;
    console.log("element itself" ), htmlElement
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
    this.updateZoom();
  }
  
  private updateZoom() {
    // let styles = window.getComputedStyle(this.el.nativeElement);
    // let transform = styles.transform;
    // let arr = transform.match(/matrix.*\((.+)\)/)?.[1].split(', ');
    // let tx = arr![4] || 0;
    // let ty = arr![5] || 0;

    // console.log("scale: ", tx, ty, this.scale)
    this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${this.scale})`);
    //this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${tx}px ${ty}px) scale(${this.scale})`);
    //this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'top left');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease'); // Smooth transition
  }

  enableZoom() {
    this.isEnabled = true;
  }

  disableZoom() {
    this.isEnabled = false;
  }

  setZoom(amt: number) {
    this.scale = amt;
    this.updateZoom();
  }

}