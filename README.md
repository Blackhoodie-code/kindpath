# Kind Path Care Services — Website

A Node.js (Express + EJS) website for **Kind Path Care Services**, built around the
brand card provided (purple/navy/rose-gold palette, "Compassion. Respect. Dignity."
tagline, "We care. You matter." motto, and the heart/path/tree brand artwork).

## Running it

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

The port can be changed with the `PORT` environment variable:

```bash
PORT=4000 npm start
```

## Project structure

```
server.js              Express app + routes + business/content data
views/                  EJS templates
  index.ejs             Home page
  services.ejs           Full services page
  about.ejs              About / philosophy page
  contact.ejs             Contact page with a working form (POST /contact)
  partials/               Shared header, footer, <head>, and SVG icon sprite
public/
  css/style.css           All styling (design tokens live at the top as CSS variables)
  js/main.js              Mobile nav toggle + scroll-reveal animations
  images/                 Brand artwork, cropped from the uploaded card
                          (logo mark, tree-and-path illustration, hands photo)
```

## Editing site content

All business details (name, phone, email, address, services, testimonials,
process steps, and brand values) live in a single object at the top of
`server.js`. Update that object and the templates will reflect the change
everywhere automatically — no need to hunt through HTML.

## Sending contact form emails

The contact form on `/contact` sends an email to `info@kindpathservices.ca`
(the value in the `business.email` field in `server.js`) using
[Nodemailer](https://nodemailer.com/). To activate real sending, set these
environment variables before starting the server:

```bash
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
npm start
```

Any standard SMTP provider works (Gmail, Outlook 365, SendGrid, Mailgun,
Postmark, your host's own mail server, etc.) — just plug in its host, port,
and login. Until these variables are set, submitted messages are logged to
the server console instead of emailed, so nothing is lost during local
testing, and the visitor still sees the "message received" confirmation.

## Notes

- No database is used; each submission is emailed directly rather than
  stored. Add a database call inside `app.post('/contact', ...)` in
  `server.js` if you also want a saved record of every inquiry.
- Fonts (Playfair Display, Alex Brush, Mulish) are loaded from Google Fonts.
