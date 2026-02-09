# High-Scale Energy Ingestion Engine (NestJS + PostgreSQL)

## Overview

This project implements a high-scale telemetry ingestion engine for a smart energy and EV fleet platform. The system ingests two independent telemetry streams every minute from Smart Meters (AC grid side) and EV Vehicles (DC battery side). It validates, classifies, stores, and analyzes this telemetry to support real-time dashboard queries and historical analytics.

The architecture is designed for write-heavy ingestion and read-efficient analytics, and is fully containerized using Docker.

---

## Telemetry Streams

Two different payload types are received every minute:

### Meter Stream (AC Grid Side)
- meterId
- kwhConsumedAc
- voltage
- timestamp

Represents total AC energy consumed from the grid.

### Vehicle Stream (DC Battery Side)
- vehicleId
- soc
- kwhDeliveredDc
- batteryTemp
- timestamp

Represents energy actually delivered to the battery and battery health metrics.

---

## Polymorphic Ingestion Design

A single ingestion endpoint is used:

POST /v1/telemetry/ingest

The ingestion layer inspects the payload:

- If `meterId` exists → processed as Meter telemetry
- If `vehicleId` exists → processed as Vehicle telemetry
- Otherwise → rejected as invalid

This polymorphic routing keeps the ingestion layer simple and extensible while supporting multiple telemetry schemas.

---

## Data Correlation Strategy

For analytics, AC energy (meter) must be compared with DC energy (vehicle) to compute efficiency.

For this assessment implementation, correlation is handled using the assumption:

vehicleId == meterId

This allows direct correlation between meter and vehicle streams without an additional mapping table.

In a production system, this would be replaced with a dedicated mapping table such as:

device_mapping(vehicle_id, meter_id)

This would allow many-to-one or one-to-many relationships between meters and vehicles.

---

## Database Architecture: Hot vs Cold Storage

To support both high write throughput and fast reads, the database is split into two storage tiers.

### Cold Store — Historical Tables (Append Only)

Tables:
- meter_history
- vehicle_history

Characteristics:
- INSERT only
- Stores every telemetry record
- Provides full audit trail
- Optimized for time-range analytics
- Composite indexes on (deviceId, timestamp)

Example indexes:
- (meterId, timestamp)
- (vehicleId, timestamp)

These indexes ensure analytical queries do not require full table scans.

---

### Hot Store — Current State Tables

Tables:
- meter_current
- vehicle_current

Characteristics:
- One row per device
- Stores latest known state
- Updated using UPSERT
- Optimized for dashboard reads
- Avoids scanning historical tables for current status

---

## Insert vs Upsert Logic

Two persistence paths are used for every ingestion event:

### History Path (Cold)
Operation: INSERT  
Reason: Preserve every telemetry record for audit and analytics.

### Live Path (Hot)
Operation: UPSERT on primary key  
Reason: Maintain only the most recent state per device for fast lookup.

This separation prevents write contention and keeps read queries fast.

---

## Handling 14.4 Million Records Per Day

Expected load:

- 10,000 devices
- 1 record per minute
- 2 telemetry streams

Calculation:

10,000 × 60 × 24 × 2 = 28.8M events/day (worst case)  
Per stream ≈ 14.4M rows/day

The system handles this scale through:

- Append-only history tables (no updates → minimal locking)
- Narrow table schemas
- Batch-friendly INSERT pattern
- Indexed time-range queries
- UPSERT only on small current-state tables
- No analytics queries executed on hot tables
- No dashboard queries executed on history tables
- Composite indexes to support time-window filtering

Analytics queries always filter by:
- deviceId
- timestamp range (last 24 hours)

This ensures index scans instead of full table scans even at large scale.

---

## Analytics Endpoint

GET /v1/analytics/performance/:vehicleId

Returns last 24-hour summary:
- Total AC energy consumed
- Total DC energy delivered
- Efficiency ratio (DC / AC)
- Average battery temperature

Query design:
- Filter by vehicleId
- Filter by timestamp >= now() − 24 hours
- Uses indexed columns

This keeps analytics queries efficient even with very large historical tables.

---

## Technology Stack

- NestJS (TypeScript)
- PostgreSQL
- TypeORM
- Docker
- docker-compose

---

## How to Run

Build and start services:

docker compose up --build

API runs on:

http://localhost:3000

---

## Example API Calls

Meter ingestion:

POST /v1/telemetry/ingest

{
  "meterId": "V100",
  "kwhConsumedAc": 12.5,
  "voltage": 230,
  "timestamp": "2026-02-09T18:00:00Z"
}

Vehicle ingestion:

POST /v1/telemetry/ingest

{
  "vehicleId": "V100",
  "soc": 60,
  "kwhDeliveredDc": 10.2,
  "batteryTemp": 34,
  "timestamp": "2026-02-09T18:00:00Z"
}

Analytics:

GET /v1/analytics/performance/V100

---

## Summary

This ingestion engine is designed for high-frequency telemetry workloads using:

- Polymorphic ingestion
- Hot and cold data separation
- Insert vs upsert persistence strategy
- Indexed analytical queries
- Containerized deployment

The architecture supports large daily write volumes while maintaining fast analytical and dashboard performance.

