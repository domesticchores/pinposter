import { Directive, ElementRef, Host, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appZoom]'
})



export class ZoomDirective {
    private scale: number = 1;
    private tx: number = 0;
    private ty: number = 0;
    private element: ElementRef;

    constructor(
        private el: ElementRef, 
        private renderer: Renderer2,
    ) {
      this.element = el.nativeElement;
    }
    
    
  @HostListener('drag',['$event'])
  onDrag(event: DragEvent): void {
    this.element.nativeElement;
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {

    const element = this.el.nativeElement;

    const isScrollingUp = event.deltaY < 0;
    const isScrollingDown = event.deltaY > 0;

    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollTop + element.clientHeight === element.scrollHeight;

    if ((isScrollingUp && atTop) || (isScrollingDown && atBottom)) {
      event.preventDefault();
    }

    if (event.deltaY > 0) {
        console.log("SMALL");
        this.scale-=0.01;
        if(this.scale<1) {
            this.scale=1;
        }
    } else {
        console.log("BIG");
        this.scale+=0.01;
        if(this.scale>2) {
            this.scale=2;
        }
    }
    this.updateZoom();
  }
  
  private updateZoom() {
    let styles = window.getComputedStyle(this.el.nativeElement);
    let transform = styles.transform;
    let arr = transform.match(/matrix.*\((.+)\)/)?.[1].split(', ');
    let tx = arr![4] || 0;
    let ty = arr![5] || 0;

    console.log("scale: ", tx, ty, this.scale)
    this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${tx}px,${ty}px,0px) scale(${this.scale})`);
    //this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${tx}px ${ty}px) scale(${this.scale})`);
    //this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'top left');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.1s ease'); // Smooth transition
  }
}