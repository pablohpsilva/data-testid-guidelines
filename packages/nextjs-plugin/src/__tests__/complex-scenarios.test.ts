import { describe, it, expect } from "vitest";
import { TestIdTransformer } from "../transformer";

describe("Complex Scenarios Tests", () => {
  const transformer = new TestIdTransformer({
    enabled: true,
    separator: ".",
    includeElement: true,
    useHierarchy: true,
    skipElements: ["br", "hr", "img", "svg"],
    onlyInteractive: false,
  });

  describe("Nested Loops and Complex Hierarchies", () => {
    it("should handle nested loops with proper indexing", () => {
      const input = `
export function NestedTable() {
  const sections = [
    { id: "users", rows: [{ id: "user1", name: "John" }, { id: "user2", name: "Jane" }] },
    { id: "products", rows: [{ id: "prod1", name: "Widget" }] }
  ];

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Section</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, sectionIndex) => (
            <tr key={section.id}>
              <td>{section.id}</td>
              <td>
                <ul>
                  {section.rows.map((row, rowIndex) => (
                    <li key={row.id}>
                      <span>{row.name}</span>
                      <button onClick={() => edit(row.id)}>Edit</button>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;

      const result = transformer.transform(input, "NestedTable.tsx");

      // Check hierarchical structure
      expect(result).toContain('data-testid="NestedTable.div"');
      expect(result).toContain('data-testid="NestedTable.div.table"');
      expect(result).toContain('data-testid="NestedTable.table.thead"');
      expect(result).toContain('data-testid="NestedTable.thead.tr"');
      expect(result).toContain('data-testid="NestedTable.tr.th"');
      expect(result).toContain('data-testid="NestedTable.table.tbody"');

      // Check loop indexing for outer loop
      expect(result).toContain(
        "data-testid={`NestedTable.tbody.tr.${section.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`NestedTable.tr.td.${section.id || 'item'}`}"
      );

      // Check nested loop indexing
      expect(result).toContain(
        "data-testid={`NestedTable.td.ul.${section.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`NestedTable.ul.li.${row.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`NestedTable.li.span.${row.id || 'item'}`}"
      );
    });

    it("should handle deeply nested component structure", () => {
      const input = `
export function Dashboard() {
  return (
    <main>
      <header>
        <nav>
          <div>
            <ul>
              <li>
                <a href="/">
                  <span>Home</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <section>
        <article>
          <h1>Title</h1>
          <p>Content</p>
        </article>
      </section>
      <footer>
        <div>
          <p>Copyright 2024</p>
        </div>
      </footer>
    </main>
  );
}`;

      const result = transformer.transform(input, "Dashboard.tsx");

      // Check deep hierarchy
      expect(result).toContain('data-testid="Dashboard.main"');
      expect(result).toContain('data-testid="Dashboard.main.header"');
      expect(result).toContain('data-testid="Dashboard.header.nav"');
      expect(result).toContain('data-testid="Dashboard.nav.div"');
      expect(result).toContain('data-testid="Dashboard.div.ul"');
      expect(result).toContain('data-testid="Dashboard.ul.li"');
      expect(result).toContain('data-testid="Dashboard.li.a"');
      expect(result).toContain('data-testid="Dashboard.a.span"');

      // Check parallel sections
      expect(result).toContain('data-testid="Dashboard.main.section"');
      expect(result).toContain('data-testid="Dashboard.section.article"');
      expect(result).toContain('data-testid="Dashboard.article.h1"');
      expect(result).toContain('data-testid="Dashboard.article.p"');

      expect(result).toContain('data-testid="Dashboard.main.footer"');
      expect(result).toContain('data-testid="Dashboard.footer.div"');
      expect(result).toContain('data-testid="Dashboard.div.p"');
    });
  });

  describe("Complex Loop Scenarios", () => {
    it("should handle different loop types with various index patterns", () => {
      const input = `
export function ComplexLoops() {
  const items = ["a", "b", "c"];
  const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
  const products = [{ sku: "P1", title: "Widget" }];

  return (
    <div>
      <section>
        <h2>Map with index</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h2>Map without index</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <span>{user.name}</span>
              <button onClick={() => delete(user.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h2>ForEach pattern</h2>
        <div>
          {products.forEach((product, idx) => (
            <article key={product.sku}>
              <h3>{product.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}`;

      const result = transformer.transform(input, "ComplexLoops.tsx");

      // Check different loop types
      expect(result).toContain('data-testid="ComplexLoops.div"');
      expect(result).toContain('data-testid="ComplexLoops.div.section"');
      expect(result).toContain('data-testid="ComplexLoops.section.h2"');
      expect(result).toContain('data-testid="ComplexLoops.section.ul"');

      // Check map with index
      expect(result).toContain("data-testid={`ComplexLoops.ul.li.${index}`}");
      expect(result).toContain("data-testid={`ComplexLoops.li.span.${index}`}");

      // Check map without index (should use user.id)
      expect(result).toContain(
        "data-testid={`ComplexLoops.ul.li.${user.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`ComplexLoops.li.span.${user.id || 'item'}`}"
      );

      // Check forEach pattern
      expect(result).toContain('data-testid="ComplexLoops.section.div"');
      expect(result).toContain(
        "data-testid={`ComplexLoops.div.article.${idx}`}"
      );
    });

    it("should handle complex conditional rendering with loops", () => {
      const input = `
export function ConditionalList({ showUsers, showProducts }) {
  const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }];
  const products = [{ id: 1, name: "Widget" }];

  return (
    <div>
      {showUsers && (
        <section>
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <div>
                  <span>{user.name}</span>
                  {user.isAdmin && <span>Admin</span>}
                  <button>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      
      {showProducts && (
        <section>
          <h2>Products</h2>
          <div>
            {products.map((product, index) => (
              <article key={product.id}>
                <h3>{product.name}</h3>
                <p>Product {index + 1}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}`;

      const result = transformer.transform(input, "ConditionalList.tsx");

      // Check conditional sections
      expect(result).toContain('data-testid="ConditionalList.div"');
      expect(result).toContain('data-testid="ConditionalList.section"');
      expect(result).toContain('data-testid="ConditionalList.section.h2"');
      expect(result).toContain('data-testid="ConditionalList.section.ul"');

      // Check loop elements with conditions
      expect(result).toContain(
        "data-testid={`ConditionalList.ul.li.${user.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`ConditionalList.li.div.${user.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`ConditionalList.div.span.${user.id || 'item'}`}"
      );

      // Check products section
      expect(result).toContain('data-testid="ConditionalList.section.div"');
      expect(result).toContain(
        "data-testid={`ConditionalList.div.article.${index}`}"
      );
      expect(result).toContain(
        "data-testid={`ConditionalList.article.h3.${index}`}"
      );
    });
  });

  describe("Edge Cases and Complex Attributes", () => {
    it("should handle elements with complex template literal classNames", () => {
      const input = `
export function StyledComponent({ isActive, theme }) {
  return (
    <div>
      <button
        className={\`
          base-button transition-all duration-200
          \${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
          \${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
        \`}
        onClick={() => {
          console.log('Complex click handler');
          handleClick();
        }}
        style={{
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
          boxShadow: theme === 'dark' ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Click Me
      </button>
    </div>
  );
}`;

      const result = transformer.transform(input, "StyledComponent.tsx");

      // Should handle complex elements safely
      expect(result).toContain('data-testid="StyledComponent.div"');

      // Button should get test ID despite complex attributes
      const hasButtonTestId =
        result.includes("<button") && result.includes("data-testid");
      expect(hasButtonTestId).toBe(true);

      // Should preserve complex template literals
      expect(result).toContain("${isActive ?");
      expect(result).toContain("${theme ===");
      expect(result).toContain("handleClick()");
      expect(result).toContain("boxShadow:");

      // Should not break any syntax
      expect(result).not.toContain("onClick={() = data-testid=");
      expect(result).not.toContain("className=data-testid");
    });

    it("should handle React fragments and multiple root elements", () => {
      const input = `
export function FragmentComponent() {
  const items = ["a", "b"];
  
  return (
    <>
      <header>
        <h1>Title</h1>
      </header>
      <main>
        <section>
          <ul>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <li>
                  <span>{item}</span>
                </li>
                <li>
                  <button>Action {index}</button>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </section>
      </main>
      <footer>
        <p>Footer content</p>
      </footer>
    </>
  );
}`;

      const result = transformer.transform(input, "FragmentComponent.tsx");

      // Check fragment handling
      expect(result).toContain('data-testid="FragmentComponent.header"');
      expect(result).toContain('data-testid="FragmentComponent.header.h1"');
      expect(result).toContain('data-testid="FragmentComponent.main"');
      expect(result).toContain('data-testid="FragmentComponent.main.section"');
      expect(result).toContain('data-testid="FragmentComponent.section.ul"');

      // Check loop elements in fragments
      expect(result).toContain(
        "data-testid={`FragmentComponent.ul.li.${index}`}"
      );
      expect(result).toContain(
        "data-testid={`FragmentComponent.li.span.${index}`}"
      );

      expect(result).toContain('data-testid="FragmentComponent.footer"');
      expect(result).toContain('data-testid="FragmentComponent.footer.p"');
    });

    it("should handle form elements with complex validation", () => {
      const input = `
export function ComplexForm({ onSubmit, errors }) {
  const fields = [
    { name: "email", type: "email", required: true },
    { name: "password", type: "password", required: true },
    { name: "confirmPassword", type: "password", required: true }
  ];

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>User Registration</legend>
        <div>
          {fields.map((field, index) => (
            <div key={field.name}>
              <label htmlFor={field.name}>
                {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                {field.required && <span>*</span>}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                className={\`
                  form-input
                  \${errors[field.name] ? 'border-red-500' : 'border-gray-300'}
                \`}
                onChange={(e) => validateField(field.name, e.target.value)}
              />
              {errors[field.name] && (
                <span className="error-message">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
        </div>
        <div>
          <button type="submit" disabled={Object.keys(errors).length > 0}>
            Register
          </button>
          <button type="button" onClick={() => resetForm()}>
            Reset
          </button>
        </div>
      </fieldset>
    </form>
  );
}`;

      const result = transformer.transform(input, "ComplexForm.tsx");

      // Check form structure
      expect(result).toContain('data-testid="ComplexForm.form"');
      expect(result).toContain('data-testid="ComplexForm.form.fieldset"');
      expect(result).toContain('data-testid="ComplexForm.fieldset.legend"');
      expect(result).toContain('data-testid="ComplexForm.fieldset.div"');

      // Check loop elements
      expect(result).toContain(
        "data-testid={`ComplexForm.div.div.${field.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`ComplexForm.div.label.${field.id || 'item'}`}"
      );
      expect(result).toContain(
        "data-testid={`ComplexForm.label.span.${field.id || 'item'}`}"
      );

      // Check form controls
      expect(result).toContain('data-testid="ComplexForm.div.button"');

      // Should preserve complex expressions
      expect(result).toContain("errors[field.name]");
      expect(result).toContain("validateField(field.name");
      expect(result).toContain("Object.keys(errors).length");
    });
  });

  describe("Performance and Large Components", () => {
    it("should handle large lists efficiently", () => {
      const input = `
export function LargeList() {
  const items = Array.from({ length: 1000 }, (_, i) => ({ 
    id: i, 
    name: \`Item \${i}\`,
    category: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C'
  }));

  return (
    <div>
      <header>
        <h1>Large List ({items.length} items)</h1>
      </header>
      <main>
        <section>
          <ul>
            {items.map((item, index) => (
              <li key={item.id}>
                <div>
                  <span>{item.name}</span>
                  <span>{item.category}</span>
                  <button onClick={() => select(item.id)}>Select</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}`;

      const startTime = Date.now();
      const result = transformer.transform(input, "LargeList.tsx");
      const endTime = Date.now();

      // Should complete in reasonable time (under 1 second)
      expect(endTime - startTime).toBeLessThan(1000);

      // Check structure is preserved
      expect(result).toContain('data-testid="LargeList.div"');
      expect(result).toContain('data-testid="LargeList.div.header"');
      expect(result).toContain('data-testid="LargeList.header.h1"');
      expect(result).toContain('data-testid="LargeList.div.main"');
      expect(result).toContain('data-testid="LargeList.main.section"');
      expect(result).toContain('data-testid="LargeList.section.ul"');

      // Check loop elements
      expect(result).toContain("data-testid={`LargeList.ul.li.${index}`}");
      expect(result).toContain("data-testid={`LargeList.li.div.${index}`}");
      expect(result).toContain("data-testid={`LargeList.div.span.${index}`}");
    });

    it("should handle components with many different element types", () => {
      const input = `
export function KitchenSink() {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section>
          <article>
            <h1>Article Title</h1>
            <h2>Subtitle</h2>
            <h3>Section</h3>
            <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
            <blockquote>
              <p>Quote text</p>
            </blockquote>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
            <ol>
              <li>Ordered item 1</li>
              <li>Ordered item 2</li>
            </ol>
          </article>
          
          <aside>
            <h3>Sidebar</h3>
            <form>
              <fieldset>
                <legend>Contact Form</legend>
                <div>
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" />
                </div>
                <div>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={4}></textarea>
                </div>
                <div>
                  <button type="submit">Send</button>
                  <button type="reset">Clear</button>
                </div>
              </fieldset>
            </form>
          </aside>
        </section>
      </main>
      
      <footer>
        <div>
          <p>&copy; 2024 Company Name</p>
          <nav>
            <ul>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}`;

      const result = transformer.transform(input, "KitchenSink.tsx");

      // Check all semantic elements
      const semanticElements = [
        "header",
        "nav",
        "main",
        "section",
        "article",
        "aside",
        "footer",
      ];

      semanticElements.forEach((element) => {
        expect(result).toContain(`data-testid="KitchenSink.${element}"`);
      });

      // Check form elements
      expect(result).toContain('data-testid="KitchenSink.aside.form"');
      expect(result).toContain('data-testid="KitchenSink.form.fieldset"');
      expect(result).toContain('data-testid="KitchenSink.fieldset.legend"');
      expect(result).toContain('data-testid="KitchenSink.fieldset.div"');
      expect(result).toContain('data-testid="KitchenSink.div.label"');
      expect(result).toContain('data-testid="KitchenSink.div.input"');
      expect(result).toContain('data-testid="KitchenSink.div.textarea"');
      expect(result).toContain('data-testid="KitchenSink.div.button"');

      // Check lists
      expect(result).toContain('data-testid="KitchenSink.nav.ul"');
      expect(result).toContain('data-testid="KitchenSink.ul.li"');
      expect(result).toContain('data-testid="KitchenSink.li.a"');

      expect(result).toContain('data-testid="KitchenSink.article.ol"');
      expect(result).toContain('data-testid="KitchenSink.ol.li"');

      // Check text elements
      expect(result).toContain('data-testid="KitchenSink.article.h1"');
      expect(result).toContain('data-testid="KitchenSink.article.h2"');
      expect(result).toContain('data-testid="KitchenSink.article.h3"');
      expect(result).toContain('data-testid="KitchenSink.article.p"');
      expect(result).toContain('data-testid="KitchenSink.p.strong"');
      expect(result).toContain('data-testid="KitchenSink.p.em"');
      expect(result).toContain('data-testid="KitchenSink.article.blockquote"');
    });

    it("should handle self-closing tags and void elements", () => {
      const input = `
export function MediaComponent() {
  const images = [
    { src: "image1.jpg", alt: "Image 1" },
    { src: "image2.jpg", alt: "Image 2" }
  ];

  return (
    <div>
      <header>
        <h1>Media Gallery</h1>
      </header>
      <main>
        <section>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image.src} alt={image.alt} />
              <br />
              <hr />
              <input type="text" placeholder="Caption" />
              <textarea placeholder="Description"></textarea>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}`;

      const result = transformer.transform(input, "MediaComponent.tsx");

      // Check structure
      expect(result).toContain('data-testid="MediaComponent.div"');
      expect(result).toContain('data-testid="MediaComponent.div.header"');
      expect(result).toContain('data-testid="MediaComponent.header.h1"');
      expect(result).toContain('data-testid="MediaComponent.div.main"');
      expect(result).toContain('data-testid="MediaComponent.main.section"');

      // Check loop elements
      expect(result).toContain(
        "data-testid={`MediaComponent.section.div.${index}`}"
      );
      expect(result).toContain(
        "data-testid={`MediaComponent.div.input.${index}`}"
      );
      expect(result).toContain(
        "data-testid={`MediaComponent.div.textarea.${index}`}"
      );

      // Should skip img, br, hr (in skipElements)
      expect(result).not.toContain('data-testid="MediaComponent.img"');
      expect(result).not.toContain('data-testid="MediaComponent.br"');
      expect(result).not.toContain('data-testid="MediaComponent.hr"');

      // But should include input and textarea
      expect(result).toContain("data-testid=");
    });

    it("should handle components with TypeScript generics and complex props", () => {
      const input = `
interface ListItem {
  id: number;
  name: string;
  metadata?: Record<string, any>;
}

interface ListProps<T extends ListItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick: (item: T) => void;
  className?: string;
}

export function GenericList<T extends ListItem>({ 
  items, 
  renderItem, 
  onItemClick, 
  className 
}: ListProps<T>) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  return (
    <div className={className}>
      <header>
        <h2>Generic List ({items.length} items)</h2>
        <div>
          <button onClick={() => setSelectedIds([])}>
            Clear Selection
          </button>
        </div>
      </header>
      <main>
        <ul role="list">
          {items.map((item, index) => (
            <li 
              key={item.id}
              role="listitem"
              className={selectedIds.includes(item.id) ? 'selected' : ''}
            >
              <div>
                <span>{item.name}</span>
                <div>
                  {renderItem(item, index)}
                </div>
                <button 
                  onClick={() => onItemClick(item)}
                  aria-label={\`Select \${item.name}\`}
                >
                  Select
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}`;

      const result = transformer.transform(input, "GenericList.tsx");

      // Check TypeScript syntax preservation
      expect(result).toContain("interface ListItem");
      expect(result).toContain("interface ListProps<T extends ListItem>");
      expect(result).toContain(
        "export function GenericList<T extends ListItem>"
      );
      expect(result).toContain("useState<number[]>");

      // Check hierarchical structure
      expect(result).toContain('data-testid="GenericList.div"');
      expect(result).toContain('data-testid="GenericList.div.header"');
      expect(result).toContain('data-testid="GenericList.header.h2"');
      expect(result).toContain('data-testid="GenericList.header.div"');
      expect(result).toContain('data-testid="GenericList.div.main"');
      expect(result).toContain('data-testid="GenericList.main.ul"');

      // Check loop elements with proper hierarchy
      expect(result).toContain("data-testid={`GenericList.ul.li.${index}`}");
      expect(result).toContain("data-testid={`GenericList.li.div.${index}`}");
      expect(result).toContain("data-testid={`GenericList.div.span.${index}`}");

      // Should preserve complex expressions
      expect(result).toContain("selectedIds.includes(item.id)");
      expect(result).toContain("Object.keys(errors).length");
      expect(result).toContain("aria-label={`Select ${item.name}`}");
    });
  });

  describe("Real-world Component Patterns", () => {
    it("should handle e-commerce product grid with filters", () => {
      const input = `
export function ProductGrid({ products, filters, onFilterChange }) {
  const categories = ["electronics", "clothing", "books"];
  
  return (
    <div>
      <aside>
        <h3>Filters</h3>
        <form>
          <fieldset>
            <legend>Categories</legend>
            <div>
              {categories.map((category, index) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    name="category"
                    value={category}
                    checked={filters.categories.includes(category)}
                    onChange={(e) => onFilterChange('category', category, e.target.checked)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>
      </aside>
      
      <main>
        <header>
          <h1>Products ({products.length})</h1>
          <div>
            <select onChange={(e) => onFilterChange('sort', e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </header>
        
        <section>
          <div>
            {products.map((product, productIndex) => (
              <article key={product.id}>
                <header>
                  <h2>{product.name}</h2>
                  <div>
                    <span>\${product.price}</span>
                    <span>{product.category}</span>
                  </div>
                </header>
                <div>
                  <p>{product.description}</p>
                  <div>
                    {product.features.map((feature, featureIndex) => (
                      <span key={featureIndex}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <footer>
                  <button onClick={() => addToCart(product.id)}>
                    Add to Cart
                  </button>
                  <button onClick={() => viewDetails(product.id)}>
                    View Details
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}`;

      const result = transformer.transform(input, "ProductGrid.tsx");

      // Check main structure
      expect(result).toContain('data-testid="ProductGrid.div"');
      expect(result).toContain('data-testid="ProductGrid.div.aside"');
      expect(result).toContain('data-testid="ProductGrid.aside.h3"');
      expect(result).toContain('data-testid="ProductGrid.aside.form"');

      // Check filter loop
      expect(result).toContain(
        "data-testid={`ProductGrid.div.label.${index}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductGrid.label.input.${index}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductGrid.label.span.${index}`}"
      );

      // Check product grid
      expect(result).toContain('data-testid="ProductGrid.div.main"');
      expect(result).toContain('data-testid="ProductGrid.main.section"');
      expect(result).toContain('data-testid="ProductGrid.section.div"');

      // Check nested loops (products and features)
      expect(result).toContain(
        "data-testid={`ProductGrid.div.article.${productIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductGrid.article.header.${productIndex}`}"
      );
      expect(result).toContain(
        "data-testid={`ProductGrid.div.span.${featureIndex}`}"
      );

      // Check complex expressions are preserved
      expect(result).toContain("filters.categories.includes(category)");
      expect(result).toContain(
        "onFilterChange('category', category, e.target.checked)"
      );
      expect(result).toContain("addToCart(product.id)");
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle malformed or incomplete JSX gracefully", () => {
      const input = `
export function IncompleteComponent() {
  return (
    <div>
      <span>Valid element</span>
      <!-- HTML comment -->
      <div
        className="incomplete
      >
        <p>This might cause issues</p>
      </div>
    </div>
  );
}`;

      // Should not throw errors
      expect(() => {
        const result = transformer.transform(input, "IncompleteComponent.tsx");
      }).not.toThrow();

      const result = transformer.transform(input, "IncompleteComponent.tsx");

      // Should still process valid elements
      expect(result).toContain('data-testid="IncompleteComponent.div"');
      expect(result).toContain('data-testid="IncompleteComponent.div.span"');
    });

    it("should handle components with no JSX", () => {
      const input = `
export function UtilComponent() {
  const helper = (value: string) => value.toUpperCase();
  
  return {
    process: helper,
    data: "some data"
  };
}

export const config = {
  apiUrl: "https://api.example.com"
};`;

      const result = transformer.transform(input, "UtilComponent.ts");

      // Should return unchanged for non-React files
      expect(result).toBe(input);
    });

    it("should handle empty components", () => {
      const input = `
export function EmptyComponent() {
  return null;
}

export function AnotherEmpty() {
  return <></>;
}`;

      const result = transformer.transform(input, "EmptyComponent.tsx");

      // Should handle gracefully
      expect(result).toContain("export function EmptyComponent()");
      expect(result).toContain("return null");
      expect(result).toContain("return <></>;");
    });
  });
});
