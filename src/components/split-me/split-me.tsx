import { Component, Prop, State, Watch, Element } from '@stencil/core';

@Component({
  tag: 'split-me',
  styleUrl: 'split-me.css',
  shadow: true
})
export class SplitMe {

  @Prop() n: number = 1;
  @Watch('n') watchN(curr, prev) {
    let scale: number = prev / curr;
    let newEnd = [];
    for (let i = 0; i < curr - 1; ++i) {
      if (i < prev) {
        newEnd.push(this.slotEnd[i] * scale);
      } else {
        newEnd.push((i + 1) / curr);
      }
    }
    // The last slot should always expand to the end
    newEnd.push(1);
    this.slotEnd = newEnd;
  }

  @Prop() d: string;
  @Prop() fixed: boolean = false;
  @Prop() sizes: string = "";

  @Element() el: HTMLElement;

  @State() slotEnd: number[];
  
  slotContainers: any[];
  slotDividers: any[];
  phantomDividers: any[];
  topContainer: HTMLElement;

  componentWillLoad() {
    this.slotEnd = this.calculateSlotEnd(this.n, this.parseSizes(this.sizes));
  }

  calculateSlotEnd(n: number, sizes: number[]): number[] {
    let slotEnd: number[] = [];
    if (sizes.length === n) {
      let currFrac = 0;
      for (let i = 0; i < n; ++i) {
        currFrac += sizes[i];
        slotEnd.push(Math.min(1, currFrac));
      }
    } else {
      for (let i = 0; i < n; ++i) {
        slotEnd.push((i + 1) / n);
      }
    }
    return slotEnd;
  }

  parseSizes(sizesStr: string) : number[] {
    if (!sizesStr) {
      return [];
    }
    let sizesStrArr: string[] = sizesStr.split(",");
    if (sizesStrArr.length !== this.n) {
      return [];
    }
    let sizes: number[] = [];
    const percentRegex: RegExp = /^\s*\d+(\.\d*)?\%\s*$/;
    const fracRegex: RegExp = /^\s*0(\.\d*)?\s*$/;
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
    // Firefox wouldn't let us drag events directly for the resizing purpose,
    // use this workaround instead.
    if (this.fixed === true) {
      return;
    }
    event.preventDefault();
    let mouseMoveListener = (e: MouseEvent) => {
      this.resize(e.clientX, e.clientY, i);
    }
    window.addEventListener("mousemove", mouseMoveListener);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", mouseMoveListener);
    });
  }

  onTouchMove(event: TouchEvent, i: number) {
    // Resize on mobile
    if (this.fixed === true) {
      return;
    }
    if (event.touches.length > 0) {
      // Avoid scrolling the page
      event.preventDefault();
      this.resize(event.touches[0].clientX, event.touches[0].clientY, i);
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
        style = {width: "100%", height: `${size * 100}%`};
      } else {
        style = {width: `${size * 100}%`, height: "100%"};
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
        displayClasses = "divider-v display-divider-v";
        phantomClasses = "divider-v phantom-divider-v";
      } else {
        style = {left: `${100 * this.slotEnd[i]}%`};
        displayClasses = "divider-h display-divider-h";
        phantomClasses = "divider-h phantom-divider-h";
      }
      slotDividers.push(
        <div class={displayClasses} style={style}>
        </div>
      );
      phantomDividers.push(
        <div class={phantomClasses}
          draggable={true}
          onDragStart={(e) => {this.onDragStart(e, i)}}
          onTouchMove={(e) => {this.onTouchMove(e, i)}}
          style={style}>
        </div>
      );
    }

    return (
      <div class="top-container">
        <div class={this.d === 'vertical' ? 'slots-container-v' : 'slots-container-h'} >
          <div class="dividers-container">
            {slotDividers}
            {phantomDividers}
          </div>
          {slotContainers}
        </div>
      </div>
    );
  }
}
