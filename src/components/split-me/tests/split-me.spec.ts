import { SplitMe } from '../split-me';

it('should convert size string property to array', () => {
  const splitMe = new SplitMe();

  let sizes: string;
  let sizesArray: number[];

  splitMe.n = 3;
  sizes = '0.3, 0.4, 0.3';
  sizesArray = splitMe.parseSizes(sizes);
  expect(sizesArray).toEqual([0.3, 0.4, 0.3]);

  splitMe.n = 5;
  sizes = '7%, 50%, 20%, 15%, 8%';
  sizesArray = splitMe.parseSizes(sizes);
  expect(sizesArray).toEqual([0.07, 0.5, 0.2, 0.15, 0.08]);

  splitMe.n = 5;
  sizes = '7%, 50%, 0.2, 0.15, 8%';
  sizesArray = splitMe.parseSizes(sizes);
  expect(sizesArray).toEqual([0.07, 0.5, 0.2, 0.15, 0.08]);
});

it('should convert size array to slot end (i.e. cumsum)', () => {
  const splitMe = new SplitMe();
  let slotEnd: number[];

  slotEnd = splitMe.assignedSlotEnd([0.25, 0.5, 0.1, 0.15]);
  expect(slotEnd).toEqual([0.25, 0.75, 0.85, 1]);

  slotEnd = splitMe.assignedSlotEnd([0.5, 0.25, 0.25, 0.5]);
  expect(slotEnd).toEqual([0.5, 0.75, 1, 1]);

  slotEnd = splitMe.defaultSlotEnd(5);
  expect(slotEnd).toEqual([0.2, 0.4, 0.6, 0.8, 1.0]);
});

it('should proportionally adjust slots when n changes', () => {
  const splitMe = new SplitMe();

  let slotEnd: number[];
  let oldSlotEnd: number[];

  oldSlotEnd = [0.25, 0.5, 0.75, 1];

  slotEnd = splitMe.rescaleSlotEnd(oldSlotEnd.length, oldSlotEnd);
  expect(slotEnd).toEqual(oldSlotEnd);

  slotEnd = splitMe.rescaleSlotEnd(3, oldSlotEnd);
  expect(slotEnd).toEqual([1 / 3, 2 / 3, 1]);

  slotEnd = splitMe.rescaleSlotEnd(6, oldSlotEnd);
  expect(slotEnd).toEqual([1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1]);
});
