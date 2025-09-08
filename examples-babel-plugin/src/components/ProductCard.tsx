import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    alert(
      `${product.name} ${isWishlisted ? "removed from" : "added to"} wishlist!`
    );
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  return (
    <article className="product-card">
      <header className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <div className="price-badge">
          <span className="currency">$</span>
          <span className="amount">{product.price}</span>
        </div>
      </header>

      <div className="product-body">
        <p className="product-description">{product.description}</p>

        <div className="stock-status">
          <span
            className={`status-indicator ${
              product.inStock ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
          </span>
        </div>

        {product.inStock && (
          <div className="quantity-selector">
            <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
            <select
              id={`quantity-${product.id}`}
              value={quantity}
              onChange={handleQuantityChange}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <footer className="product-actions">
        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        <button
          className={`btn ${isWishlisted ? "btn-danger" : "btn-secondary"}`}
          onClick={handleWishlist}
        >
          {isWishlisted ? "❤️ Remove" : "🤍 Wishlist"}
        </button>
      </footer>
    </article>
  );
}
