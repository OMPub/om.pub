#!/bin/bash

# Next.js 16 Upgrade - Lint Fix Script
# Run this to test and fix linting issues

echo "🔧 Testing Next.js 16 Lint Setup..."
echo ""

# Step 1: Verify eslint.config.js exists
if [ ! -f "eslint.config.js" ]; then
    echo "❌ eslint.config.js not found!"
    echo "Creating eslint.config.js..."
    cat > eslint.config.js << 'EOF'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default [
  ...compat.extends('next/core-web-vitals'),
]
EOF
    echo "✅ Created eslint.config.js"
else
    echo "✅ eslint.config.js exists"
fi

echo ""
echo "📋 Running Next.js lint..."
npm run lint

# Capture exit code
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ Linting passed!"
else
    echo ""
    echo "❌ Linting failed with exit code: $EXIT_CODE"
    echo ""
    echo "Common fixes:"
    echo "1. If 'Invalid project directory' error:"
    echo "   - Check that src/ directory exists"
    echo "   - Check that pages/ or app/ directory exists"
    echo ""
    echo "2. If ESLint config error:"
    echo "   - Verify @eslint/eslintrc is installed"
    echo "   - Run: npm install -D @eslint/eslintrc"
    echo ""
    echo "3. If module import error:"
    echo "   - Check Node.js version (should be 24.x)"
    echo "   - Verify package.json has 'type': 'module' if needed"
fi

exit $EXIT_CODE
