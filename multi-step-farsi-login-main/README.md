# Multi-Step Login Form

A modern, responsive multi-step login form built with HTML, CSS, and JavaScript. Originally designed for Farsi (Persian) users but now fully converted to English with left-to-right (LTR) layout.

## Features

### 🔐 Multiple Login Methods
- **Classic Login**: Email + Password + Two-Factor Authentication
- **Passwordless Login**: SMS Code, Email Code, or Magic Link
- **Quick Login**: Social authentication with Google and Apple

### 🎨 Modern UI/UX
- Clean, minimalist design
- Dark/Light theme toggle
- Smooth animations and transitions
- Responsive design for all screen sizes
- Step-by-step progress indicator

### ⚡ Interactive Elements
- Real-time form validation
- OTP (One-Time Password) input with auto-focus
- Password visibility toggle
- Loading states and error handling
- Resend timer for codes and links

## Demo

![Login Form Preview](https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Multi-Step+Login+Form)

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, customizable icons

## Getting Started

### Prerequisites
- A modern web browser
- No additional dependencies required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/multi-step-login-form.git
```

2. Navigate to the project directory:
```bash
cd multi-step-login-form
```

3. Open `index.html` in your web browser:
```bash
# Using Python (if installed)
python -m http.server 8000

# Or simply double-click index.html
```

## Project Structure

```
multi-step-login-form/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
├── styles.css          # Custom CSS styles
└── README.md          # Project documentation
```

## Usage

### Flow Selection
The application starts with a flow selection screen where users can choose their preferred login method:

1. **Classic Login** (4 steps):
   - Email/Phone input
   - Password entry
   - OTP verification
   - Success confirmation

2. **Passwordless Login** (4 steps):
   - Email/Phone input
   - Method selection (SMS/Email/Magic Link)
   - Code verification or link confirmation
   - Success confirmation

3. **Quick Login** (3 steps):
   - Social provider selection
   - Password entry (if needed)
   - Success confirmation

### Features in Detail

#### Form Validation
- Real-time email/phone validation
- Password strength requirements
- OTP format validation
- Error messages with visual feedback

#### Theme Support
- Toggle between light and dark themes
- Theme preference saved in localStorage
- Smooth transitions between themes

#### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface

## Customization

### Colors
The color scheme can be customized in the Tailwind configuration within `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',    // Main brand color
                success: '#10B981',    // Success state color
                destructive: '#EF4444' // Error state color
            }
        }
    }
}
```

### Styling
Custom styles can be added to `styles.css` or by modifying the Tailwind classes in the HTML.

### Functionality
The JavaScript code is modular and easy to extend. Key functions include:
- `startFlow()`: Initialize login flow
- `validateEmail()`: Email/phone validation
- `handleOTPInput()`: OTP input handling
- `socialLogin()`: Social authentication

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icon set
- [Inter Font](https://rsms.me/inter/) for the typography

## Changelog

### v2.0.0
- Converted from Farsi to English
- Changed layout from RTL to LTR
- Updated all text content and UI elements
- Improved accessibility and user experience

### v1.0.0
- Initial release with Farsi support
- Multi-step login flows
- Theme toggle functionality
- Responsive design

---

**Note**: This project was originally designed for Farsi users but has been fully converted to English with proper LTR layout for international use.
