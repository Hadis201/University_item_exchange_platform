import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Smartphone, BookOpen, Armchair, Bike, Shirt, Trophy, Package,
  Users, Globe2, ShieldCheck, ArrowRight, Sparkles, Zap, Search
} from 'lucide-react';
import { cn } from '../lib/utils';

const Home = () => {
  const categories = [
    { name: "Electronics", icon: <Smartphone className="h-8 w-8" />, link: "/category/electronics", color: "bg-blue-100 text-blue-600", span: "md:col-span-2" },
    { name: "Books & Notes", icon: <BookOpen className="h-8 w-8" />, link: "/category/books", color: "bg-amber-100 text-amber-600", span: "" },
    { name: "Furniture", icon: <Armchair className="h-8 w-8" />, link: "/category/furniture", color: "bg-orange-100 text-orange-600", span: "" },
    { name: "Vehicles", icon: <Bike className="h-8 w-8" />, link: "/category/cycles", color: "bg-zinc-100 text-zinc-600", span: "" },
    { name: "Fashion", icon: <Shirt className="h-8 w-8" />, link: "/category/clothing", color: "bg-rose-100 text-rose-600", span: "" },
    { name: "Sports", icon: <Trophy className="h-8 w-8" />, link: "/category/sports", color: "bg-emerald-100 text-emerald-600", span: "" },
    { name: "Others", icon: <Package className="h-8 w-8" />, link: "/category/others", color: "bg-indigo-100 text-indigo-600", span: "md:col-span-2" }
  ];

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community First',
      description: 'Exclusive to SUST. Verified students only, ensuring a safe and trusted marketplace.',
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: 'Sustainability',
      description: 'Join the circular economy. Reduce waste by giving pre-loved items a second home.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'Secure Exchange',
      description: 'Chat directly with peers, meet on campus, and transact with complete confidence.',
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 transform opacity-10">
          <div className="h-[500px] w-[500px] rounded-full bg-primary blur-3xl filter" />
        </div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4 transform opacity-10">
          <div className="h-[500px] w-[500px] rounded-full bg-emerald-600 blur-3xl filter" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>The Official SUST Marketplace</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl"
            >
              Buy & Sell within your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Campus Community</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            >
              The smartest way to exchange text books, gadgets, furniture, and more.
              Safe, simple, and exclusively for SUSTians.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/products"
                className="group flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-primary/40"
              >
                <Search className="h-5 w-5" />
                Explore Items
              </Link>
              <Link
                to="/sell"
                className="group flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-8 text-base font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-accent"
              >
                <Zap className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                List an Item
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl border border-border bg-muted/50 p-8 transition-all hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-xl hover:shadow-black/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-card shadow-sm ring-1 ring-border group-hover:text-primary group-hover:ring-primary/20">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Categories */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Browse Categories</h2>
              <p className="mt-2 text-muted-foreground">Find exactly what you're looking for.</p>
            </div>
            <Link to="/products" className="group hidden items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 sm:flex">
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px]">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={cat.link}
                className={cn(
                  "relative group overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1",
                  cat.span
                )}
              >
                <div className={cn(
                  "absolute right-4 top-4 rounded-full p-3 opacity-20 transition-opacity group-hover:opacity-100",
                  cat.color.replace('text-', 'bg-').replace('100', '50')
                )}>
                  {React.cloneElement(cat.icon, { className: cn("h-6 w-6", cat.color.split(' ')[1]) })}
                </div>

                <div className="flex h-full flex-col justify-end">
                  <div className={cn("mb-2 w-fit rounded-lg p-2 transition-colors", cat.color)}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-green-700 px-6 py-20 shadow-2xl sm:px-12 sm:py-32">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
                    <rect width="100%" height="100%" fill="none" />
                    <path d="M0 0h8v8h-8z" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              </svg>
            </div>

            {/* Glowing orbs for depth */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to declutter your dorm?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-emerald-100">
                Join thousands of students turning their unused items into extra cash.
                It takes less than 2 minutes to list an item on the official SUST marketplace.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/signup"
                  className="rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-all hover:scale-105 hover:bg-zinc-50 hover:shadow-xl focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary"
                >
                  Get Started Now
                </Link>
                <Link
                  to="/products"
                  className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;