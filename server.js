require('dotenv').config();

const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Contact form emails are sent through this transporter. Configure it with
// real SMTP credentials via environment variables (see README.md). Until
// those are set, submissions are logged to the console instead of sent.
const mailConfigured = !!(
  process.env.SMTP_HOST && 
  process.env.SMTP_PORT &&
  process.env.SMTP_USER && 
  process.env.SMTP_PASS
);

const transporter = mailConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const business = {
  name: 'Kind Path Care Services',
  tagline: 'Compassion. Respect. Dignity.',
  motto: 'We care. You matter.',
  phone: '(438) 773-6626',
  phoneHref: 'tel:+14387736626',
  email: 'info@kindpathservices.ca',
  //address: ['123 Caring Way, Suite 100', 'Yourtown, ST 12345'],
  website: 'www.kindpathcareservices.ca',
  values: [
    { label: 'Compassionate', icon: 'heartHands' },
    { label: 'Reliable', icon: 'people' },
    { label: 'Trustworthy', icon: 'shield' },
    { label: 'Personalized Care', icon: 'house' }
  ],
  services: [
    {
      title: 'Companionship Care',
      copy: 'A familiar face for conversation, meals, and errands, so the client feel less alone and more engaged.',
      icon: 'companion'
    },
    {
      title: 'Personal Support Care',
      copy: 'Help with bathing, dressing, and daily routines, delivered with the kind of patience that protects dignity, not just schedules.',
      icon: 'personal'
    },
    {
      title: 'Respite Care',
      copy: 'Short-term relief for family caregivers who need a weekend, a week, or just an afternoon to breathe.',
      icon: 'respite'
    },
    {
      title: 'Live-In & 24/7 Care',
      copy: 'Around-the-clock support from a caregiver who learns the household, not just the checklist.',
      icon: 'liveIn'
    },
    {
      title: "Alzheimer's & Dementia Care",
      copy: 'Steady, specialized support for families navigating memory loss, built on routine and reassurance.',
      icon: 'memory'
    },
    {
      title: 'Skilled Nursing Support',
      copy: 'Licensed nursing care for medication management, wound care, and clinical needs, at home.',
      icon: 'nursing'
    }
  ],
  testimonials: [
    {
      quote: "The team treated my father like family from the first visit. He finally looks forward to mornings again.",
      name: 'Renee M.'
    },
    {
      quote: "They matched us with a caregiver who understood my mother's routine within days. It changed everything for our family.",
      name: 'Daniel O.'
    },
    {
      quote: "I was drowning as the only caregiver for my husband. Kind Path gave me back a few hours a week to just be his wife again.",
      name: 'Priya S.'
    }
  ],
  process: [
    {
      title: 'We Listen',
      copy: 'A no-pressure conversation about your family, your worries, and what support would actually look like.'
    },
    {
      title: 'We Match',
      copy: 'A caregiver chosen for fit, not just availability, introduced before care ever begins.'
    },
    {
      title: 'We Walk Alongside You',
      copy: 'Regular check-ins and an open line to our team, for as long as the path requires.'
    }
  ]
};

app.get('/', (req, res) => {
  res.render('index', { business, active: 'home' });
});

app.get('/services', (req, res) => {
  res.render('services', { business, active: 'services' });
});

app.get('/about', (req, res) => {
  res.render('about', { business, active: 'about' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { business, active: 'contact', submitted: false, error: false });
});

app.post('/contact', async (req, res) => {
  const { name, phone, email, relation, message } = req.body;

  const mailBody = [
    `New message from the Kind Path website contact form.`,
    ``,
    `Name: ${name || '—'}`,
    `Phone: ${phone || '—'}`,
    `Email: ${email || '—'}`,
    `Who needs care: ${relation || '—'}`,
    ``,
    `Message:`,
    message || '—'
  ].join('\n');

  const mailOptions = {
    from: process.env.SMTP_USER || `"Kind Path Website" <${business.email}>`,
    to: business.email,
    replyTo: email,
    subject: `New contact form submission from ${name || 'a website visitor'}`,
    text: mailBody
  };

  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
    } else {
      // No SMTP credentials configured yet — log so nothing is lost during setup/testing.
      console.log('--- Contact form submission (SMTP not configured, not sent) ---');
      console.log(mailBody);
      console.log('--- end submission ---');
    }
    res.render('contact', { business, active: 'contact', submitted: true, error: false });
  } catch (err) {
    console.error('Failed to send contact form email:', err);
    res.render('contact', { business, active: 'contact', submitted: false, error: true });
  }
});

app.listen(PORT, () => {
  console.log(`Kind Path Care Services site running at http://localhost:${PORT}`);
});
