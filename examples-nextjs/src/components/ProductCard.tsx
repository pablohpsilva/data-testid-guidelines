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
  const handleAddToCart = () => {
    if (product.inStock) {
      alert(`Added ${product.name} to cart`);
    } else {
      alert("Product is out of stock");
    }
  };

  const handleWishlist = () => {
    alert(`Added ${product.name} to wishlist`);
  };

  return (
    <article className="card">
      <header style={{ marginBottom: "1rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#007bff" }}
          >
            ${product.price.toFixed(2)}
          </span>
          <span
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.8rem",
              background: product.inStock ? "#e8f5e8" : "#ffebee",
              color: product.inStock ? "#2e7d32" : "#c62828",
            }}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </header>

      <main style={{ marginBottom: "1rem" }}>
        <p style={{ color: "#666", lineHeight: "1.4" }}>
          {product.description}
        </p>
      </main>

      <footer style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={handleAddToCart}
          className={`btn ${product.inStock ? "btn-primary" : "btn-secondary"}`}
          disabled={!product.inStock}
          style={{
            opacity: product.inStock ? 1 : 0.6,
            cursor: product.inStock ? "pointer" : "not-allowed",
          }}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
        <button onClick={handleWishlist} className="btn btn-secondary">
          ♡ Wishlist
        </button>
      </footer>
    </article>
  );
}
