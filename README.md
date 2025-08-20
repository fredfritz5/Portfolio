# Portfolio Website with Admin Panel

A modern, responsive portfolio website with a comprehensive admin panel for content management. Built with vanilla HTML, CSS, and JavaScript, featuring GSAP animations and localStorage persistence.

## 🚀 Features

### Public Portfolio
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Modern UI**: Clean, glassy card aesthetic with soft shadows and rounded corners
- **GSAP Animations**: Subtle hover effects and scroll-triggered entrance animations
- **Hero Section**: Professional photo, animated skills preview, and call-to-action buttons
- **Projects Showcase**: Grid layout with modal demos supporting YouTube/Vimeo videos
- **Skills Dashboard**: Animated progress bars with customizable colors
- **Contact Form**: mailto fallback with serverless integration options
- **Theme Support**: Light/dark mode toggle with custom color schemes

### Admin Panel (`/admin.html`)
- **Password Protection**: Client-side authentication with SHA-256 hashing
- **Content Management**: Full CRUD operations for all portfolio content
- **Photo Upload**: Professional photo management with base64 storage
- **Skills Editor**: Add/edit/delete skills with proficiency sliders and color pickers
- **Project Manager**: Complete project management with thumbnail and video support
- **Theme Customization**: Live color scheme editor with preview
- **Data Persistence**: localStorage with import/export JSON functionality
- **Draft System**: Save/publish workflow for content changes

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Animations**: GSAP 3.12.2 (via CDN)
- **Storage**: localStorage for data persistence
- **Styling**: Custom CSS with CSS variables for theming
- **Icons**: Unicode emojis for lightweight icons

## 📁 Project Structure

```
/
├── index.html              # Main portfolio page
├── admin.html              # Admin panel
├── css/
│   ├── styles.css          # Main stylesheet
│   └── admin.css           # Admin-specific styles
├── js/
│   ├── app.js              # Main application logic
│   └── admin.js            # Admin panel functionality
├── assets/
│   ├── default-photo.jpg   # Default profile photo
│   ├── favicon.ico         # Site favicon
│   └── apple-touch-icon.png # Apple touch icon
├── data/
│   └── default-content.json # Default portfolio content
└── README.md               # This file
```

## 🚀 Quick Start

### Local Development
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Access the admin panel at `/admin.html`
4. Default admin password: `admin123`

### Vercel Deployment

#### Option 1: Drag & Drop
1. Zip the entire project folder
2. Go to [Vercel](https://vercel.com)
3. Drag and drop the zip file
4. Your site will be live instantly!

#### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

#### Option 3: Git Integration
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically on every push

### Custom Domain & Redirects
Create a `vercel.json` file for clean URLs:

```json
{
  "redirects": [
    {
      "source": "/admin",
      "destination": "/admin.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

## 🔧 Configuration

### First-Time Setup
1. **Change Default Password**: Access `/admin.html` and immediately change the default password in Settings
2. **Update Content**: Replace default content with your information
3. **Upload Photo**: Add your professional photo in the Hero section
4. **Customize Theme**: Adjust colors and theme preferences
5. **Add Projects**: Create your project portfolio with demos and links

### Content Management
- **General**: Site title, description, and SEO metadata
- **Hero**: Main title, subtitle, and professional photo
- **About**: Rich text content with HTML support
- **Skills**: Add/edit skills with proficiency levels and colors
- **Projects**: Manage project portfolio with thumbnails and demo videos
- **Contact**: Update contact information and social links
- **Theme**: Customize color scheme and default theme mode

### Data Backup
- Use **Export Data** to download your content as JSON
- Use **Import Data** to restore or migrate content
- Regular backups recommended before major changes

## 🎨 Customization

### Color Scheme
The site uses CSS custom properties for easy theming:
```css
:root {
  --primary: #3B82F6;
  --secondary: #14B8A6;
  --accent: #F97316;
  /* ... more colors */
}
```

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add corresponding styles to `css/styles.css`
3. Update navigation in both files
4. Add admin controls in `admin.html` if needed

### Animation Customization
GSAP animations can be modified in `js/app.js`:
```javascript
// Example: Modify hero animation timing
gsap.from('.hero-title', {
  duration: 1.5,  // Increase duration
  y: 100,         // Increase distance
  opacity: 0,
  ease: 'back.out(1.7)'  // Change easing
});
```

## 📧 Contact Form Integration

### Current Setup
- Uses `mailto:` links as fallback
- Pre-fills subject and message content
- Works with any email client

### Serverless Integration Options

#### Formspree
1. Sign up at [Formspree](https://formspree.io)
2. Create a new form and get your endpoint
3. Update the form action in `index.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

#### Netlify Forms
1. Deploy to Netlify
2. Add `netlify` attribute to form:
```html
<form netlify name="contact">
```

#### EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com)
2. Add EmailJS SDK to `index.html`
3. Update form handler in `js/app.js`

## 🔒 Security Considerations

### ⚠️ Important Security Notice
**This admin authentication is CLIENT-SIDE and intended only for personal portfolio use. It is NOT secure for production admin scenarios with sensitive data.**

### Current Security Features
- Password hashing with SHA-256 + salt
- Session-based authentication
- Input validation and sanitization
- XSS protection for user content

### Production Security Recommendations

#### Option 1: Serverless Backend
Replace localStorage with secure backend:
- **Authentication**: Vercel serverless functions with environment variables
- **Storage**: Vercel KV or AWS S3 for media, PostgreSQL for data
- **Security**: Server-side password hashing, JWT tokens, CORS protection

#### Option 2: Git-based CMS
- **Netlify CMS**: Git-based content management
- **Forestry**: Git-based CMS with live preview
- **Decap CMS**: Open-source Git-based CMS

#### Option 3: Headless CMS
- **Strapi**: Self-hosted headless CMS
- **Contentful**: Cloud-based headless CMS
- **Sanity**: Real-time headless CMS

## 📊 Analytics Integration

### Google Analytics
Uncomment and configure in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics
Add to `<head>` in `index.html`:
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🎯 SEO Optimization

### Current SEO Features
- Semantic HTML structure
- Meta tags for description and social sharing
- Open Graph and Twitter Card support
- Proper heading hierarchy
- Alt text for images
- Clean URL structure

### Additional SEO Recommendations
1. **Sitemap**: Generate `sitemap.xml` for search engines
2. **Robots.txt**: Create robots.txt for crawler instructions
3. **Schema Markup**: Add structured data for rich snippets
4. **Performance**: Optimize images and enable compression
5. **Core Web Vitals**: Monitor and optimize loading performance

## ♿ Accessibility

### Current Accessibility Features
- Semantic HTML elements
- ARIA labels and attributes
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG 2.1 AA)
- Reduced motion support
- Screen reader friendly

### Accessibility Testing Checklist
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify keyboard-only navigation
- [ ] Check color contrast ratios
- [ ] Test with high contrast mode
- [ ] Validate HTML semantics
- [ ] Test form accessibility
- [ ] Verify focus management

## 📱 Mobile Testing Checklist
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify touch targets (44px minimum)
- [ ] Test landscape/portrait orientations
- [ ] Check form usability on mobile
- [ ] Verify image loading and sizing
- [ ] Test navigation menu functionality

## 🔄 Upgrade Paths

### Database Integration
Replace localStorage with a proper database:

1. **Supabase Integration**
   - Set up Supabase project
   - Create tables for portfolio data
   - Implement Row Level Security (RLS)
   - Update JavaScript to use Supabase client

2. **Firebase Integration**
   - Set up Firebase project
   - Configure Firestore database
   - Implement authentication
   - Update JavaScript to use Firebase SDK

### Advanced Features
- **Blog Section**: Add a blog with markdown support
- **Analytics Dashboard**: Track visitor statistics
- **Contact Form Backend**: Process form submissions
- **Image Optimization**: Automatic image compression and WebP conversion
- **PWA Features**: Service worker, offline support, app manifest
- **Multi-language Support**: Internationalization (i18n)

## 🐛 Troubleshooting

### Common Issues

#### Admin Panel Not Loading
- Check browser console for JavaScript errors
- Verify all files are in correct locations
- Clear browser cache and localStorage

#### Images Not Displaying
- Verify image file paths are correct
- Check file permissions
- Ensure images are under 5MB limit

#### Animations Not Working
- Check if GSAP CDN is loading
- Verify `prefers-reduced-motion` settings
- Check browser console for errors

#### Data Not Persisting
- Check if localStorage is enabled
- Verify browser storage limits
- Clear corrupted localStorage data

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Features Used**: CSS Grid, Flexbox, CSS Custom Properties, ES6+
- **Fallbacks**: Graceful degradation for older browsers

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
1. Check this README for common solutions
2. Review browser console for error messages
3. Test in different browsers
4. Check network requests in developer tools

---

**Remember**: Change the default admin password immediately after deployment!