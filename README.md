# LocalLoop — Hyperlocal Delivery Management Platform

A runnable portfolio MVP for a local delivery platform, built with Next.js, React, TypeScript and CSS. It includes customer shopping, a cart and demo checkout, store inventory, order operations, delivery status updates, and an admin overview.

## Requirements

- Node.js 20.9 or later (a current supported LTS release is recommended)
- npm
- Visual Studio Code (recommended)

## Run on Windows / PowerShell

1. Extract `localloop-delivery-platform.zip`.
2. Open the extracted `localloop-delivery-platform` folder in VS Code.
3. Choose **Terminal → New Terminal**.
4. Check the terminal is in the folder containing `package.json`.
5. Install dependencies:

   ```powershell
   npm install
   ```

6. Start the development server:

   ```powershell
   npm run dev
   ```

7. Open http://localhost:3000 in your browser.

Keep the terminal open while using the app. Press `Ctrl+C` to stop the server.

## Included features

- Responsive dashboard UI
- Admin, Customer, Store and Delivery role preview
- Product catalogue, search and category filters
- Add-to-cart and quantity controls
- Demo checkout creates orders and adjusts stock
- Product creation in the store inventory
- Order status progression
- Local browser persistence using `localStorage`
- Order overview metrics and illustrative chart
- No external API keys required for the demo

## Important limitations

This is a **frontend demo MVP**, not a production-ready multi-user delivery backend. Demo records persist in the current browser only. The role selector is a UI preview, not real authentication or authorization. The chart values are illustrative. Checkout does not take payment. Do not use this version for real customer data or live transactions.

A production version should connect Supabase/PostgreSQL, implement server-side authentication and Row Level Security (RLS), validate stock and order transitions on the server, add payment-provider webhooks, and use authenticated delivery assignments before deployment.

## Useful commands

```powershell
npm run dev
npm run build
npm start
npm run lint
```

## Suggested GitHub screenshots

Capture the admin overview, customer product catalogue, cart, store inventory, and order status table. Remove any personal information before publishing.
