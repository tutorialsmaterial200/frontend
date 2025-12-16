# Using Bun with this project

Bun is a fast, all-in-one JavaScript runtime and package manager. Here's how to use it with this superapp frontend.

## Installation

### macOS/Linux
```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows
```bash
powershell -c "$(curl -fsSL https://bun.sh/install.ps1)"
```

## Available Commands

### Install dependencies
```bash
bun install
```

### Run development server
```bash
bun run dev
```

This starts the Next.js development server on port 3020.

### Build for production
```bash
bun run build
```

### Start production server
```bash
bun start
```

### Run tests
```bash
bun test
```

### Lint code
```bash
bun run lint
```

## Advantages of Bun

- ⚡ **Faster** - Significantly faster install and runtime performance
- 📦 **All-in-one** - Comes with a bundler, test runner, and transpiler
- 🔥 **Hot reload** - Built-in support for fast refresh
- 📝 **TypeScript** - Native TypeScript support without compilation
- 🎯 **npm compatible** - Works as a drop-in replacement for npm

## Configuration

Configuration is in:
- `bunfig.toml` - Bun's native configuration format
- `.bunrc.json` - Alternative JSON configuration format

## Performance Tips

1. **Use `bun install`** instead of `npm install` for ~3x faster installations
2. **Use `bun run`** to execute scripts instead of `npm run`
3. **Use `bun add`/`bun remove`** to manage dependencies
4. **Use `bun test`** for faster test execution

## Environment Variables

Bun respects `.env`, `.env.local`, and `.env.production` files just like Node.js.

## Troubleshooting

If you encounter issues:

1. Clear Bun's cache:
```bash
bun cache clean
```

2. Reinstall dependencies:
```bash
rm -rf node_modules
bun install
```

3. Check Bun version:
```bash
bun --version
```

## Switching between npm and Bun

You can use both npm and Bun in the same project. Just remember:
- `bun install` and `npm install` may create different lock files
- Use one or the other for consistency
- Recommended: Use Bun for development, as it's faster

## More Information

- [Bun Official Docs](https://bun.sh/)
- [Next.js with Bun](https://nextjs.org/docs/getting-started/installation)
- [Package Manager Comparison](https://bun.sh/docs/install/npm)
