import { describe, it, expect } from "vitest";
import { TestIdTransformer } from "../transformer";

describe("Real-world Application Tests", () => {
  const transformer = new TestIdTransformer({
    enabled: true,
    separator: ".",
    includeElement: true,
    useHierarchy: true,
    skipElements: ["br", "hr", "img", "svg"],
    onlyInteractive: false,
  });

  describe("E-commerce Application", () => {
    it("should handle complete e-commerce product page", () => {
      const input = `
export function ProductPage({ product, relatedProducts, reviews }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><span>{product.category}</span></li>
          <li><span>{product.name}</span></li>
        </ul>
      </nav>
      
      <main>
        <section>
          <div>
            <div>
              <h1>{product.name}</h1>
              <div>
                <span>\${selectedVariant.price}</span>
                <span>{product.rating}/5 stars</span>
              </div>
            </div>
            
            <div>
              <h3>Options</h3>
              <div>
                <label>Size</label>
                <select 
                  value={selectedVariant.size}
                  onChange={(e) => selectVariant('size', e.target.value)}
                >
                  {product.variants.map((variant, variantIndex) => (
                    <option key={variant.id} value={variant.size}>
                      {variant.size}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label>Quantity</label>
                <div>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <button onClick={() => setQuantity(q => q + 1)}>
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <button 
                  onClick={() => addToCart(selectedVariant.id, quantity)}
                  disabled={!selectedVariant.inStock}
                >
                  Add to Cart (\${(selectedVariant.price * quantity).toFixed(2)})
                </button>
                <button onClick={() => addToWishlist(product.id)}>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <div>
            <nav>
              <ul>
                <li>
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={activeTab === 'description' ? 'active' : ''}
                  >
                    Description
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={activeTab === 'reviews' ? 'active' : ''}
                  >
                    Reviews ({reviews.length})
                  </button>
                </li>
              </ul>
            </nav>
            
            <div>
              {activeTab === 'description' && (
                <div>
                  <p>{product.description}</p>
                  <ul>
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div>
                    <h3>Customer Reviews</h3>
                    <div>
                      <span>Average: {product.rating}/5</span>
                      <span>({reviews.length} reviews)</span>
                    </div>
                  </div>
                  <div>
                    {reviews.map((review, reviewIndex) => (
                      <article key={review.id}>
                        <header>
                          <div>
                            <span>{review.author}</span>
                            <span>{review.rating}/5</span>
                          </div>
                          <time>{review.date}</time>
                        </header>
                        <div>
                          <p>{review.comment}</p>
                          <div>
                            <button onClick={() => likeReview(review.id)}>
                              Like ({review.likes})
                            </button>
                            <button onClick={() => reportReview(review.id)}>
                              Report
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <aside>
          <h3>Related Products</h3>
          <div>
            {relatedProducts.map((relatedProduct, relatedIndex) => (
              <div key={relatedProduct.id}>
                <div>
                  <h4>{relatedProduct.name}</h4>
                  <span>\${relatedProduct.price}</span>
                </div>
                <div>
                  <button onClick={() => viewProduct(relatedProduct.id)}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}`;

      const result = transformer.transform(input, "ProductPage.tsx");

      // Check main navigation
      expect(result).toContain('data-testid="ProductPage.div"');
      expect(result).toContain('data-testid="ProductPage.div.nav"');
      expect(result).toContain('data-testid="ProductPage.nav.ul"');
      expect(result).toContain('data-testid="ProductPage.ul.li"');
      expect(result).toContain('data-testid="ProductPage.li.a"');
      expect(result).toContain('data-testid="ProductPage.li.span"');

      // Check product details section
      expect(result).toContain('data-testid="ProductPage.div.main"');
      expect(result).toContain('data-testid="ProductPage.main.section"');
      expect(result).toContain('data-testid="ProductPage.section.div"');
      expect(result).toContain('data-testid="ProductPage.div.h1"');

      // Check options section
      expect(result).toContain('data-testid="ProductPage.div.h3"');
      expect(result).toContain('data-testid="ProductPage.div.label"');
      expect(result).toContain('data-testid="ProductPage.div.select"');

      // Check variant loop
      expect(result).toContain(
        "data-testid={`ProductPage.select.option.${variantIndex}`}"
      );

      // Check quantity controls
      expect(result).toContain('data-testid="ProductPage.div.input"');
      expect(result).toContain('data-testid="ProductPage.div.button"');

      // Check tabs section
      expect(result).toContain('data-testid="ProductPage.main.section"');
      expect(result).toContain('data-testid="ProductPage.section.nav"');
      expect(result).toContain('data-testid="ProductPage.nav.ul"');

      // Check reviews loop
      expect(result).toContain(
        "data-testid={`ProductPage.div.article.${reviewIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductPage.article.header.${reviewIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductPage.header.div.${reviewIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductPage.div.span.${reviewIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductPage.header.time.${reviewIndex}`}"
      );

      // Check related products
      expect(result).toContain('data-testid="ProductPage.main.aside"');
      expect(result).toContain('data-testid="ProductPage.aside.h3"');
      expect(result).toContain('data-testid="ProductPage.aside.div"');
      expect(result).toContain(
        "data-testid={`ProductPage.div.div.${relatedIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductPage.div.h4.${relatedIndex}`}"
      );

      // Should preserve all complex expressions
      expect(result).toContain("setQuantity(q => Math.max(1, q - 1))");
      expect(result).toContain("parseInt(e.target.value) || 1");
      expect(result).toContain("(selectedVariant.price * quantity).toFixed(2)");
      expect(result).toContain("activeTab === 'description'");
      expect(result).toContain("!selectedVariant.inStock");
    });
  });

  describe("Advanced Loop Patterns", () => {
    it("should handle nested maps with different index variables", () => {
      const input = `
export function NestedMaps() {
  const sections = [
    { 
      id: 'section1', 
      groups: [
        { id: 'group1', items: [{ id: 'item1', name: 'A' }] }
      ] 
    }
  ];

  return (
    <div>
      {sections.map((section, sectionIdx) => (
        <section key={section.id}>
          <h2>Section {sectionIdx}</h2>
          <div>
            {section.groups.map((group, groupIdx) => (
              <div key={group.id}>
                <h3>Group {groupIdx}</h3>
                <ul>
                  {group.items.map((item, itemIdx) => (
                    <li key={item.id}>
                      <span>Item {itemIdx}: {item.name}</span>
                      <button onClick={() => edit(item.id, groupIdx, sectionIdx)}>
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}`;

      const result = transformer.transform(input, "NestedMaps.tsx");

      // Check outer loop
      expect(result).toContain(
        "data-testid={`NestedMaps.div.section.${sectionIdx}`}"
      );
      expect(result).toContain(
        "data-testid={`NestedMaps.section.h2.${sectionIdx}`}"
      );
      expect(result).toContain(
        "data-testid={`NestedMaps.section.div.${sectionIdx}`}"
      );

      // Check middle loop
      expect(result).toContain(
        "data-testid={`NestedMaps.div.div.${groupIdx}`}"
      );
      expect(result).toContain("data-testid={`NestedMaps.div.h3.${groupIdx}`}");
      expect(result).toContain("data-testid={`NestedMaps.div.ul.${groupIdx}`}");

      // Check inner loop
      expect(result).toContain("data-testid={`NestedMaps.ul.li.${itemIdx}`}");
      expect(result).toContain("data-testid={`NestedMaps.li.span.${itemIdx}`}");

      // Should preserve complex function calls
      expect(result).toContain("edit(item.id, groupIdx, sectionIdx)");
    });
  });
});
