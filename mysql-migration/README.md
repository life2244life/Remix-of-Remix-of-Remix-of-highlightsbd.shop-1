# MySQL Migration Files

Ei folder e MySQL database er sob file rakha ache. cPanel + phpMyAdmin diye shop setup korar jonno.

## Folder Structure

```
mysql-migration/
├── README.md              ← Eta (instructions)
├── 01-schema.sql          ← 24 ta table create (sob structure)
├── 02-seed-data.sql       ← Default data (admin user, settings, zones)
└── 03-sample-products.sql ← (Optional) test products
```

---

## Setup Steps (cPanel)

### 1. Database Banao
- cPanel → **MySQL Databases**
- Create database: `myshop_db`
- Create user + strong password
- User ke database e **ALL PRIVILEGES** dao

### 2. Schema Import
- cPanel → **phpMyAdmin** → database select
- **Import** tab → `01-schema.sql` choose → **Go**
- ✅ 24 ta table create hobe

### 3. Seed Data Import
- Same way te `02-seed-data.sql` import koro
- Eta default settings, delivery zones, admin role enum add korbe

### 4. (Optional) Sample Products
- Test korte chaile `03-sample-products.sql` import koro

---

## Important Notes

| Topic | Note |
|---|---|
| **UUID** | MySQL e `CHAR(36)` use kora hoyeche, `UUID()` function diye auto-generate |
| **JSON columns** | PostgreSQL `jsonb` → MySQL `JSON` (e.g. `items`, `colors`, `size_chart`) |
| **Arrays** | PostgreSQL `text[]` → MySQL `JSON` array (e.g. `sizes`, `filter_categories`) |
| **Auth** | Supabase auth nai — `auth_users` table banano hoyeche, password hash backend e korte hobe |
| **RLS** | MySQL e RLS nai — access control PHP/Node backend code e korte hobe |
| **Storage** | File upload (product images) cPanel `/public_html/uploads/` folder e PHP diye |

---

## Next Phase (Code Side)

Ei MySQL database use korte hole frontend rewrite + PHP/Node backend lagbe:

1. **PHP REST API** banano (`/api/products.php`, `/api/orders.php`, etc.)
2. **Auth system** (login/signup/JWT)
3. **Image upload script** (PHP)
4. **Frontend rewrite** — `supabase.from(...)` calls → `fetch('/api/...')`

User confirm korar por porer step e ei kaaj shuru hobe.
