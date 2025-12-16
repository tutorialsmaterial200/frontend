# Testing with Bun

This project uses Bun's built-in test runner for unit and integration tests.

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test __tests__/api.test.ts

# Run tests in watch mode
bun test --watch

# Run with verbose output
bun test --verbose
```

## Test Structure

Tests are organized in the `__tests__` directory:

```
__tests__/
├── api.test.ts          # API utility tests
└── components.test.tsx  # Component tests (optional)
```

## Writing Tests

Bun uses a Jest-like API. Here's an example:

```typescript
import { describe, it, expect } from 'bun:test';

describe('My Feature', () => {
  it('should do something', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle edge cases', () => {
    expect([]).toHaveLength(0);
  });
});
```

## Common Assertions

```typescript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('key');
expect(obj.key).toMatch(/pattern/);

// Functions
expect(fn).toThrow();
expect(fn).toThrowError('message');
```

## Test Files Included

### `__tests__/api.test.ts`
Tests for API response handling and data transformation:
- API response parsing
- Category hierarchy building
- Product price parsing
- Nested data handling

## CI/CD Integration

To run tests in your CI/CD pipeline:

```bash
bun test
```

Tests are also run during the build process to catch errors early.

## Performance

Bun's test runner is extremely fast:
- Tests run in parallel by default
- Typically 10-100x faster than Jest
- Native TypeScript support

## More Information

- [Bun Testing Docs](https://bun.sh/docs/test/overview)
- [Jest Compatibility](https://bun.sh/docs/test/jest)
- [Assertion Reference](https://bun.sh/docs/test/assertion)
