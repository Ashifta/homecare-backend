import { AppDataSource } from '../database/datasource';
import { DomainConfig } from '../../common/domain/domain-config.interface';

export async function loadDomainConfig(): Promise<DomainConfig> {
  const domainCode = process.env.CARE_DOMAIN_CODE;
  if (!domainCode) {
    throw new Error('CARE_DOMAIN_CODE is required');
  }

  // ✅ ASSUME DB IS ALREADY CONNECTED
  const result = await AppDataSource.query(
    `
    SELECT id, code, display_name, config, is_active
    FROM care_domains
    WHERE code = $1
    `,
    [domainCode],
  );

  if (!result.length) {
    throw new Error(`Domain not found: ${domainCode}`);
  }

  const row = result[0];

  if (!row.is_active) {
    throw new Error(`Domain inactive: ${domainCode}`);
  }

  return {
    id: row.id,
    code: row.code,
    displayName: row.display_name,
    isActive: row.is_active,
    ...row.config,
  };
}
