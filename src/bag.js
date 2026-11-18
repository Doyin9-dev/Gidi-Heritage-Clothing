import { acceptsSize, getProduct } from './catalog.js';

export const BAG_STORAGE_KEY = 'gidi-heritage-bag-v1';
export const MAX_QUANTITY = 12;

export function updateBag(bag, id, size, delta) {
  if (!acceptsSize(getProduct(id), size) || !Number.isInteger(delta) || !delta) return bag;

  const index = bag.findIndex((line) => line.id === id && line.size === size);
  const quantity = Math.min(MAX_QUANTITY, (bag[index]?.quantity ?? 0) + delta);

  if (index === -1) return quantity > 0 ? [...bag, { id, size, quantity }] : bag;
  if (quantity < 1) return bag.filter((_, position) => position !== index);
  return bag.map((line, position) => position === index ? { ...line, quantity } : line);
}

export function parseBag(value) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.reduce((bag, line) => {
      if (!line || !Number.isInteger(line.quantity) || line.quantity < 1) return bag;
      return updateBag(bag, line.id, line.size, line.quantity);
    }, []);
  } catch {
    return [];
  }
}

export function summarizeBag(bag) {
  return bag.reduce(({ count, subtotal }, line) => ({
    count: count + line.quantity,
    subtotal: subtotal + getProduct(line.id).price * line.quantity,
  }), { count: 0, subtotal: 0 });
}
