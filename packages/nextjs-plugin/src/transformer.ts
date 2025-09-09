import { PluginOptions } from "./types";
import { FixedParser } from "./fixed-parser";

export class TestIdTransformer {
  private parser: FixedParser;

  constructor(options: PluginOptions = {}) {
    this.parser = new FixedParser(options);
  }

  transform(code: string, filename: string): string {
    return this.parser.transform(code, filename);
  }
}
