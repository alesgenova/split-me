import { Component, Prop, State, Watch, Element, Event, EventEmitter } from '@stencil/core';

import { throttle } from 'lodash-es';

@Component({
  tag: 'split-me',
  styleUrl: 'split-me.css',
  shadow: true
})
export class SplitMe {

  @Prop() n: number = 1;
  @Watch('n') watchN() {
    this.nChanged = true;
  }

  @Prop() d: 'horizontal' | 'vertical';
  @Prop() fixed: boolean = false;
  @Prop() sizes: string = '';
  @Prop() throttle: number = 0;
  @Watch('sizes') watchSizes() {
    this.sizesChanged = true;
  }

  @Element() el: HTMLElement;

  @State() slotEnd: number[];

  @Event() slotResized: EventEmitter;
  
  nChanged: boolean = false;
  sizesChanged: boolean = false;

  throttledResize = throttle(this.resize.bind(this), this.throttle);

  componentWillLoad() {
    // Validate the sizes attribute
    let sizes: number[] = this.parseSizes(this.sizes);
    if (sizes.length === this.n) {
      this.slotEnd = this.assignedSlotEnd(sizes);
    } else {
      this.slotEnd = this.defaultSlotEnd(this.n);
    }
  }

  componentWillUpdate() {
    // Validate the new sizes attribute
    let sizes: number[];
    if (this.sizesChanged) {
      sizes = this.parseSizes(this.sizes);
      if (sizes.length !== this.n) {
        this.sizesChanged = false;
      }
    }

    if (this.sizesChanged) {
      this.slotEnd = this.assignedSlotEnd(sizes);
    } else if (this.nChanged) {
      this.slotEnd = this.rescaleSlotEnd(this.n, this.slotEnd);
    }

    this.nChanged = false;
    this.sizesChanged = false;
  }

  defaultSlotEnd(n: number) : number[] {
    let slotEnd: number[] = [];
    for (let i = 0; i < n; ++i) {
      slotEnd.push((i + 1) / n);
    }
    return slotEnd;
  }

  assignedSlotEnd(sizes: number[]) : number[] {
    let slotEnd: number[] = [];
    let currFrac = 0;
    for (let i = 0; i < sizes.length; ++i) {
      currFrac += sizes[i];
      slotEnd.push(Math.min(1, currFrac));
    }
    return slotEnd;
  }

  rescaleSlotEnd(n: number, oldEnd: number[]): number[] {
    let scale: number = oldEnd.length / n;
    let slotEnd: number[] = [];
    for (let i = 0; i < n - 1; ++i) {
      if (i < oldEnd.length) {
        slotEnd.push(oldEnd[i] * scale);
      } else {
        slotEnd.push((i + 1) / n);
      }
    }
    // The last slot should always expand to the end
    slotEnd.push(1);
    return slotEnd;
  }

  parseSizes(sizesStr: string) : number[] {
    if (!sizesStr) {
      return [];
    }
    let sizesStrArr: string[] = sizesStr.split(',');
    if (sizesStrArr.length !== this.n) {
      return [];
    }
    let sizes: number[] = [];
    const percentRegex: RegExp = /^\s*\d+(\.\d*)?\%\s*$/;
    const fracRegex: RegExp = /^\s*\d(\.\d*)?\s*$/;
    for (let i = 0; i < sizesStrArr.length; ++i) {
      let str: string = sizesStrArr[i];
      if (str.match(percentRegex)) {
        sizes.push(parseFloat(str) / 100);
      } else if (str.match(fracRegex)) {
        sizes.push(parseFloat(str));
      } else {
        return [];
      }
    }
    return sizes;
  }

  onDragStart(event: DragEvent, i: number) {
    // Resize on desktop
    // Firefox wouldn't allow using drag events for resizing purposes,
    // use this workaround instead.
    event.preventDefault();
    let mouseMoveListener = (e: MouseEvent) => {
      this.throttledResize(e.clientX, e.clientY, i);
    }
    window.addEventListener('mousemove', mouseMoveListener);
    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', mouseMoveListener);
    });
  }

  onTouchMove = (event: TouchEvent, i: number) => {
    // Resize on mobile
    event.preventDefault();
    if (event.touches.length > 0) {
      // Avoid scrolling the page
      this.throttledResize(event.touches[0].clientX, event.touches[0].clientY, i);
    }
  }

  resize(x: number, y: number, i: number) {
    let min = i > 0 ? this.slotEnd[i - 1] : 0;
    let max = i < this.n - 1 ? this.slotEnd[i + 1] : 1;
    let frac: number;
    let rect = this.el.getBoundingClientRect();
    if (this.d === 'vertical') {
      frac = (y - rect.top ) / rect.height;
    } else {
      frac = (x - rect.left ) / rect.width;
    }
    if (frac > min && frac < max) {
      this.slotEnd = [...this.slotEnd.slice(0, i), frac, ...this.slotEnd.slice(i + 1) ];
      this.slotResized.emit(i);
    }
  }

  getSlotSize(i: number) : number {
    if (i === 0) {
      return this.slotEnd[i];
    } else {
      return this.slotEnd[i] - this.slotEnd[i - 1];
    }
  }

  render() {
    if (!this.slotEnd || this.slotEnd.length === 0) {
      return null;
    }

    let slotContainers = [];
    let slotDividers = [];
    let phantomDividers = [];

    for (let i = 0; i < this.n; ++i) {
      let containerId = `container${i}`;
      let slotName = `${i}`;
      let size: number = this.getSlotSize(i);
      let style;
      if (this.d === 'vertical') {
        style = {width: '100%', height: `${size * 100}%`};
      } else {
        style = {width: `${size * 100}%`, height: '100%'};
      }
      slotContainers.push(
        <div id={containerId} style={style}>
          <slot name={slotName} />
        </div>
      );
    }

    for (let i = 0; i < this.n - 1; ++i) {
      let style;
      let displayClasses: string;
      let phantomClasses: string;
      if (this.d === 'vertical') {
        style = {top: `${100 * this.slotEnd[i]}%`};
        displayClasses = 'divider-v display-divider-v';
        phantomClasses = 'divider-v phantom-divider-v';
      } else {
        style = {left: `${100 * this.slotEnd[i]}%`};
        displayClasses = 'divider-h display-divider-h';
        phantomClasses = 'divider-h phantom-divider-h';
      }
      slotDividers.push(
        <div class={displayClasses} style={style}>
        </div>
      );
      if (!this.fixed) {
        phantomDividers.push(
          <div class={phantomClasses}
            draggable={true}
            onDragStart={(e) => {this.onDragStart(e, i)}}
            onTouchMove={(e) => {this.onTouchMove(e, i)}}
            style={style}>
          </div>
        );
      }
    }

    return (
      <div class="top-container">
        <div class="dividers-container">
          {slotDividers}
          {phantomDividers}
        </div>
        <div class={this.d === 'vertical' ? 'slots-container-v' : 'slots-container-h'} >
          {slotContainers}
        </div>
      </div>
    );
  }
}
