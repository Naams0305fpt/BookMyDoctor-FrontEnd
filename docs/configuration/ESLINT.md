# ESLint Configuration

## Overview

This project uses ESLint to maintain code quality and prevent common mistakes.

## Rules Configured

### 🚫 Console Statements

```javascript
// ⚠️ Warning
console.log("debug");
console.error("error");

// ✅ Allowed in development
if (process.env.NODE_ENV === "development") {
  console.log("debug");
}
```

### 📏 TypeScript Rules

#### No Explicit `any`

```typescript
// ⚠️ Warning
const data: any = fetchData();

// ✅ Better
interface UserData {
  name: string;
  email: string;
}
const data: UserData = fetchData();
```

#### Unused Variables

```typescript
// ⚠️ Warning
const unusedVar = "never used";

// ✅ OK - prefix with underscore if intentionally unused
const _ignoredVar = "intentionally unused";
```

### ⚛️ React Rules

#### Exhaustive Dependencies

```typescript
// ⚠️ Warning
useEffect(() => {
  fetchData(userId);
}, []); // userId should be in deps

// ✅ Correct
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

#### Target Blank Security

```jsx
// 🚨 Error
<a href={url} target="_blank">Link</a>

// ✅ Correct
<a href={url} target="_blank" rel="noopener noreferrer">
  Link
</a>
```

### 🔒 Security Rules

```javascript
// 🚨 Error - Never allowed
eval(userInput);
setTimeout(userInput);
```

## Running ESLint

### Check all files

```bash
npm run lint
```

### Auto-fix issues

```bash
npm run lint:fix
```

### VS Code Integration

ESLint warnings will show automatically in VS Code:

- Yellow underline = Warning
- Red underline = Error

## Ignoring Rules

When you MUST ignore a rule (rare cases):

```typescript
// eslint-disable-next-line no-console
console.log("Temporary debug");

// Multiple rules
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
const data: any = test();
```

## Pre-commit Hook (Optional)

To prevent bad code from being committed:

```bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# Setup
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Create `.lintstagedrc.json`:

```json
{
  "*.{ts,tsx}": ["eslint --fix", "git add"]
}
```

## Common Warnings & Fixes

### 1. Exhaustive Dependencies

**Warning:**

```
React Hook useEffect has a missing dependency: 'fetchData'
```

**Fix:**

```typescript
// Option 1: Add to dependencies
useEffect(() => {
  fetchData();
}, [fetchData]);

// Option 2: Wrap in useCallback
const fetchData = useCallback(() => {
  // ...
}, []);
```

### 2. Unused Variables

**Warning:**

```
'LoadingSpinner' is assigned a value but never used
```

**Fix:**

```typescript
// Option 1: Remove if truly unused
// const LoadingSpinner = ...

// Option 2: Prefix with _ if intentionally unused
const _LoadingSpinner = ...
```

### 3. Console Statements

**Warning:**

```
Unexpected console statement
```

**Fix:**

```typescript
// Option 1: Remove
// console.log("debug");

// Option 2: Use in development only
if (process.env.NODE_ENV === "development") {
  console.log("debug");
}

// Option 3: Use proper error handling
showNotification("error", "Error message");
```

## Benefits

✅ **Catch bugs early** - Before they reach production  
✅ **Consistent code style** - Across the team  
✅ **Better TypeScript** - Enforce type safety  
✅ **Secure code** - Prevent dangerous patterns  
✅ **Self-documenting** - Rules explain best practices

## Maintenance

ESLint config is in `.eslintrc.json`. Update as needed for project-specific rules.
