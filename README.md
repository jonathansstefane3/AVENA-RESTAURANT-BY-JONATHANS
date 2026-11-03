# AVENA Restaurant Website

A responsive three-page website for AVENA, a grain-led restaurant. The front end is plain HTML, CSS and JavaScript. A small Node server (no npm packages) serves the site and saves bookings and contact messages.

## Pages

- **Home** (`index.html`): hero, photo gallery, menu with category tabs, booking form
- **Our story** (`about.html`): the restaurant's story and how it cooks
- **Contact** (`contact.html`): address, opening hours, contact form and an embedded Google Map

## Requirements

Node.js 18 or newer.

## Run it

```bash
npm start
```

Open http://localhost:3000. Use `PORT=8080 npm start` to change the port. `npm run dev` restarts the server when files change.

## Project structure

```
avena/
├── package.json
├── server.js                 Static server, POST /api/reservations, POST /api/messages
├── data/                     Created on first use (git-ignored)
│   ├── reservations.json
│   └── messages.json
└── public/
    ├── index.html
    ├── about.html
    ├── contact.html
    ├── css/styles.css
    ├── js/app.js
    ├── images/               Gallery and page illustrations
    └── data/
        ├── menu.json         Menu content and currency symbol
        └── gallery.json      Gallery images, captions and alt text
```

## Customise

- **Photos:** the included images in `public/images/` are illustrations that stand in for photography. Add your own JPG or WebP files to that folder, then edit `public/data/gallery.json` (`src`, `alt`, `caption`). Gallery images display at a 4:3 ratio. The image on the story page is set in `about.html`.
- **Google Map:** in `contact.html`, replace the `q=` value in the iframe `src` and in the "Open in Google Maps" link with your address, with spaces written as `+`. The embed needs no API key.
- **Menu and prices:** edit `public/data/menu.json`. Change `currency` to your own symbol or code, such as `"UGX "`.
- **Address, phone, email and hours:** these appear in `contact.html` and in the footer of every page.
- **Colours and fonts:** change the variables at the top of `public/css/styles.css`.
- **Booking times:** adjust `min` and `max` on the time input in `index.html`.

## Forms

`POST /api/reservations` accepts `name`, `email`, `date`, `time`, `guests` (1 to 12) and optional `notes`. `POST /api/messages` accepts `name`, `email` and `message`. Valid requests are appended to the matching file in `data/`. The server does not send emails, so connect a mail service if you want automatic confirmations or notifications.

If you host only the `public/` folder on static hosting, both forms save requests in the visitor's browser (localStorage) instead. Replace that fallback with a form service or your own API before going live.

## Deploy

Any host that runs Node (Render, Railway, Fly.io, a VPS) can run `npm start`. For static-only hosting such as Netlify, publish the `public/` folder and connect the forms to a form service.

## License

MIT
