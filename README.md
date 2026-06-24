# ⚔️ BFrost - Management app
**🔗 Live site:** https://b-frost-management.vercel.app

![quest log / in battle / cleared columns of manga-styled task cards](https://i.imgur.com/Fhk7h74.png)

---

## What it does

- **Create quests** — title, details, owner, rarity (priority), and a deadline.
- **Three columns** — move a quest between **Quest Log**, **In Battle**, and **Cleared**. Drag it, or use the ◀ ▶ arrows. The move sticks after refresh.
- **Assign an owner** — pick a party member; they show as an avatar chip on the card.
- **Persists** — to Supabase when configured, otherwise to your browser's localStorage so the board works the instant you clone it.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (Postgres) for storage
- **Vercel** for hosting

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

With no env keys it runs in **local save** mode (localStorage). To use the real database, see below.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Project Settings → API** → copy the Project URL and the `anon` public key.
4. Copy `.env.local.example` to `.env.local` and fill them in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Restart `npm run dev`. The tag in the header flips to **SAVING TO SUPABASE**.
