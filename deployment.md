# Cloudflare Deployment Guide: Jelvan Online Books Store

This guide provides professional, step-by-step instructions for deploying and hosting the **Jelvan Online Books Store** web application using **Cloudflare Pages** (for fast global static asset delivery) and **Cloudflare Workers / Pages Functions** (if you choose to add server-side databases or API integrations).

---

## 🚀 Step 1: Prepare the Codebase

Ensure that your repository contains no build-breaking warnings and has a clean, standard configuration.

1. **Verify Local Compiles**:
   Run the build script in your terminal to ensure everything bundles cleanly into the static `/dist` directory:
   ```bash
   npm run build
   ```
2. **Commit and Push to Git**:
   Push your fully hand-cleaned source files to a public or private repository on **GitHub** or **GitLab**:
   ```bash
   git init
   -b main
   git add .
   git commit -m "Initialize professional Jelvan books web application"
   git remote add origin https://github.com/your-username/jelvan-books.git
   git push -u origin main
   ```

---

## ⚡ Step 2: Deploy to Cloudflare Pages (Frontend)

Cloudflare Pages provides global CDN routing, fast asset compression, and free automated SSL.

1. **Log into Cloudflare**:
   Navigate to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and authorize your account.
2. **Access Workers & Pages**:
   - Go to **Workers & Pages** in the left sidebar directory.
   - Click **Create App** or **Create Application**.
   - Select the **Pages** tab, then click **Connect to Git**.
3. **Select Your Repository**:
   - Authorized Cloudflare to access your GitHub or GitLab profile.
   - Pick the target repository `jelvan-books`.
4. **Configure Build Settings**:
   Fill out the app configuration according to these precise parameters:
   
   | Field | Value |
   | :--- | :--- |
   | **Framework Preset** | `Vite` |
   | **Build Command** | `npm run build` |
   | **Build Output Directory** | `dist` |
   | **Root Directory** | `/` |

5. **Environment Variables**:
   Under **Environment Variables (Advanced)**, optionally declare the standard mode parameter:
   - `NODE_ENV` = `production`
   
6. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare will clone your repository, install npm dependencies, build the Vite compilation layer, and serve your app globally. Your platform will be live at `https://jelvan-books.pages.dev` in under two minutes!

---

## 🪐 Step 3: Optional Cloudflare Pages Functions (Full-Stack Backend)

If you plan to connect server-side elements like a **relational database (D1 SQL)** or state sync APIs, you can natively leverage **Pages Functions**:

1. **Create a `functions` Directory**:
   In your root workspace directory, create a folder named `functions`. Any routing files added here automatically compiled with Cloudflare's serverless edge compiler:
   ```
   ├── dist/
   ├── functions/
   │   └── api/
   │       ├── books.ts      # Cloudflare worker route for catalog queries
   │       └── orders.ts     # Pages function processing secure payments & database syncs
   └── src/
   ```
2. **Connect a Cloudflare D1 Database**:
   - Go to **Workers & Pages** → **D1 (SQL Databases)** dashboard.
   - Click **Create Database** (e.g. named `jelvan_books_db`).
   - Copy your `database_id` and paste it inside your `wrangler.toml` custom config:
     ```toml
     [[d1_databases]]
     binding = "DB"
     database_name = "jelvan_books_db"
     database_id = "your-cloudflare-d1-unique-id"
     ```

---

## 🛠️ Step 4: Troubleshooting & Custom Domain Setup

- **SPA Routing Redirect Rule**: Since the bookstore is a single-screen responsive router client layout, you must configure a redirection fallback to prevent standard `404 Not Found` messages on subpath refreshes.
  - Create a public redirect manifest file at `/public/_redirects`:
    ```
    /*    /index.html   200
    ```
- **Custom Domains**:
  - Open the **Pages app dashboard** inside Cloudflare.
  - Choose **Custom Domains** and choose **Set up a custom domain**.
  - Enter your official client domain (e.g. `books.jelvan.com`). Cloudflare will automatically set up secure CNAME parameters in your DNS settings.
