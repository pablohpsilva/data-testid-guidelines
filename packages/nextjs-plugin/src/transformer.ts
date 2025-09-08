import { PluginOptions } from "./types";
import { SimpleJSXParser } from "./parser";

export class TestIdTransformer {
  private parser: SimpleJSXParser;

  constructor(options: PluginOptions = {}) {
    this.parser = new SimpleJSXParser(options);
  }

  transform(code: string, filename: string): string {
    return this.parser.transform(code, filename);
  }
}
