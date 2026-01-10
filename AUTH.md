# 🔐 AUTH.md — Authentication, Tenant & Identity Specification

## 1. Purpose
This document defines the authoritative authentication, identity, tenant, and authorization model for the platform.

The system supports:
- WhatsApp clients
- Web clients
- Multi-tenant SaaS
- Delayed tenant verification
- Full auditability

---

## 2. Core Principles (Non-Negotiable)

1. JWT is the only source of truth
2. Tenant is never accepted from client input
3. OTP proves identity, not tenancy
4. Tenant resolution may be delayed
5. Every tenant decision is auditable
6. Nothing is silently overwritten

---

## 3. Key Concepts

| Term | Meaning |
|------|--------|
| Identity | A real person identified by phone number |
| Tenant | Clinic / provider / organization |
| Receiver | End user (WhatsApp / Web) |
| Channel | WHATSAPP or WEB |
| JWT | Identity + authorization context |
| Audit | Immutable decision log |

---

## 4. Identity Model

- Phone number uniquely identifies an identity
- Identity exists independently of tenant
- One identity may belong to multiple tenants

---

## 5. OTP Flow (Pre-Auth)

### Send OTP
- Public endpoint
- No JWT, no tenant
- Redis key: otp:<purpose>:<phone>

### Verify OTP
- Public endpoint
- Proves phone ownership
- Identity created if not exists
- Tenant resolution is conditional

---

## 6. JWT Types

### FULL TOKEN
```json
{
  "sub": "identity-id",
  "tenantId": "tenant-uuid",
  "role": "RECEIVER",
  "state": "VERIFIED",
  "channel": "WHATSAPP"
}
```

### LIMITED TOKEN
```json
{
  "sub": "identity-id",
  "tenantId": null,
  "state": "PENDING_ASSIGNMENT"
}
```

### CHOICE TOKEN
```json
{
  "sub": "identity-id",
  "tenantId": null,
  "state": "TENANT_SELECTION_REQUIRED"
}
```

---

## 7. Tenant Resolution Priority

1. Existing identity → tenant association
2. WhatsApp recipient number
3. Location-based inference
4. Manual / delayed assignment

---

## 8. WhatsApp Auto-Resolution

- Recipient number (TO) is trusted
- Mapped via tenant_channels
- Unique mapping → auto-assign
- Ambiguous → fallback

---

## 9. Location-Based Resolution

- Geo-fencing via tenant_locations
- Single match → auto-assign
- Multiple matches → delayed

---

## 10. Multi-Tenant Phone Handling

- Identity may map to multiple tenants
- Selection required if ambiguous
- Selection issues a new JWT
- Always audited

---

## 11. Audit Trail

- Append-only
- Never updated or deleted
- Records method, confidence, evidence, channel

Methods:
- EXISTING_ASSOCIATION
- WHATSAPP_RECIPIENT
- LOCATION_AUTO
- TENANT_SELECTION
- MANUAL_ADMIN
- TENANT_MERGE

---

## 12. Confidence & Revalidation

| Confidence | Meaning | Action |
|------------|--------|--------|
| ≥90 | Strong | No action |
| 70–89 | Medium | Revalidate |
| <70 | Weak | Admin review |

---

## 13. Guards & Authorization

Guard order:
```
JwtAuthGuard
→ ActorGuard
→ TenantVerifiedGuard
```

OTP controllers are always public.

---

## 14. Tenant Merge

- Tenants are never deleted
- Source marked MERGED
- merged_into points to canonical tenant
- Runtime redirect keeps old tokens valid
- Fully audited

---

## 15. User Transparency API

GET /me/tenant-assignment

Explains:
- Assigned tenant
- Method
- Confidence
- Timestamp

---

## 16. Security Guarantees

- No tenant spoofing
- No header-based tenancy
- No silent reassignment
- Full audit trail

---

## 17. WhatsApp Compatibility

- No custom headers
- Stateless clients
- Server reissues JWT as needed

---

## 18. Final Law

OTP proves who you are  
Tenant defines where you act  
JWT binds both  
Audit explains why

---

## 19. Change Policy

Any change to auth, tenant resolution, or guards must update this document first.

---

## Status

This document is authoritative.
