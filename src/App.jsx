import { useEffect, useState } from 'react';
import { BAG_STORAGE_KEY, parseBag, summarizeBag, updateBag } from './bag.js';
import { FILTERS, filterProducts, formatPrice } from './catalog.js';
import { Icon } from './Icons.jsx';
import { uploadedMedia } from './media.js';
import { StoreDialog } from './StoreDialog.jsx';

function BrandLink({ showLogo = false }) {
  const logo = showLogo ? uploadedMedia('logo') : null;
  return (
    <a className="brand-link" href="#top" data-has-logo={logo ? '' : undefined} aria-label="Gidi Heritage Clothing">
      {logo && <img className="brand-logo" src={logo} alt="" />}
      <span className="brand-name">Gidi Heritage Clothing</span>
    </a>
  );
}

function Header({ count, onOpen }) {
  return (
    <>
      <div className="announcement" id="top">
        <a href="#shop">The Lagos Edit has arrived <Icon name="arrow" /></a>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <button className="icon-button menu-toggle" type="button" aria-label="Open navigation" aria-haspopup="dialog"
            onClick={() => onOpen({ kind: 'menu' })}>
            <Icon name="menu" />
          </button>
          <BrandLink showLogo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#shop">Shop</a>
            <a href="#story">Our Story</a>
            <button type="button" aria-haspopup="dialog" onClick={() => onOpen({ kind: 'size-guide' })}>Size Guide</button>
          </nav>
          <div className="header-actions">
            <button className="icon-button" type="button" aria-label="Search" aria-haspopup="dialog"
              onClick={() => onOpen({ kind: 'search' })}>
              <Icon name="search" />
            </button>
            <button className="bag-toggle" type="button" aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}
              aria-haspopup="dialog" onClick={() => onOpen({ kind: 'bag' })}>
              <Icon name="bag" />
              <span className="bag-text">Bag</span> <span className="bag-count">({count})</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function Hero() {
  const photo = uploadedMedia('lagos-campaign');
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="hero-content">
            <p className="eyebrow section-eyebrow hero-eyebrow">Drop 01 <span aria-hidden="true">/</span> Lagos, Nigeria</p>
            <h1 id="hero-title">
              Rooted in<br />heritage.
              <em>Made for now.</em>
            </h1>
            <p className="hero-description">From Lagos, four black-and-white essentials: contrast-trim tank tops and ringer tees with the GH chest mark.</p>
            <a className="button button-light hero-cta" href="#shop">Explore the collection <Icon name="arrow" /></a>
          </div>
        </div>
        {photo ? (
          <figure className="hero-photo">
            <img src={photo} fetchPriority="high" alt="The Lagos Edit campaign" />
            <figcaption className="photo-label"><span>01</span><span className="photo-label-line" /> The Lagos Edit</figcaption>
          </figure>
        ) : (
          <div className="campaign-placeholder" aria-hidden="true">
            <div className="campaign-placeholder-inner">
              <p className="eyebrow campaign-placeholder-heading"><span>The Lagos Edit</span><span>Lagos, NG</span></p>
              <span className="campaign-number">01</span>
              <p className="eyebrow section-eyebrow placeholder-note">Campaign photo to come</p>
            </div>
          </div>
        )}
      </section>
      <div className="values-band">
        <ul className="shell values-list">
          <li>Inspired by Lagos</li>
          <li>Black &amp; white essentials</li>
          <li>Made to be lived in</li>
        </ul>
      </div>
    </>
  );
}

function ProductCard({ product, onSelect }) {
  const photo = uploadedMedia(product.id);
  return (
    <article className="product-card">
      <div className="product-visual">
        {photo ? (
          <img src={photo} alt={product.imageAlt} width="1280" height="853" loading="lazy" decoding="async" />
        ) : <span className="eyebrow product-photo-placeholder" aria-hidden="true">Photo to come</span>}
      </div>
      <div className="product-info">
        <h3>
          <button type="button" className="product-open" aria-haspopup="dialog"
            onClick={() => onSelect(product.id)}>{product.name}</button>
        </h3>
        <div className="product-meta-line">
          <p className="product-meta">{product.trim} trim</p>
          <div className="product-actions">
            <p className="product-price">{formatPrice(product.price)}</p>
            <span className="product-plus" aria-hidden="true"><Icon name="plus" /></span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Collection({ onSelect }) {
  const [filter, setFilter] = useState('all');
  const visibleProducts = filterProducts(filter);

  return (
    <section className="shell collection" id="shop" aria-labelledby="collection-title">
      <div className="collection-head">
        <div>
          <p className="eyebrow section-eyebrow">01 / The collection</p>
          <h2 className="section-title" id="collection-title">The Lagos Edit</h2>
        </div>
        <div className="filters" role="group" aria-label="Filter the collection">
          {FILTERS.map(({ id, name }) => (
            <button key={id} type="button" className="filter-button" aria-pressed={filter === id}
              onClick={() => setFilter(id)}>{name}</button>
          ))}
        </div>
      </div>
      <p className="sr-only" role="status">{visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'} shown.</p>
      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelect} />)}
      </div>
    </section>
  );
}

function Story({ onRead }) {
  const photo = uploadedMedia('atelier');
  return (
    <section className="shell story" id="story" aria-labelledby="story-title">
      {photo ? (
        <figure className="story-photo">
          <img src={photo} loading="lazy" decoding="async" alt="The Gidi Heritage Clothing atelier" />
          <figcaption className="photo-label"><span>02</span><span className="photo-label-line" /> In the atelier</figcaption>
        </figure>
      ) : (
        <div className="story-placeholder" aria-hidden="true">
          <p className="eyebrow">From the atelier</p>
          <p className="section-title">Black.<br /><em>White.</em></p>
          <p className="eyebrow section-eyebrow placeholder-note">Atelier photo to come</p>
        </div>
      )}
      <div className="story-copy">
        <div className="story-content">
          <p className="eyebrow section-eyebrow">02 / Our story</p>
          <h2 className="section-title" id="story-title">Good cloth.<br /><em>Deep roots.</em></h2>
          <p>Gidi is a love letter to Lagos: its pace, its warmth, and the care that goes into an everyday wardrobe. The Lagos Edit pairs two familiar silhouettes with contrast trim and the GH chest mark.</p>
          <button type="button" className="text-link" aria-haspopup="dialog" onClick={onRead}>About the collection <Icon name="arrow" /></button>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  function submit(event) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubscribed(true);
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="shell newsletter-inner">
        <div>
          <p className="eyebrow section-eyebrow">Letters from Lagos</p>
          <h2 className="section-title" id="newsletter-title">A little more Gidi.</h2>
        </div>
        <form className="newsletter-form" onSubmit={submit}>
          <label htmlFor="newsletter-email">Notes on cloth, craft, and what’s next.</label>
          <div className="newsletter-fields">
            <input id="newsletter-email" name="email" type="email" autoComplete="email" required
              placeholder="Your email address" aria-describedby="newsletter-note" onChange={() => setSubscribed(false)} />
            <button type="submit" className="button button-dark">Join the list <Icon name="arrow" /></button>
          </div>
          <p className="newsletter-note" id="newsletter-note" role="status">
            {subscribed ? 'Thanks for trying the signup. No email was saved or sent.' : 'Newsletter preview. No email is saved or sent.'}
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer({ onSizeGuide }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-main">
          <div className="footer-identity">
            <BrandLink />
            <p>Nigerian by nature. Made to be lived in.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <p className="eyebrow">Explore</p>
            <a href="#shop">Shop the collection</a>
            <a href="#story">Our story</a>
            <button type="button" aria-haspopup="dialog" onClick={onSizeGuide}>Size guide</button>
          </nav>
          <div className="footer-location">
            <p className="eyebrow">From the city of Lagos</p>
            <p className="footer-city">Lagos, Nigeria</p>
            <p className="footer-coordinates">6.5244° N &nbsp; 3.3792° E</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Gidi Heritage Clothing.</p>
          <a href="#top">Back to top <Icon name="up" /></a>
        </div>
      </div>
    </footer>
  );
}

function loadBag() {
  try {
    return parseBag(window.localStorage.getItem(BAG_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function App() {
  const [bag, setBag] = useState(loadBag);
  const [panel, setPanel] = useState(null);
  const totals = summarizeBag(bag);

  useEffect(() => {
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(bag));
    } catch {
      // Browsers that block local storage can still use the bag in this session.
    }
  }, [bag]);

  function openProduct(id) {
    setPanel({ kind: 'product', id });
  }

  function addToBag(id, size) {
    setBag((current) => updateBag(current, id, size, 1));
    setPanel({ kind: 'bag', added: true });
  }

  function changeQuantity(id, size, delta) {
    setBag((current) => updateBag(current, id, size, delta));
    setPanel((current) => current?.kind === 'bag' && current.added ? { kind: 'bag' } : current);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header count={totals.count} onOpen={setPanel} />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <Collection onSelect={openProduct} />
        <Story onRead={() => setPanel({ kind: 'collection-story' })} />
        <Newsletter />
      </main>
      <Footer onSizeGuide={() => setPanel({ kind: 'size-guide' })} />
      <StoreDialog panel={panel} onOpen={setPanel} onClose={() => setPanel(null)}
        bag={bag} totals={totals} onAdd={addToBag} onChangeQuantity={changeQuantity} onSelect={openProduct} />
    </>
  );
}
