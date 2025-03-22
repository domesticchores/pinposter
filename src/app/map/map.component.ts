import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  position = { x: 0, y: 0 }; // Initial position
  isDragging = false; // Dragging state
  offset = { x: 0, y: 0 }; // Offset to handle smooth dragging

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
}
