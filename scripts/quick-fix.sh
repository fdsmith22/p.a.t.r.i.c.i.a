#!/bin/bash

# Quick Fix Script - Automatically fix common issues

echo "═══════════════════════════════════════════"
echo "   🔧 NEURLYN QUICK FIX TOOL"
echo "═══════════════════════════════════════════"
echo ""

# 1. Format code
echo "💅 Formatting code with Prettier..."
npm run format
echo "✅ Code formatted"
echo ""

# 2. Fix linting issues
echo "🧹 Fixing ESLint issues..."
npm run lint:fix
echo "✅ Linting issues fixed (where possible)"
echo ""

# 3. Remove console.log statements
echo "📝 Removing console.log statements..."
FILES_WITH_CONSOLE=$(grep -rl "console\.log" --include="*.js" --exclude-dir=node_modules . 2>/dev/null)
if [ ! -z "$FILES_WITH_CONSOLE" ]; then
    echo "Found console.log in:"
    echo "$FILES_WITH_CONSOLE" | while read file; do
        echo "  - $file"
        # Comment out console.logs instead of removing
        sed -i.bak 's/^[[:space:]]*console\.log/\/\/ console.log/g' "$file"
    done
    echo "✅ Console.log statements commented out"
else
    echo "✅ No console.log statements found"
fi
echo ""

# 4. Optimize images
echo "🖼️  Checking for large images..."
LARGE_IMAGES=$(find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k -not -path "./node_modules/*" 2>/dev/null)
if [ ! -z "$LARGE_IMAGES" ]; then
    echo "Large images found (>500KB):"
    echo "$LARGE_IMAGES" | while read img; do
        SIZE=$(du -h "$img" | cut -f1)
        echo "  - $img ($SIZE)"
    done
    echo "⚠️  Consider optimizing these images"
else
    echo "✅ No large images found"
fi
echo ""

# 5. Update dependencies
echo "📦 Checking for outdated dependencies..."
OUTDATED=$(npm outdated 2>/dev/null | wc -l)
if [ "$OUTDATED" -gt 1 ]; then
    echo "Found $((OUTDATED-1)) outdated packages"
    read -p "Would you like to update them? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm update
        echo "✅ Dependencies updated"
    fi
else
    echo "✅ All dependencies are up to date"
fi
echo ""

# 6. Clean up
echo "🧹 Cleaning up..."
# Remove backup files
find . -name "*.bak" -type f -delete 2>/dev/null
# Clean npm cache
npm cache verify > /dev/null 2>&1
echo "✅ Cleanup complete"
echo ""

# 7. Run tests
echo "🧪 Running tests..."
if npm test -- --passWithNoTests > /dev/null 2>&1; then
    echo "✅ All tests passed"
else
    echo "❌ Some tests failed - please check manually"
fi
echo ""

echo "═══════════════════════════════════════════"
echo "   ✨ QUICK FIX COMPLETE"
echo "═══════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Review the changes made"
echo "2. Run './scripts/dev-check.sh' to verify"
echo "3. Commit your changes"