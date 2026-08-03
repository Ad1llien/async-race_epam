const CAR_BRANDS = [
  'Tesla',
  'Ford',
  'BMW',
  'Audi',
  'Toyota',
  'Honda',
  'Chevrolet',
  'Nissan',
  'Mazda',
  'Kia',
];
const CAR_MODELS = [
  'Model S',
  'Mustang',
  'M5',
  'A6',
  'Corolla',
  'Civic',
  'Camaro',
  'GT-R',
  'CX-5',
  'Sportage',
];
const HEX_DIGITS = '0123456789ABCDEF';
const COLOR_HEX_LENGTH = 6;

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomCarName(): string {
  return `${randomItem(CAR_BRANDS)} ${randomItem(CAR_MODELS)}`;
}

export function randomColor(): string {
  let color = '#';
  for (let i = 0; i < COLOR_HEX_LENGTH; i += 1) {
    color += randomItem(HEX_DIGITS.split(''));
  }
  return color;
}
