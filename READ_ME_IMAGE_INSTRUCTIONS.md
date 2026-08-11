# 🖼️ How to Add Your Custom Product Photography

Welcome to **Shraviko Sacred Living**! The website currently uses high-end, custom-crafted brass vector artwork frames as placeholders, as requested.

## 🚀 Adding Your Images

You can add your images in **two simple ways**:

---

### Option 1: Edit `src/data/products.js` (Recommended)

Open `src/data/products.js` and update the `image` field for any product or category:

```javascript
{
  id: 'shraviko-brass-thali-01',
  name: 'Royal Astha Lakshmi Brass Pooja Thali Set',
  image: '/images/thali.jpg', // 👈 Paste your image path or URL here
  ...
}
```

---

### Option 2: Place Files in Public Folder

1. Create a folder named `images` inside the `public/` directory (`e:\Brand website\public\images\`).
2. Add your image files (e.g. `thali.png`, `diya.jpg`, `incense.png`, `copper.png`).
3. Reference them in `src/data/products.js` as `/images/thali.png`.

---

### 🎨 Automatic Fallback

Whenever an `image` field is left empty (`""`) or if an image URL cannot be loaded, **Shraviko Sacred Living** automatically renders the custom **Brass Vector Artwork** frame with gold foil details!
