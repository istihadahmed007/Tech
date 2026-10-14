# PostgreSQL Setup & Migration Guide

This application defaults to an embedded, transactional SQLite database (`data/store.db`) with WAL mode and ACID transactions out-of-the-box on Node 22+.

For cloud deployments and multi-instance environments requiring a distributed relational database, full PostgreSQL support is provided via the SQL migration schema in `server/db/schema.sql`.

---

## 1. Local PostgreSQL Setup (Docker)

To run PostgreSQL locally with Docker:

```bash
docker run -d \
  --name tech-accessories-postgres \
  -e POSTGRES_USER=store_user \
  -e POSTGRES_PASSWORD=store_secure_password_123 \
  -e POSTGRES_DB=tech_accessories \
  -p 5432:5432 \
  postgres:16-alpine
```

---

## 2. Running Migrations

Execute the migration script against your PostgreSQL instance using `psql`:

```bash
psql -h localhost -U store_user -d tech_accessories -f server/db/schema.sql
```

Or connect via any database GUI (DBeaver, TablePlus, pgAdmin) and execute `server/db/schema.sql`.

---

## 3. Environment Variable Configuration

Update your `.env` file to connect to PostgreSQL:

```env
DATABASE_URL="postgres://store_user:store_secure_password_123@localhost:5432/tech_accessories"
DATABASE_SSL="false"
```

---

## 4. Preserved Schema Features

- **Transactional Orders**: Order items snapshot current pricing, variant titles, and product descriptions at the time of purchase.
- **Inventory Audit Logging**: Every stock change is permanently tracked with quantity deltas, timestamps, and reason.
- **Inventory Reservations**: 15-minute lease locks on checkout prevent overselling during checkout and payment gateway sessions.
- **Verified Reviews**: Strict unique constraint and delivered order verification prevents fake reviews.
- **Rate Limiting**: IP and credential rate-limiting table prevents brute-force attempts.
