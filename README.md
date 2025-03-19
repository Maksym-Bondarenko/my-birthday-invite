# 🎂 My Birthday Invitation Website

A modern, interactive birthday invitation website built with Next.js, featuring beautiful animations, sound effects, and a Tinder-like photo gallery.

## ✨ Features

- 🎨 **Beautiful Design**
  - Gradient backgrounds
  - Glassmorphic UI elements
  - Smooth animations and transitions
  - Responsive layout for all devices

- 🎵 **Interactive Elements**
  - Hover and click sound effects
  - Confetti animations
  - Sparkle effects
  - Click-to-grow photo frame

- 📸 **Photo Gallery**
  - Tinder-like swipe interface
  - Grid view of all photos
  - Full-screen photo viewer
  - Smooth transitions

- 📝 **RSVP Form**
  - Guest information collection
  - Dietary preferences
  - Beverage preferences
  - Arrival time selection
  - Fun fact sharing

- ⏰ **Countdown Timer**
  - Real-time countdown to the party
  - Dynamic updates
  - Beautiful display

- 🔗 **Useful Links**
  - Party location
  - Spotify playlist
  - Telegram chat
  - Birthday wishlist

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-birthday-invite.git
cd my-birthday-invite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Sound Effects**: Howler.js
- **Confetti**: canvas-confetti
- **Photo Swipe**: react-tinder-card
- **Analytics**: Vercel Analytics
- **Performance**: Vercel Speed Insights

## 📁 Project Structure

```
my-birthday-invite/
├── src/
│   └── app/
│       ├── page.tsx            # Main invitation page (root route)
│       ├── photos/
│       │   └── photos_page.tsx # Photo gallery page
│       ├── not-found.tsx       # 404 error page
│       └── globals.css         # Global styles
├── public/
│   └── images/                # Party photos
└── package.json
```

## 🎨 Customization

1. **Photos**: Add your photos to the `public/images/` directory
2. **Colors**: Modify the gradient colors in `globals.css`
3. **Sounds**: Update sound URLs in the sound configuration
4. **Party Details**: Update date, time, and location in `page.tsx`

## 🌐 Deployment

The site is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Deploy with one click

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interactions
- Optimized for mobile viewing
- Native time picker support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for the animations
- [Howler.js](https://howlerjs.com/) for the sound effects
- [canvas-confetti](https://www.kirilv.com/canvas-confetti/) for the confetti effects
