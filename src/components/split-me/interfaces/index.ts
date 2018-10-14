export interface IResizeEvent {
  sizes: number[];
  splitter: HTMLElement;
  divider: number;
  originalEvent: MouseEvent | TouchEvent;
}
