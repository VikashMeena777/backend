import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

dotenv.config();
const SALT = 10;

const category1 = [
    "Universe & Space Reels Bundle",
    "Hot Girls Reels Bundle",
    "Natural HD Reels Bundle",
    "Gym & Fitness Reels Bundle",
    "Sanatan Dharm Reels Bundle",
    "AI Tech Reels Bundle",
    "AI Islamic Reels Bundle",
    "AI Health Reels Bundle",
    "AI Fitness Reels Bundle",
    "Art & Craft Reels Bundle",
    "Luxury Lifestyle Reels Bundle",
    "Zig & Sharko Cartoon Reels Bundle",
    "2D Animation Cartoon Reels Bundle",
    "Tools & Tips Reels Bundle",
    "Satisfying Reels Bundle",
    "Woodwork Reels Bundle",
    "Cute Girls Omegle Reels Bundle",
    "Kapil Sharma Show Reels Bundle",
    "Art Reels Bundle",
    "Cricket Reels Bundle",
    "Viral Facts Reels Bundle",
    "Movie Clips Reels Bundle",
    "Earning Tips Reels Bundle",
    "Shark Tank Reels Bundle",
    "AI Motivational Reels Bundle",
    "HQ Motivational Reels Bundle",
    "Anime Reels Bundle",
    "Trading & Stock Market Reels Bundle",
    "Aesthetic Music Reels Bundle",
    "Business Tips Reels Bundle",
    "Gym Girls Motivational Reels Bundle",
    "Instagram Viral Reel Bundle",
    "AI Hindi Story Reels Bundle",
    "Trending AI Reels Bundle",
    "Car Collection Reels Bundle",
    "AI Creature Reels Bundle",
    "Scenery Reels Bundle",
    "Movie Recap Reels Bundle",
    "Tarak Mehta Reels Bundle",
    "Momoy Oh My God Reels Bundle",
    "Sigma Male Reels Bundle",
    "Big Boss Reels Bundle",
    "Viral Nature Reels Bundle",
    "AI Viral Monk Reels Bundle",
    "Male Fitness Reels Bundle",
    "Bike Reels Bundle",
    "Other Paid Reels Collections (Premium)"
];

const category2 = [
    "250+ AI Monkey Vlogs",
    "250+ AI Cat Story Bundle",
    "150+ AI Live News Reporting",
    "250+ Paatal Lok AI Videos",
    "500+ Glass Cutting Satisfying Reels",
    "1500+ Glowing Motion Graphics Videos",
    "1000+ AI Storytelling Shorts",
    "3000+ Anime Edits (Action, Romance & More)",
    "250+ Mad Scientist Motivational Videos",
    "13,000+ Luxury Reels (Watches, Cars, Lifestyle)",
    "5000+ Car Edit Shorts (Speed, Drift, Cinematic)",
    "5000+ Sanatan Dharma AI Reels (Spiritual & Powerful)",
    "3000+ Emotional Viral Clips Bundle",
    "2000+ Gym & Fitness Motivation Shorts",
    "1000+ 2D Animation Shorts Bundle",
    "1000+ Marvelous AI Reels Bundle",
    "500+ AI Reel Bundle",
    "1460+ Funny Fails Bundle",
    "1500+ Aesthetic Reels Bundle",
    "2000+ Satisfying Reels Bundle",
    "30,000 Exclusive Viral Reels Bundle",
    "250+ Cartoon Explain Bundle",
    "500+ Movie Explain Bundle",
    "Sigma Male Reel Bundle"
];

const category3 = [
    { title: "Instagram Growth Mastery", price: 299 },
    { title: "Reels Monetization Blueprint", price: 299 },
    { title: "AI Tools for Creators", price: 299 },
    { title: "Personal Branding on Instagram", price: 299 },
    { title: "Digital Products Selling Formula", price: 299 }
];

const servicesList = [
    { title: "Video Editing", shortDesc: "Professional editing for Instagram Reels, YouTube Shorts & ads", price: 599, image: "https://picsum.photos/seed/service1/800/600" },
    { title: "Thumbnail Designing", shortDesc: "Eye-catching thumbnails to boost CTR", price: 299, image: "https://picsum.photos/seed/service2/800/600" },
    { title: "Story Writing (Scripts)", shortDesc: "Viral-ready scripts for short videos", price: 499, image: "https://picsum.photos/seed/service3/800/600" },
    { title: "Copywriting", shortDesc: "High-converting copy and captions", price: 599, image: "https://picsum.photos/seed/service4/800/600" },
    { title: "Social Media Management", shortDesc: "Complete account management", price: 4999, image: "https://picsum.photos/seed/service5/800/600" },
    { title: "Instagram Growth Services", shortDesc: "Proven organic growth strategies", price: 4499, image: "https://picsum.photos/seed/service6/800/600" },
    { title: "Reel Creation & Editing", shortDesc: "End-to-end reel production", price: 599, image: "https://picsum.photos/seed/service7/800/600" },
    { title: "Thumbnail + Title Optimization", shortDesc: "SEO-optimized titles & thumbnails", price: 399, image: "https://picsum.photos/seed/service8/800/600" },
    { title: "AI Content Creation", shortDesc: "AI-assisted captions, scripts and packs", price: 699, image: "https://picsum.photos/seed/service9/800/600" },
    { title: "Graphic Designing", shortDesc: "Premium social posts & branding", price: 299, image: "https://picsum.photos/seed/service10/800/600" },
    { title: "Branding & Logo Design", shortDesc: "Custom logos & brand identity", price: 599, image: "https://picsum.photos/seed/service11/800/600" },
    { title: "Course Creation & E-book Design", shortDesc: "Course and e-book production", price: 2999, image: "https://picsum.photos/seed/service12/800/600" },
    { title: "Website Building", shortDesc: "Responsive websites & SEO-friendly", price: 5999, image: "https://picsum.photos/seed/service13/800/600" },
    { title: "YouTube Channel Automation", shortDesc: "Full YouTube automation", price: 6999, image: "https://picsum.photos/seed/service14/800/600" },
    { title: "Paid Ads Management", shortDesc: "High-converting ad campaigns", price: 5999, image: "https://picsum.photos/seed/service15/800/600" },
    { title: "Content Strategy & Consultation", shortDesc: "Personalized growth strategy", price: 1999, image: "https://picsum.photos/seed/service16/800/600" }
];

async function seed(drop = false) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding');

    if (drop) {
        await Product.deleteMany({});
        await Service.deleteMany({});
        await User.deleteMany({});
        console.log('Dropped products/services/users');
    }

    // seed services
    await Service.insertMany(servicesList);
    console.log('Services seeded:', servicesList.length);

    // products cat1
    const cat1Docs = category1.map((title, idx) => ({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: 'Reels Bundles',
        price: 99,
        shortDesc: `${title} — Ready-to-use reels bundle with full resell rights.`,
        thumbnailUrl: `https://picsum.photos/seed/reel${idx}/400/300`,
        tags: ['reels', 'bundle'],
        featured: false
    }));

    // products cat2
    const cat2Docs = category2.map((title, idx) => ({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: 'Premium Mega Reels',
        price: 149,
        shortDesc: `${title} — Mega reels bundle, high volume and premium content.`,
        thumbnailUrl: `https://picsum.photos/seed/mega${idx}/400/300`,
        tags: ['mega', 'bundle'],
        featured: false
    }));

    // courses cat3
    const cat3Docs = category3.map((c, idx) => ({
        title: c.title,
        slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: 'Courses',
        price: c.price,
        shortDesc: `${c.title} — Course coming soon.`,
        thumbnailUrl: `https://picsum.photos/seed/course${idx}/400/300`,
        tags: ['course'],
        featured: false
    }));

    const extraFeatured = [
        { title: 'Premium Reel Bundle', slug: 'premium-reel-bundle', category: 'Reels Bundles', price: 149, shortDesc: 'Premium curated reels pack.', thumbnailUrl: 'https://picsum.photos/seed/premium1/400/300', tags: ['premium'], featured: true },
        { title: 'Instagram Growth Mastery', slug: 'instagram-growth-mastery', category: 'Courses', price: 299, shortDesc: 'Master Instagram growth', thumbnailUrl: 'https://picsum.photos/seed/insta-growth/400/300', tags: ['course'], featured: true },
        { title: 'Reels Bundle', slug: 'reels-bundle', category: 'Reels Bundles', price: 99, shortDesc: 'A popular reels bundle', thumbnailUrl: 'https://picsum.photos/seed/reelsbundle/400/300', tags: ['reels'], featured: true }
    ];

    const allProducts = [...extraFeatured, ...cat1Docs, ...cat2Docs, ...cat3Docs];
    await Product.insertMany(allProducts);
    console.log('Products seeded:', allProducts.length);

    // admin + demo users
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@xprmediaagency.com';
    const adminPass = 'XprAdmin@2025';
    const demoEmail = 'demo@xprmediaagency.com';
    const demoPass = 'Demo@1234';

    const adminHash = await bcrypt.hash(adminPass, SALT);
    const demoHash = await bcrypt.hash(demoPass, SALT);

    await User.create({ name: 'Admin', email: adminEmail, passwordHash: adminHash, role: 'admin', emailVerified: true });
    await User.create({ name: 'Demo User', email: demoEmail, passwordHash: demoHash, role: 'user', emailVerified: true });

    console.log('Admin created:', adminEmail, '/', adminPass);
    console.log('Demo created:', demoEmail, '/', demoPass);

    console.log('Seeding finished');
    process.exit(0);
}

const args = process.argv.slice(2);
const drop = args.includes('--drop');

seed(drop).catch(err => {
    console.error('Seed error', err);
    process.exit(1);
});
