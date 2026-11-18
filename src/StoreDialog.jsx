import { useLayoutEffect, useRef, useState } from 'react';
import { MAX_QUANTITY } from './bag.js';
import { acceptsSize, formatPrice, getProduct, searchProducts } from './catalog.js';
import { Icon } from './Icons.jsx';
import { uploadedMedia } from './media.js';

const TITLE_ID = 'store-dialog-title';

function PanelTitle({ children, eyebrow }) {
  return (
    <div className="panel-heading">
      {eyebrow && <p className="eyebrow section-eyebrow">{eyebrow}</p>}
      <h2 className="panel-title" id={TITLE_ID} tabIndex={-1} data-dialog-focus>{children}</h2>
    </div>
  );
}

function ProductDetail({ product, photo, bag, onAdd }) {
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : null);
  const atLimit = bag.some((line) => line.id === product.id && line.size === size && line.quantity >= MAX_QUANTITY);

  function submit(event) {
    event.preventDefault();
    if (acceptsSize(product, size) && !atLimit) onAdd(product.id, size);
  }

  return (
    <div className="product-detail">
      {photo && (
        <div className="detail-photo">
          <img src={photo} alt={product.imageAlt} width="1280" height="853" />
        </div>
      )}
      <div className="detail-copy">
        <PanelTitle eyebrow={`${product.category} / The Lagos Edit`}>{product.name}</PanelTitle>
        <p className="detail-price">{formatPrice(product.price)}</p>
        <p className="detail-description">{product.description}</p>
        <p className="detail-colour"><span className="colour-swatch" style={{ backgroundColor: product.swatch }} />{product.color} / {product.trim} trim</p>
        <form onSubmit={submit}>
          {product.sizes.length > 1 ? (
            <fieldset className="size-fieldset">
              <legend>Size</legend>
              <div className="size-options">
                {product.sizes.map((option) => (
                  <label key={option} className="size-option">
                    <input type="radio" name="size" value={option} checked={size === option} required
                      onChange={() => setSize(option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : product.sizes.length === 1 ? (
            <p className="single-size">{size === 'One size' ? size : `Size ${size}`}</p>
          ) : <p className="quiet-text detail-sizing-note">Size information hasn’t been added yet.</p>}
          <button type="submit" className="button button-dark full-button" disabled={atLimit}>
            {atLimit ? 'Quantity limit reached' : 'Add to bag'} <Icon name="bag" />
          </button>
        </form>
        {(product.material || product.care) && (
          <details className="detail-care">
            <summary>Fabric &amp; care <Icon className="care-plus" name="plus" /><Icon className="care-minus" name="minus" /></summary>
            <p>{product.material && <strong>{product.material}. </strong>}{product.care}</p>
          </details>
        )}
      </div>
    </div>
  );
}

function Search({ onSelect }) {
  const [query, setQuery] = useState('');
  const results = searchProducts(query);

  return (
    <div className="content-panel search-panel">
      <div className="panel-heading">
        <p className="eyebrow section-eyebrow">The Lagos Edit</p>
        <h2 className="panel-title" id={TITLE_ID}>Find a piece</h2>
      </div>
      <div className="search-box">
        <Icon name="search" />
        <label className="sr-only" htmlFor="store-search">Search the collection</label>
        <input data-dialog-focus id="store-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          placeholder="Try ‘tank top’ or ‘black tee’" autoComplete="off" />
      </div>
      <p className="search-count" role="status">
        {query.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Browse all pieces'}
      </p>
      {results.length ? (
        <ul className="search-results">
          {results.map((product) => {
            const photo = uploadedMedia(product.id);
            return (
              <li key={product.id}>
                <button type="button" className="search-result" data-has-photo={photo ? '' : undefined}
                  onClick={() => onSelect(product.id)}>
                  {photo && <img src={photo} alt="" />}
                  <span className="search-result-info"><span>{product.name}</span><small>{product.color}</small></span>
                  <span className="search-result-price">{formatPrice(product.price)}</span>
                  <Icon name="arrow" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : <p className="quiet-text">No pieces match your search. Try a product name, style, or colour.</p>}
    </div>
  );
}

function BagLine({ line, onChange }) {
  const product = getProduct(line.id);
  const photo = uploadedMedia(product.id);
  const lineName = line.size ? `${product.name}, ${line.size}` : product.name;
  const sizeLabel = line.size === 'One size' || !line.size ? line.size : `Size ${line.size}`;

  return (
    <li className="bag-line" data-has-photo={photo ? '' : undefined}>
      {photo && <img src={photo} alt="" />}
      <div className="bag-line-info">
        <div className="bag-line-heading">
          <h3>{product.name}</h3>
          <span>{formatPrice(product.price * line.quantity)}</span>
        </div>
        <p className="quiet-text">{product.trim} trim{sizeLabel && <> <span aria-hidden="true">·</span> {sizeLabel}</>}</p>
        <div className="bag-line-actions">
          <div className="quantity" role="group" aria-label={`Quantity for ${lineName}`}>
            <button type="button" aria-label={`Decrease quantity of ${lineName}`} disabled={line.quantity <= 1}
              onClick={() => onChange(line.id, line.size, -1)}><Icon name="minus" /></button>
            <span aria-live="polite">{line.quantity}</span>
            <button type="button" aria-label={`Increase quantity of ${lineName}`} disabled={line.quantity >= MAX_QUANTITY}
              onClick={() => onChange(line.id, line.size, 1)}><Icon name="plus" /></button>
          </div>
          <button type="button" className="remove-line" aria-label={`Remove ${lineName}`}
            onClick={() => onChange(line.id, line.size, -line.quantity)}>Remove</button>
        </div>
      </div>
    </li>
  );
}

function Bag({ bag, totals, added, onChange, onClose, onReview }) {
  return (
    <div className="bag-panel">
      <PanelTitle>Your bag <span className="panel-count">({totals.count})</span></PanelTitle>
      {bag.length ? (
        <>
          <div className="bag-items">
            {added && <p className="bag-feedback" role="status"><Icon name="check" /> Added to your bag</p>}
            <ul className="bag-lines">
              {bag.map((line) => <BagLine key={`${line.id}-${line.size}`} line={line} onChange={onChange} />)}
            </ul>
          </div>
          <div className="bag-summary">
            <p className="subtotal"><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></p>
            <p className="quiet-text">All prices in Nigerian naira.</p>
            <button type="button" className="button button-dark full-button" onClick={onReview}>Review order <Icon name="arrow" /></button>
            <a href="#shop" className="continue-link" onClick={onClose}>Keep browsing</a>
          </div>
        </>
      ) : (
        <div className="bag-empty">
          <span className="empty-bag-icon"><Icon name="bag" /></span>
          <p>Your bag is empty.</p>
          <a href="#shop" className="button button-dark" onClick={onClose}>Explore the collection <Icon name="arrow" /></a>
        </div>
      )}
    </div>
  );
}

function OrderReview({ bag, totals, onBack }) {
  return (
    <div className="content-panel review-panel">
      <PanelTitle eyebrow="The Lagos Edit">Order review</PanelTitle>
      <p className="preview-notice"><strong>Storefront preview.</strong> Checkout is not connected. No order will be placed and no payment will be taken.</p>
      <ul className="review-lines">
        {bag.map((line) => {
          const product = getProduct(line.id);
          return (
            <li key={`${line.id}-${line.size}`}>
              <div>
                <strong>{product.name}</strong>
                <small>{line.size && <>{line.size} <span aria-hidden="true">·</span> </>}Qty {line.quantity}</small>
              </div>
              <span>{formatPrice(product.price * line.quantity)}</span>
            </li>
          );
        })}
      </ul>
      <p className="subtotal"><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></p>
      <button type="button" className="text-link back-link" onClick={onBack}><Icon name="left" /> Back to your bag</button>
    </div>
  );
}

function SizeGuide() {
  return (
    <div className="content-panel prose-panel">
      <PanelTitle eyebrow="The fit">Size guide</PanelTitle>
      <p>The size chart for The Lagos Edit hasn’t been published yet.</p>
      <p>To prepare for a fit check, lay a top you already own flat. Measure across the chest from armpit to armpit and from the highest shoulder point to the hem.</p>
    </div>
  );
}

function CollectionStory() {
  return (
    <div className="content-panel prose-panel">
      <PanelTitle eyebrow="Drop 01">About the collection</PanelTitle>
      <p>Two everyday silhouettes, each in black and white. Every piece pairs contrast trim with the GH chest mark and a plain back.</p>
      <h3>The tank top</h3>
      <p>A sleeveless cut with contrast trim around the neckline and armholes.</p>
      <h3>The ringer tee</h3>
      <p>A short-sleeve crew neck with a contrast collar and cuffs.</p>
    </div>
  );
}

function MobileMenu({ onClose, onSizeGuide }) {
  return (
    <div className="menu-panel">
      <PanelTitle eyebrow="Gidi Heritage Clothing">Explore</PanelTitle>
      <nav aria-label="Mobile navigation">
        <a href="#shop" onClick={onClose}>Shop <Icon name="arrow" /></a>
        <a href="#story" onClick={onClose}>Our Story <Icon name="arrow" /></a>
        <button type="button" onClick={onSizeGuide}>Size Guide <Icon name="arrow" /></button>
      </nav>
      <p className="eyebrow">Lagos, Nigeria</p>
    </div>
  );
}

export function StoreDialog({ panel, onOpen, onClose, bag, totals, onAdd, onChangeQuantity, onSelect }) {
  const dialogRef = useRef(null);
  const pressedBackdrop = useRef(false);
  const kind = panel?.kind;
  const activeProduct = kind === 'product' ? getProduct(panel.id) : null;
  const activeProductId = activeProduct?.id;
  const productPhoto = activeProduct ? uploadedMedia(activeProduct.id) : null;

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!kind) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    (dialog.querySelector('[data-dialog-focus]') ?? dialog.querySelector('.dialog-close'))?.focus({ preventScroll: true });
  }, [kind, activeProductId]);

  return (
    <dialog className="store-dialog" ref={dialogRef} data-panel={kind} data-has-photo={productPhoto ? '' : undefined}
      aria-labelledby={kind ? TITLE_ID : undefined}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        // The native search field would otherwise clear its value on the first Escape.
        if (kind === 'search' && event.key === 'Escape' && !event.nativeEvent.isComposing) {
          event.preventDefault();
          onClose();
        }
      }}
      onPointerDown={(event) => { pressedBackdrop.current = event.target === event.currentTarget; }}
      onClick={(event) => { if (pressedBackdrop.current && event.target === event.currentTarget) onClose(); }}>
      {panel && (
        <div className="dialog-surface">
          <button className="icon-button dialog-close" type="button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button>
          {activeProduct && <ProductDetail key={activeProduct.id} product={activeProduct} photo={productPhoto} bag={bag} onAdd={onAdd} />}
          {kind === 'search' && <Search onSelect={onSelect} />}
          {kind === 'bag' && <Bag bag={bag} totals={totals} added={panel.added} onChange={onChangeQuantity}
            onClose={onClose} onReview={() => onOpen({ kind: 'review' })} />}
          {kind === 'review' && <OrderReview bag={bag} totals={totals} onBack={() => onOpen({ kind: 'bag' })} />}
          {kind === 'size-guide' && <SizeGuide />}
          {kind === 'collection-story' && <CollectionStory />}
          {kind === 'menu' && <MobileMenu onClose={onClose} onSizeGuide={() => onOpen({ kind: 'size-guide' })} />}
        </div>
      )}
    </dialog>
  );
}
