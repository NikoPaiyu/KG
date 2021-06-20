import { Component, Input, ElementRef, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import html2canvas from 'html2canvas';
import { fromEvent, merge } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-handwriting',
  templateUrl: './handwriting.component.html',
  styleUrls: ['./handwriting.component.scss']
})
export class HandwritingComponent {

  @ViewChild('canvas', { static: true }) public canvas: ElementRef;

  @Input() public width = 960;
  @Input() public height = 480;
  isErase: boolean;
  color: string | CanvasGradient | CanvasPattern = 'red';
  canvasEl: HTMLCanvasElement;
  size: number;
  isVisible: boolean = false;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();



  ngOnInit() {
    this.canvasEl = this.canvas.nativeElement;
    this.cx = this.canvasEl.getContext('2d');

    this.canvasEl.style.touchAction = "none";
    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;

    this.cx.lineCap = 'round';

    this.size = 3;
    this.isErase = true;
    this.color = 'black';
    this.getCanvasMethod();

  }

  erase() {
    this.isErase = true;
    this.color = 'white';
    this.size = 20;
    this.getCanvasMethod();
  }

  draw() {
    this.size = 3;
    this.isErase = true;
    this.color = 'black';
    this.getCanvasMethod();
  }

  send() {
    let self = this;
    html2canvas(document.getElementById("s")).then(function (canvas) {
      var jpegUrl = canvas.toDataURL('image/jpeg');
      self.color = 'white';
      self.valueChange.emit(jpegUrl);
      self.cx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  clear() {
    let self = this;
    html2canvas(document.getElementById("s")).then(function (canvas) {
      self.cx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  private cx: CanvasRenderingContext2D;
  failedRequestSub: any;


  public getCanvasMethod() {

    this.cx.lineWidth = this.size;

    this.cx.strokeStyle = this.color;

    this.captureEvents(this.canvasEl);
  }


  private captureEvents(canvasEl: HTMLCanvasElement) {

    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event    
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'touchcancel')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()

            )
        })
      )
      .subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();


        console.log(res);

        const prevPos = {
          x: res[0].changedTouches[0].clientX - rect.left,
          y: res[0].changedTouches[0].clientY - rect.top,
        };

        const currentPos = {
          x: res[1].changedTouches[0].clientX - rect.left,
          y: res[1].changedTouches[0].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }

  }

}
