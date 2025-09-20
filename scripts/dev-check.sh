#!/bin/bash

# Development Check Script - Run before committing
# This script runs all quality checks locally

set -e

echo "═══════════════════════════════════════════"
echo "   🔍 NEURLYN DEVELOPMENT CHECK SUITE"
echo "═══════════════════════════════════════════"
echo ""

# Track overall status
FAILED_CHECKS=""

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    echo -n "▶️  $name..."

    if eval "$command" > /dev/null 2>&1; then
        echo " ✅"
    else
        echo " ❌"
        FAILED_CHECKS="$FAILED_CHECKS\n  - $name"
        return 1
    fi
}

# 1. Code Quality Checks
echo "📋 Code Quality Checks"
echo "────────────────────────"

run_check "ESLint" "npm run lint" || true
run_check "Prettier" "npm run format:check" || true
run_check "TypeScript" "npm run typecheck" || true

echo ""

# 2. Test Suite
echo "🧪 Test Suite"
echo "────────────────────────"

run_check "Unit Tests" "npm test -- --passWithNoTests" || true

echo ""

# 3. Security Checks
echo "🔒 Security Checks"
echo "────────────────────────"

# Check for console.logs
echo -n "▶️  Console.log check..."
CONSOLE_COUNT=$(grep -r "console\.log" --include="*.js" --exclude-dir=node_modules . 2>/dev/null | wc -l)
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    echo " ⚠️  ($CONSOLE_COUNT found)"
else
    echo " ✅"
fi

# Check for secrets
echo -n "▶️  Secret detection..."
if grep -rE "(api[_-]?key|apikey|secret|password|token)" \
   --include="*.js" --include="*.json" \
   --exclude-dir=node_modules --exclude="package-lock.json" . 2>/dev/null | \
   grep -v "process.env" | grep -v "//" | grep -v "#" > /dev/null; then
    echo " ⚠️"
else
    echo " ✅"
fi

echo ""

# 4. CSS Validation
echo "🎨 CSS Validation"
echo "────────────────────────"

echo -n "▶️  !important usage..."
IMPORTANT_COUNT=$(grep -r "!important" styles/*.css 2>/dev/null | wc -l)
if [ "$IMPORTANT_COUNT" -gt 50 ]; then
    echo " ⚠️  ($IMPORTANT_COUNT uses - consider reducing)"
else
    echo " ✅ ($IMPORTANT_COUNT uses)"
fi

echo -n "▶️  Fixed width check..."
FIXED_WIDTH=$(grep -r "width:[[:space:]]*[0-9]\+px" styles/*.css 2>/dev/null | grep -v "max-width" | grep -v "min-width" | wc -l)
if [ "$FIXED_WIDTH" -gt 10 ]; then
    echo " ⚠️  ($FIXED_WIDTH found - check mobile compatibility)"
else
    echo " ✅ ($FIXED_WIDTH found)"
fi

echo ""

# 5. Build Check
echo "🏗️  Build Check"
echo "────────────────────────"

run_check "Production Build" "npm run build" || true

# Clean up build artifacts
rm -rf dist/

echo ""

# 6. Dependency Check
echo "📦 Dependency Check"
echo "────────────────────────"

echo -n "▶️  Security audit..."
if npm audit --audit-level=high > /dev/null 2>&1; then
    echo " ✅"
else
    echo " ⚠️  (run 'npm audit' for details)"
fi

echo ""

# 7. Git Status
echo "📝 Git Status"
echo "────────────────────────"

echo "Modified files:"
git status --short | head -10

echo ""

# Summary
echo "═══════════════════════════════════════════"
echo "   📊 SUMMARY"
echo "═══════════════════════════════════════════"

if [ -z "$FAILED_CHECKS" ]; then
    echo ""
    echo "  🎉 All checks passed! Ready to commit."
    echo ""
else
    echo ""
    echo "  ⚠️  Some checks failed:"
    echo -e "$FAILED_CHECKS"
    echo ""
    echo "  Fix these issues before committing."
    echo ""
    exit 1
fi