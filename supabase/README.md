# Supabase integration (next milestone)

The current application runs without Supabase so it can be opened and tested immediately.

For the production backend:
1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
3. Add SQL migrations for profiles, stores, products, inventory, orders, order_items, deliveries and status history.
4. Enable RLS on all exposed tables and write least-privilege policies.
5. Move checkout and inventory mutations into trusted server-side functions/transactions.
6. Replace demo role preview with Supabase Auth and verified role claims.

Never put a Supabase service-role or secret key in a `NEXT_PUBLIC_` variable or client-side code.
