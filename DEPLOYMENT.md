# Deployment Guide for onlybots.cam

This guide covers deploying the **onlybots.cam** static site to multiple hosting platforms.

## 📋 Pre-deployment Checklist

- [ ] Code is committed to git repository
- [ ] `astro.config.mjs` has `output: 'static'` (✅ already configured)
- [ ] Test production build locally: `npm run test:build`
- [ ] All external links have proper `rel="noopener noreferrer"`
- [ ] Statistics in `src/data/` have valid source URLs

## 🔧 Platform Deployment

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Excellent Astro support
- Built-in performance optimization
- Easy custom domain setup
- Automatic SSL certificates

**Deployment Steps:**

1. **Install Vercel CLI (optional):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Git Integration:**
   - Connect your GitHub/GitLab repository to Vercel
   - Vercel automatically detects Astro and uses `vercel.json` config
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js version: 18.x

3. **Deploy via CLI:**
   ```bash
   npm run build
   vercel --prod
   ```

4. **Custom Domain Setup:**
   - Add domain in Vercel dashboard: **onlybots.cam**
   - Configure DNS records:
     ```
     A    @    76.76.19.19
     A    www  76.76.19.19
     ```
   - SSL is automatic via Let's Encrypt

**Configuration:** [vercel.json](vercel.json) ✅ included

---

### Option 2: Netlify

**Why Netlify:**
- Great for static sites
- Excellent form handling (if needed later)
- Built-in A/B testing
- Strong security features

**Deployment Steps:**

1. **Deploy via Git:**
   - Connect repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

2. **Deploy via CLI:**
   ```bash
   npm i -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Custom Domain Setup:**
   - Add domain in Netlify dashboard: **onlybots.cam**
   - Configure DNS:
     ```
     ALIAS/ANAME    @      apex-loadbalancer.netlify.com
     CNAME          www    onlybots.netlify.app
     ```
   - SSL is automatic

**Configuration:** [netlify.toml](netlify.toml) + [_redirects](_redirects) ✅ included

---

### Option 3: Cloudflare Pages

**Why Cloudflare:**
- Global CDN with excellent performance
- DDoS protection
- Strong security features
- Good for controversial content (better than some platforms)

**Deployment Steps:**

1. **Deploy via Git:**
   - Connect repository to Cloudflare Pages
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 18

2. **Deploy via Wrangler CLI:**
   ```bash
   npm i -g wrangler
   npm run build
   npx wrangler pages publish dist
   ```

3. **Custom Domain Setup:**
   - Transfer domain to Cloudflare (recommended)
   - Or point nameservers to Cloudflare
   - Add custom domain in Pages dashboard
   - SSL/TLS mode: **Full (strict)**

**Configuration:** [wrangler.toml](wrangler.toml) + [public/_headers](public/_headers) ✅ included

---

## 🌐 Domain Setup: onlybots.cam

### DNS Configuration

**For Vercel:**
```
Type    Name    Value
A       @       76.76.19.19
A       www     76.76.19.19
```

**For Netlify:**
```
Type         Name    Value
ALIAS/ANAME  @       apex-loadbalancer.netlify.com
CNAME        www     onlybots.netlify.app
```

**For Cloudflare Pages:**
- Transfer domain to Cloudflare (preferred)
- Or use Cloudflare nameservers:
  ```
  ns1.cloudflare.com
  ns2.cloudflare.com
  ```

### SSL/TLS Configuration

- **All platforms provide automatic SSL via Let's Encrypt**
- Force HTTPS redirects (configured in platform settings)
- HSTS headers included in security configuration
- SSL/TLS mode: **Full (strict)** for Cloudflare

---

## 🔒 Security Configuration

All platforms include comprehensive security headers:

### Security Headers Applied
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info
- `Permissions-Policy` - Disables camera, microphone, geolocation
- `Content-Security-Policy` - Restricts resource loading
- `Strict-Transport-Security` - Forces HTTPS

### Additional Security
- **No tracking cookies** (privacy-focused analytics only)
- **Minimal external dependencies**
- **Static site** = reduced attack surface
- **No user data collection**

---

## 📊 Performance Optimization

### Caching Strategy
- **Static assets (`/_astro/*`, `/images/*`):** 1 year cache
- **Fonts (`*.woff2`):** 1 year cache
- **HTML:** No cache (for content updates)

### Build Optimization
- Astro automatic code splitting
- Tailwind CSS purging
- Asset compression
- Tree-shaking for unused JavaScript

---

## 🧪 Testing Production Build

**Local testing:**
```bash
# Test the complete build process
npm run test:build

# Or step by step
npm run clean
npm run build
npm run preview
```

**Check for:**
- [ ] All pages load correctly
- [ ] GSAP animations work
- [ ] Statistics display properly
- [ ] External links open in new tabs
- [ ] Console errors are resolved
- [ ] Mobile responsiveness

---

## 🔧 Environment Variables

**Required:** None - the site works without environment variables

**Optional:**
```bash
# Analytics (if implemented)
PLAUSIBLE_DOMAIN=onlybots.cam
UMAMI_WEBSITE_ID=your-umami-id

# Debug mode for development
PUBLIC_DEBUG_MODE=1
```

See [.env.example](.env.example) for complete list.

---

## 🚨 Troubleshooting

### Common Issues

**Build fails with "Module not found":**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**GSAP animations don't work in production:**
- Check that `client:load` directives are present on React components
- Verify no console errors in production build

**404 errors on page refresh:**
- Ensure SPA redirects are configured (✅ included in all platform configs)

**Security headers not applied:**
- Verify platform-specific config files are present
- Check deployment logs for configuration errors

### Deployment Verification

After deployment, test:

1. **SSL Certificate:** https://www.ssllabs.com/ssltest/
2. **Security Headers:** https://securityheaders.com/
3. **Performance:** https://pagespeed.web.dev/
4. **Mobile Compatibility:** https://search.google.com/test/mobile-friendly

---

## 📞 Support

**For deployment issues:**
- Check platform-specific documentation
- Review build logs in deployment dashboard
- Test locally with `npm run test:build`

**For content/legal concerns:**
- All statistics are sourced in [RESEARCH.md](RESEARCH.md)
- Project methodology documented in [SPEC.md](SPEC.md)
