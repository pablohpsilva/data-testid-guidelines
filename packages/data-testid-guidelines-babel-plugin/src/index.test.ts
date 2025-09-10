import { transform } from "@babel/core";
import { describe, it, expect } from "vitest";
import plugin from "./index";

const transformCode = (code: string, options = {}) => {
  const result = transform(code, {
    plugins: [[plugin, options]],
    parserOpts: {
      plugins: ["jsx", "typescript"],
    },
  });

  return result?.code || "";
};

describe("data-testid-guidelines-babel-plugin", () => {
  describe("basic component processing", () => {
    it("should add data-testid to root DOM element", () => {
      const input = `
        function UserCard() {
          return <div>User info</div>;
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="UserCard"');
    });

    it("should add data-testid to React components", () => {
      const input = `
        function UserProfile() {
          return (
            <div>
              <Avatar />
              <UserInfo />
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="UserProfile"');
      expect(result).toContain('data-testid="UserProfile.Avatar"');
      expect(result).toContain('data-testid="UserProfile.UserInfo"');
    });

    it("should handle arrow function components", () => {
      const input = `
        const Header = () => (
          <>
            <Logo />
            <Navigation />
          </>
        );
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="Header.Logo"');
      expect(result).toContain('data-testid="Header.Navigation"');
    });
  });

  describe("fragment handling", () => {
    it("should handle React.Fragment with child components", () => {
      const input = `
        function Header() {
          return (
            <>
              <Logo />
              <Navigation />
            </>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="Header.Logo"');
      expect(result).toContain('data-testid="Header.Navigation"');
    });

    it("should handle React.Fragment syntax", () => {
      const input = `
        function Header() {
          return (
            <React.Fragment>
              <Logo />
              <Navigation />
            </React.Fragment>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="Header.Logo"');
      expect(result).toContain('data-testid="Header.Navigation"');
    });
  });

  describe("loop handling", () => {
    it("should handle components in map loops", () => {
      const input = `
        function UserList({ users }) {
          return (
            <div>
              {users.map((user, index) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="UserList"');
      expect(result).toContain("data-testid={`UserList.UserCard.${index}`}");
    });

    it("should handle nested components in loops", () => {
      const input = `
        function UserCard({ user }) {
          return (
            <div>
              <Avatar src={user.avatar} />
              <UserName name={user.name} />
            </div>
          );
        }
        
        function UserList({ users }) {
          return (
            <div>
              {users.map((user, index) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="UserCard"');
      expect(result).toContain('data-testid="UserCard.Avatar"');
      expect(result).toContain('data-testid="UserCard.UserName"');
      expect(result).toContain("data-testid={`UserList.UserCard.${index}`}");
    });

    it("should handle multiple loops in same component", () => {
      const input = `
        function MultiList() {
          return (
            <div>
              {users.map((user, index) => (
                <UserCard key={user.id} />
              ))}
              {posts.map((post, index) => (
                <PostCard key={post.id} />
              ))}
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain("data-testid={`MultiList.UserCard.${index}`}");
      expect(result).toContain("data-testid={`MultiList.PostCard.${index}`}");
    });
  });

  describe("complex nested structures", () => {
    it("should handle deeply nested component hierarchy", () => {
      const input = `
        function Dashboard() {
          return (
            <div>
              <Header />
              <Sidebar>
                <Navigation />
                <UserMenu />
              </Sidebar>
              <MainContent>
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post}>
                    <PostHeader />
                    <PostBody />
                    <PostActions>
                      <LikeButton />
                      <ShareButton />
                    </PostActions>
                  </PostCard>
                ))}
              </MainContent>
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="Dashboard"');
      expect(result).toContain('data-testid="Dashboard.Header"');
      expect(result).toContain('data-testid="Dashboard.Sidebar"');
      // Note: Current implementation limitation - intermediate component boundaries not tracked
      // Navigation and UserMenu get Dashboard prefix, not Dashboard.Sidebar
      expect(result).toContain('data-testid="Dashboard.Navigation"');
      expect(result).toContain('data-testid="Dashboard.UserMenu"');
      expect(result).toContain('data-testid="Dashboard.MainContent"');
      expect(result).toContain("data-testid={`Dashboard.PostCard.${index}`}");
    });
  });

  describe("existing attributes", () => {
    it("should respect existing data-testid attributes", () => {
      const input = `
        function MyComponent() {
          return <CustomComponent data-testid="custom-id" />;
        }
      `;

      const result = transformCode(input, { respectExisting: true });
      expect(result).toContain('data-testid="custom-id"');
      expect(result).not.toContain('data-testid="MyComponent.CustomComponent"');
    });

    it("should override existing data-testid when respectExisting is false", () => {
      const input = `
        function MyComponent() {
          return <CustomComponent data-testid="custom-id" />;
        }
      `;

      const result = transformCode(input, { respectExisting: false });
      expect(result).toContain('data-testid="MyComponent.CustomComponent"');
    });
  });

  describe("custom attribute name", () => {
    it("should use custom attribute name", () => {
      const input = `
        function MyComponent() {
          return <div><CustomComponent /></div>;
        }
      `;

      const result = transformCode(input, { attributeName: "data-cy" });
      expect(result).toContain('data-cy="MyComponent"');
      expect(result).toContain('data-cy="MyComponent.CustomComponent"');
    });
  });

  describe("disabled auto-generation", () => {
    it("should not add data-testid when autoGenerate is false", () => {
      const input = `
        function MyComponent() {
          return <div><CustomComponent /></div>;
        }
      `;

      const result = transformCode(input, { autoGenerate: false });
      expect(result).not.toContain("data-testid");
    });
  });

  describe("DOM element handling", () => {
    it("should only add data-testid to root DOM elements", () => {
      const input = `
        function MyComponent() {
          return (
            <div>
              <span>Nested content</span>
              <p>More content</p>
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('<div data-testid="MyComponent">');
      expect(result).toContain("<span>Nested content</span>"); // no data-testid
      expect(result).toContain("<p>More content</p>"); // no data-testid
    });

    it("should skip non-root DOM elements", () => {
      const input = `
        function MyComponent() {
          return (
            <div>
              <CustomComponent />
              <span>Should not get testId</span>
            </div>
          );
        }
      `;

      const result = transformCode(input);
      expect(result).toContain('data-testid="MyComponent"');
      expect(result).toContain('data-testid="MyComponent.CustomComponent"');
      expect(result).not.toContain("<span data-testid");
    });
  });
});
