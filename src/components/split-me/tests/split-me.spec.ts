import { SplitMe } from '../split-me';

const toAlmostEqual = (
  received: number[],
  reference: number[],
  threshold: number = 1e-12
) => {
  const pass = received.every((val, i) =>
    almostEqual(val, reference[i], threshold)
  );
  if (pass) {
    return {
      message: () =>
        `expected ${received} is almost equal to ${reference} within ${threshold}`,
      pass: true
    };
  } else {
    return {
      message: () =>
        `expected ${received} differs from ${reference} by more than ${threshold}`,
      pass: false
    };
  }
};

const almostEqual = (a, b, threshold) => {
  return Math.abs(a - b) < threshold;
};

expect.extend({ toAlmostEqual });

it('should convert size string property to array', () => {
  const splitMe = new SplitMe();

  let sizes: string | number[];
  let sizesOut: number[];

  splitMe.n = 3;
  sizes = '0.3, 0.4, 0.3';
  sizesOut = splitMe.parseSizes(sizes);
  expect(sizesOut).toEqual([0.3, 0.4, 0.3]);

  splitMe.n = 5;
  sizes = '7%, 50%, 20%, 15%, 8%';
  sizesOut = splitMe.parseSizes(sizes);
  expect(sizesOut).toEqual([0.07, 0.5, 0.2, 0.15, 0.08]);

  splitMe.n = 5;
  sizes = '7%, 50%, 0.2, 0.15, 8%';
  sizesOut = splitMe.parseSizes(sizes);
  expect(sizesOut).toEqual([0.07, 0.5, 0.2, 0.15, 0.08]);

  splitMe.n = 4;
  sizes = [0.2, 0.2, 0.2, 0.4];
  sizesOut = splitMe.parseSizes(sizes);
  expect(sizesOut).toEqual(sizes);
});

it('should convert size array to slot end (i.e. cumsum)', () => {
  const splitMe = new SplitMe();
  let slotEnd: number[];

  slotEnd = splitMe.assignedSlotEnd([0.25, 0.5, 0.1, 0.15]);
  expect(slotEnd)['toAlmostEqual']([0.25, 0.75, 0.85, 1]);

  slotEnd = splitMe.assignedSlotEnd([0.5, 0.25, 0.25, 0.5]);
  expect(slotEnd)['toAlmostEqual']([0.5, 0.75, 1, 1]);

  slotEnd = splitMe.defaultSlotEnd(5);
  expect(slotEnd)['toAlmostEqual']([0.2, 0.4, 0.6, 0.8, 1.0]);
});

it('should convert slot end array to size array', () => {
  const splitMe = new SplitMe();
  let sizes: number[];

  sizes = splitMe.slotEndToSizes([0.25, 0.75, 0.85, 1]);
  expect(sizes)['toAlmostEqual']([0.25, 0.5, 0.1, 0.15]);

  sizes = splitMe.slotEndToSizes([0.5, 0.75, 1, 1]);
  expect(sizes)['toAlmostEqual']([0.5, 0.25, 0.25, 0]);
});

it('should proportionally adjust slots when n changes', () => {
  const splitMe = new SplitMe();

  let slotEnd: number[];
  let oldSlotEnd: number[];

  oldSlotEnd = [0.25, 0.5, 0.75, 1];

  slotEnd = splitMe.rescaleSlotEnd(oldSlotEnd.length, oldSlotEnd);
  expect(slotEnd)['toAlmostEqual'](oldSlotEnd);

  slotEnd = splitMe.rescaleSlotEnd(3, oldSlotEnd);
  expect(slotEnd)['toAlmostEqual']([1 / 3, 2 / 3, 1]);

  slotEnd = splitMe.rescaleSlotEnd(6, oldSlotEnd);
  expect(slotEnd)['toAlmostEqual']([1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1]);
});
