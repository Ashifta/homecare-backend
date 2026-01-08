

---

# 🏥 Generic Service Scheduling & Care Platform

![Status](https://img.shields.io/badge/status-active-success)
![Backend](https://img.shields.io/badge/backend-NestJS-red)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![Cache](https://img.shields.io/badge/cache-Redis-critical)
![Container](https://img.shields.io/badge/container-Docker-blue)
![Architecture](https://img.shields.io/badge/architecture-multi--tenant-orange)
![License](https://img.shields.io/badge/license-MIT-green)

A **generic, multi-tenant, role-based service scheduling and care management platform** designed for healthcare and service domains such as **HomeCare, Physiotherapy, Clinics, Shops, and Field Service Providers**.

The system is **domain-agnostic**, **configurable before bootstrap**, and built for **scalability, auditability, and financial compliance**.

---

## 🚀 Key Highlights

* Generic & reusable platform architecture
* Role-based scheduling with centralized governance
* Real-time location tracking & proximity matching
* Integrated payments with UPI & third-party funds
* Multi-tenant dashboards & reporting
* Config-driven design (Redis-based, pre-bootstrap)
* Audit-ready & compliance-friendly

---

## 🧠 Core Roles

| Role                                    | Description                                              |
| --------------------------------------- | -------------------------------------------------------- |
| **Receiver**                            | Patient, Clinic, Shop, or any entity receiving a service |
| **Provider**                            | Physio, Nurse, Service Person, Shop, or Service Entity   |
| **Centralized Control / Senior Physio** | Authority for approval, monitoring, settlement           |
| **Admin**                               | Configuration, role control, slot activation             |

---

## ⏱️ Time Slot & Scheduling System

* Configurable operating window
  **Default:** `08:00 AM – 06:00 PM`
* Default session duration: **1 hour**
* Each **Receiver** and **Provider**:

  * Maintains independent availability
  * Supports multiple sessions per day
* Dynamic slot generation & display
* Slot availability can be:

  * Activated / deactivated by **Admin**
  * Cancelled by **Receiver**, **Provider**, or **Centralized Control**
* Full booking & cancellation history with **mandatory reason tracking**

---

## 🛂 Appointment Governance

* All appointments are governed by:

  * **Senior Physio / Centralized Control**
* Central authority can:

  * Approve or override bookings
  * Monitor conflicts
  * Manage operational flow

---

## 📍 Location Tracking & Matching Algorithm

* Receivers & Providers continuously update location
* Assumption: Provider travels **by vehicle**
* System calculates:

  * Distance
  * Estimated time to reach
* Matching algorithm identifies:

  * **Closest Provider ↔ Receiver**
* Used during scheduling and optimization

---

## 🔐 Authentication & Multi-Tenancy

* Account creation via **OTP**

  * SMS
  * WhatsApp
* Fully **multi-tenant**

  * Scoped by `tenantId`
  * Central dashboards update dynamically per tenant

---

## 🧾 Outcome & Review System

* After session completion:

  * Receiver / Provider submits **Outcome**
* Outcome triggers:

  * Alerts to Centralized Control
  * Outcome-based review updates
* Review parameters:

  * Configurable via Web / App
  * Loaded **before NestJS bootstrap** for generic behavior

---

## 💳 Payment & Settlement Workflow

### Session Payments

* Post-session **UPI payment prompt**
* Payment status tracked:

  * Success
  * Failure
* Daily closing:

  * Centralized Control closes daily payments
* **By 09:00 PM**:

  * Centralized settlement to all Receivers & Providers

---

### 🏦 Insurance / Third-Party / Charity Funds

* Separate accounts for:

  * Insurance
  * Third-party sponsors
  * Charity funds
* Centralized Control can:

  * Transfer funds to Receivers / Providers
* Full traceability & audit logs maintained

---

## 📊 Financial Reports & Compliance

* Daily / Weekly / Monthly revenue reports
* Monthly & Yearly balance sheets
* **Salary slips**
* **ITR-ready reports**
* Separate tax & exemption reports for:

  * Insurance
  * Third-party
  * Charity transactions

---

## 📈 Dashboards

### Centralized Control Dashboard

* Active Receivers & Providers
* Today + one-week availability view
* Booking & cancellation overview
* Revenue analytics:

  * Daily
  * Weekly
  * Yearly
* ITR-ready summaries

---

## 🔔 Notifications

Push notifications for:

* Appointment scheduled
* Appointment cancelled
* Appointment rescheduled
* Payment success
* Payment failure

---

## 🧾 Audit & Traceability

* Immutable audit logs for:

  * Create / Update / Delete Receiver
  * Create / Update / Delete Provider
  * Create / Update / Cancel Appointments
* Tenant-scoped audit trails

---

## 🧩 Configuration & Architecture

* Role definitions stored in **Redis**
* Configuration loaded **before NestJS bootstrap**
* Domain created dynamically per tenant
* Enables:

  * Generic design
  * Domain reuse
  * Zero hard-coding

---

## 🛠️ Tech Stack

* **Backend:** NestJS
* **Database:** PostgreSQL
* **Cache / Config:** Redis
* **Containerization:** Docker
* **Gateway:** NGINX
* **Auth:** OTP (SMS / WhatsApp)
* **Payments:** UPI + Third-Party Providers

---

## 📐 Design Principles

* Domain-agnostic
* Role-driven
* Multi-tenant by default
* Config-first (pre-bootstrap)
* Audit-ready & compliance-friendly
* Scalable & extensible

---


