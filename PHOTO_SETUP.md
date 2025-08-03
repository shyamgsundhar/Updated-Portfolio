# Photo Integration Instructions

## Adding Your Profile Photo

To add your personal photo to the portfolio:

### 1. Prepare Your Photo
- **Format**: Use JPEG or PNG format
- **Size**: Recommended minimum 400x400 pixels (square aspect ratio works best)
- **Quality**: High resolution for crisp display
- **File size**: Keep under 1MB for optimal loading

### 2. Add the Photo
1. Place your photo in the `assets/images/` folder
2. Name it `profile.jpg` or `profile.png`
3. Update the HTML in `index.html`:

**Find this line (around line 80):**
```html
<div class="profile-photo placeholder">Your Photo Here</div>
```

**Replace it with:**
```html
<img src="assets/images/profile.jpg" alt="Shyam Sundhar G" class="profile-photo">
```

### 3. Alternative: Use a Placeholder Service
If you don't have a photo ready, you can use a placeholder:
```html
<img src="https://via.placeholder.com/280x280/667eea/ffffff?text=SG" alt="Shyam Sundhar G" class="profile-photo">
```

### 4. Styling Notes
- The photo will automatically be styled as a circle
- It includes a floating animation
- The gradient border provides a modern look
- Responsive sizing is already configured

### 5. Testing
After adding your photo:
1. Open the portfolio in your browser
2. Check that the photo displays correctly
3. Test on mobile devices for responsiveness
4. Verify the animation works smoothly

## Current Theme Features

### Light/Dark Mode Toggle
- **Toggle Button**: Located in the top navigation
- **Icons**: Sun icon for dark mode, moon icon for light mode
- **Storage**: Theme preference is saved in localStorage
- **Smooth Transitions**: CSS transitions for seamless switching

### Theme Colors
- **Dark Mode**: Deep backgrounds with bright text
- **Light Mode**: Clean white/light backgrounds with dark text
- **Accent Colors**: Consistent gradient and primary colors across both themes

### Usage
- Click the theme toggle button in the navigation
- The theme will switch immediately
- Your preference is remembered for future visits
- The icon updates to reflect the current theme state
