export const FILTERS = [
  { id: 'all', name: 'All pieces' },
  { id: 'tank-tops', name: 'Tank tops' },
  { id: 't-shirts', name: 'T-shirts' },
];

export const PRODUCTS = [
  {
    id: 'gh-tank-white',
    name: 'GH Tank Top — White',
    type: 'tank-tops',
    category: 'Tank top',
    price: 20000,
    color: 'White',
    trim: 'Black',
    swatch: '#ffffff',
    searchTerms: ['vest', 'singlet', 'sleeveless'],
    sizes: [],
    description: 'A white tank top with black trim around the neckline and armholes, a black GH mark on the chest, and a plain back.',
    imageAlt: 'Front and back of the white GH tank top with black trim',
  },
  {
    id: 'gh-tank-black',
    name: 'GH Tank Top — Black',
    type: 'tank-tops',
    category: 'Tank top',
    price: 20000,
    color: 'Black',
    trim: 'White',
    swatch: '#141414',
    searchTerms: ['vest', 'singlet', 'sleeveless'],
    sizes: [],
    description: 'A black tank top with white trim around the neckline and armholes, a white GH mark on the chest, and a plain back.',
    imageAlt: 'Front and back of the black GH tank top with white trim',
  },
  {
    id: 'gh-ringer-white',
    name: 'GH Ringer Tee — White',
    type: 't-shirts',
    category: 'T-shirt',
    price: 20000,
    color: 'White',
    trim: 'Black',
    swatch: '#ffffff',
    searchTerms: ['tshirt', 'short sleeve', 'crew neck'],
    sizes: [],
    description: 'A white short-sleeve tee with a black collar and cuffs, a black GH mark on the chest, and a plain back.',
    imageAlt: 'Front and back of the white GH ringer tee with black trim',
  },
  {
    id: 'gh-ringer-black',
    name: 'GH Ringer Tee — Black',
    type: 't-shirts',
    category: 'T-shirt',
    price: 20000,
    color: 'Black',
    trim: 'White',
    swatch: '#141414',
    searchTerms: ['tshirt', 'short sleeve', 'crew neck'],
    sizes: [],
    description: 'A black short-sleeve tee with a white collar and cuffs, a white GH mark on the chest, and a plain back.',
    imageAlt: 'Front and back of the black GH ringer tee with white trim',
  },
];

const productById = new Map(PRODUCTS.map((product) => [product.id, product]));
const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

export function getProduct(id) {
  return productById.get(id);
}

export function formatPrice(amount) {
  return naira.format(amount);
}

export function acceptsSize(product, size) {
  if (!product) return false;
  return product.sizes.length ? product.sizes.includes(size) : size === null;
}

export function filterProducts(filter) {
  return filter === 'all' ? PRODUCTS : PRODUCTS.filter((product) => product.type === filter);
}

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function searchProducts(query) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return PRODUCTS.filter((product) => {
    const categoryName = FILTERS.find(({ id }) => id === product.type)?.name;
    const searchable = normalize([product.name, product.category, categoryName, product.color, product.material, ...product.searchTerms].join(' '));
    return terms.every((term) => searchable.includes(term));
  });
}
