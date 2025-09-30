# @lineai/memory

A functional TypeScript client library for the Cognee API. This library provides a simple, type-safe interface for interacting with Cognee's knowledge graph and memory management services.

## Installation

```bash
npm install @lineai/memory
# or
yarn add @lineai/memory
```

## Quick Start

```typescript
import { CogneeConfig, login, addData, cognify, search, SearchType } from '@lineai/memory';

// Configure the client
const config: CogneeConfig = {
  baseUrl: 'http://localhost:8000',
};

// Login (if authentication is required)
await login(config, {
  username: 'your-username',
  password: 'your-password',
});

// Add data to a dataset
const file = new File(['content'], 'document.txt');
await addData(config, [file], {
  datasetName: 'my-dataset',
});

// Process the data into a knowledge graph
await cognify(config, {
  datasets: ['my-dataset'],
});

// Search the knowledge graph
const results = await search(config, {
  query: 'What is in the document?',
  dataset_name: 'my-dataset',
  search_type: SearchType.GRAPH_COMPLETION,
});

console.log(results);
```

## Core Concepts

### Configuration

All API functions require a `CogneeConfig` object:

```typescript
interface CogneeConfig {
  baseUrl: string;  // The Cognee API base URL
  apiKey?: string;  // Optional API key for cloud services
}
```

### Functional API

All functions follow a simple pattern:
```typescript
(config: CogneeConfig, ...params) => Promise<Result>
```

This makes them easy to compose, test, and use with different configurations.

## API Reference

See the full documentation below for all available functions and types.

## Philosophy

This library follows functional programming principles:

- **Pure functions**: All API calls are pure functions of their inputs
- **Immutability**: All data structures use `readonly` properties
- **Composition**: Functions are designed to be easily composed
- **Minimal abstraction**: Direct mapping to API endpoints
- **Type safety**: Full TypeScript support

## License

MIT
