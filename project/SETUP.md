# Setup & Installation Guide

## Quick Start Options

### Fastest: Open Standalone HTML File
No installation needed! Simply:
1. Extract the files
2. Double-click `standalone.html`
3. Start using the app immediately

**Best for**: Quick testing, demos, sharing via email

---

## Option 1: Development Mode (Local Server)

### Prerequisites
- Node.js 16 or higher
- npm (comes with Node.js)

### Steps

1. **Navigate to project directory**
   ```bash
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Development URL: `http://localhost:5173`
   - The app will auto-reload on file changes

### Development Commands
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Option 2: Production Build

### Steps

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Outputs in `dist/` folder**
   - All files are optimized and minified
   - Ready for production deployment

3. **Serve locally**
   ```bash
   # Using Python 3
   python -m http.server 8000 --directory dist

   # Or using Node's http-server
   npx http-server dist
   ```

4. **Open in browser**
   - `http://localhost:8000`

---

## Option 3: Docker Deployment

### Prerequisites
- Docker installed

### Steps

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN npm install
   RUN npm run build
   EXPOSE 5173
   CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
   ```

2. **Build Docker image**
   ```bash
   docker build -t duality-ai-space-monitor .
   ```

3. **Run container**
   ```bash
   docker run -p 5173:5173 duality-ai-space-monitor
   ```

4. **Access app**
   - Open `http://localhost:5173`

---

## Option 4: Cloud Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repo
   - Deploy (auto-detected Vite setup)

### Netlify

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Drag & drop `dist/` folder to Netlify**
   - Or connect GitHub for auto-deployment

### GitHub Pages

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy `dist/` to GitHub Pages**
   - Enable Pages in repository settings
   - Set source to `dist/` folder

---

## File Structure

```
.
├── index.html                 # Main HTML (dev mode)
├── standalone.html            # Self-contained version
├── README.md                  # Documentation
├── SETUP.md                   # This file
├── package.json               # Dependencies
├── package-lock.json          # Lock file
├── vite.config.ts             # Build configuration
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
├── eslint.config.js           # Linting rules
│
├── src/                       # Source files
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main component
│   └── index.css             # Styles
│
├── dist/                      # Production build (after npm run build)
│   ├── index.html
│   ├── assets/
│   └── ...
│
└── node_modules/             # Dependencies (after npm install)
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3000
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Classes Not Working
```bash
# Rebuild Tailwind
npm run build
```

### Font Not Loading
- Check internet connection (Google Fonts needed)
- For offline use, download fonts locally

### Build Fails
```bash
# Check TypeScript errors
npm run typecheck

# Check linting
npm run lint

# Rebuild from scratch
rm -rf dist
npm run build
```

---

## Environment Variables

Currently not required, but you can add them for future features:

1. **Create `.env` file**
   ```
   VITE_API_URL=https://api.example.com
   VITE_APP_TITLE=Duality AI Space Monitor
   ```

2. **Use in code**
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

---

## Performance Tips

### Development
- Use `npm run dev` for fast refresh
- DevTools are automatically enabled
- Check Network tab for load times

### Production
- Run `npm run build` to minimize
- Check `dist/` folder size
- Use CDN for hosting
- Enable gzip compression on server

### Optimization Checklist
- [ ] Images are optimized
- [ ] Unused CSS is removed
- [ ] JavaScript is minified
- [ ] Caching headers configured
- [ ] Gzip compression enabled

---

## Browser Testing

### Desktop
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile
- iOS Safari 14+
- Chrome Mobile
- Firefox Mobile
- Samsung Internet

### Testing Across Browsers
```bash
# Build first
npm run build

# Start local server
npx http-server dist

# Test at http://localhost:8080
```

---

## Security Considerations

- ✓ No sensitive data stored locally
- ✓ All computation client-side
- ✓ No external API calls (by default)
- ✓ CSP headers recommended for deployment

### For Production
1. Set security headers in your server
2. Use HTTPS
3. Enable CORS if needed
4. Keep dependencies updated

---

## Getting Help

- Check README.md for feature documentation
- Review inline code comments
- Check browser console for errors (F12)
- Test with different browsers
- Verify Node.js and npm versions

---

## Next Steps

1. ✓ Choose your deployment option
2. ✓ Follow the setup steps
3. ✓ Test in browser
4. ✓ Deploy to production
5. ✓ Monitor performance

---

**Last Updated**: 2025-11-25
**Maintained by**: Duality AI Team
