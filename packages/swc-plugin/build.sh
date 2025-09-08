#!/bin/bash

# Build script for SWC plugin
echo "Building SWC Auto TestId Plugin..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "Error: Rust/Cargo is not installed. Please install Rust first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    cargo install wasm-pack
fi

# Build the plugin
echo "Building plugin for WebAssembly..."
cargo build --release --target wasm32-wasi

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Plugin built at: target/wasm32-wasi/release/swc_plugin_auto_testid.wasm"
    echo ""
    echo "To use this plugin in your Next.js project, add to next.config.js:"
    echo ""
    echo "module.exports = {"
    echo "  experimental: {"
    echo "    swcPlugins: ["
    echo "      ['./path/to/swc_plugin_auto_testid.wasm', {}]"
    echo "    ]"
    echo "  }"
    echo "}"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi
