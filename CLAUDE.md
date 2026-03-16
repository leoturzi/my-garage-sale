# My Garage Sale

## Supabase

- **Project ID:** `seswpytxueftfgvipzcb`
- **Region:** `eu-central-1`
- Always use this project ID when calling Supabase MCP tools — no need to list projects.

## Gotchas

### Supabase direct connection is IPv6-only
The default Supabase direct connection string (`db.<ref>.supabase.co`) uses IPv6. Most local networks and platforms like Vercel are IPv4-only, so DNS won't resolve it. Use the **Session pooler** connection string instead:
```
postgresql://postgres.<ref>:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
```
Find it in the Supabase dashboard via the **Connect** button at the top → select **Session mode**.

### Node version
This project requires **Node 22** (see `.nvmrc`). Run `nvm use` before running commands.
