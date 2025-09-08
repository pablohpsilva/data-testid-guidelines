"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen p-8">
      <header>
        <h1 className="text-3xl font-bold text-center mb-8">
          Next.js Auto TestID Plugin Demo
        </h1>
      </header>

      <main>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="max-w-4xl mx-auto">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Active Tab: {activeTab}
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                This demo shows automatic data-testid injection working with:
              </p>

              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Component name detection (Navigation)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Element name inclusion (.nav, .button, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Loop indexing (.tabs.item.0, .tabs.item.1, etc.)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Semantic HTML support
                </li>
              </ul>
            </div>
          </section>

          <footer className="mt-8 text-center text-gray-500">
            <p>
              Open DevTools to inspect the generated data-testid attributes!
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
