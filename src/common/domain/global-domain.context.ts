import { DomainConfig } from './domain-config.interface';

export class GlobalDomainContext {
  private static config: DomainConfig | null = null;

  static initialize(config: DomainConfig) {
    if (this.config) {
      throw new Error('Domain already initialized');
    }
    this.config = Object.freeze(config);
  }

  static get(): DomainConfig {
    if (!this.config) {
      throw new Error('Domain not initialized');
    }
    return this.config;
  }
}
