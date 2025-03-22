import { Directive, ElementRef, Host, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[preventZoom]',
  standalone: false,
})

export class preventZoom {
    private element: ElementRef;

    constructor(
        private el: ElementRef, 
        private renderer: Renderer2,
    ) {
      this.element = el.nativeElement;
    }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {

    event.preventDefault();
     }
}