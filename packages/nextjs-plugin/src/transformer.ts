import { PluginOptions } from "./types";
import { SimpleReliableParser } from "./simple-parser";

export class TestIdTransformer {
  private parser: SimpleReliableParser;

  constructor(options: PluginOptions = {}) {
    this.parser = new SimpleReliableParser(options);
  }

  transform(code: string, filename: string): string {
    return this.parser.transform(code, filename);
  }
}
