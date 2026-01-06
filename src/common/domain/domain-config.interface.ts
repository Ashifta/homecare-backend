export interface DomainConfig {
  id: string;
  code: string;
  displayName: string;

  allowsTelemetry: boolean;
  defaultSessionDuration: number;
  bufferDuration: number;

  supportsAccessories: boolean;
  clinicalMetrics: string[];

  isActive: boolean;
}
