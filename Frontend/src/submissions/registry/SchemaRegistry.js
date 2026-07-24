import { ALL_SCHEMAS } from "../schemas";

class SchemaRegistryStore {
  constructor() {
    this.schemas = new Map();
    // Register built-in schemas
    Object.entries(ALL_SCHEMAS).forEach(([key, schema]) => {
      this.schemas.set(key, schema);
    });
  }

  register(key, schema) {
    this.schemas.set(key, schema);
  }

  get(key) {
    return this.schemas.get(key) || null;
  }

  has(key) {
    return this.schemas.has(key);
  }
}

export const SchemaRegistry = new SchemaRegistryStore();
