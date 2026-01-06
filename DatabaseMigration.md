
Add 1767537282779-CreateCareDomains.ts
Add CREATE TABLE care_domains (
        id UUID PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        config JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT now()
        );

Insert


INSERT INTO care_domains (
  id,
  code,
  display_name,
  config,
  is_active
) VALUES (
  gen_random_uuid(),
  'PHYSIO_REHAB',
  'Physio Rehabilitation',
  '{
    "allowsTelemetry": true,
    "defaultSessionDuration": 45,
    "bufferDuration": 15,
    "supportsAccessories": true,
    "clinicalMetrics": ["pain", "mobility"]
  }',
  true
);


npm run build
npx typeorm migration:run -d dist/infrastructure/database/datasource.js

This is used to migrate care_domains with the main domain.