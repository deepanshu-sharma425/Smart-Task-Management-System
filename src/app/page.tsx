'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef } from 'react';
import {
  Layout,
  Users,
  Clock,
  Shield,
  ChevronRight,
  Zap,
  Target,
  CheckCircle2,
  ArrowRight,
  Star,
  Quote,
} from 'lucide-react';
import Link from 'next/link';
import BackgroundShapes from './components/BackgroundShapes';
import ParallaxSection from './components/ParallaxSection';
import AnimatedCard from './components/AnimatedCard';

const features = [
  {
    icon: Users,
    title: 'Team Management',
    description: 'Build your team, assign roles, and manage members from a single admin dashboard.',
    color: 'bg-blue-600/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Target,
    title: 'Task Assignment',
    description: 'Create tasks with priorities and deadlines, then assign them to specific team members.',
    color: 'bg-violet-600/10 text-violet-600 dark:text-violet-400',
  },
  {
    icon: Clock,
    title: 'Deadline Tracking',
    description: 'Visual deadline indicators with overdue alerts keep your team on schedule.',
    color: 'bg-amber-600/10 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Admin and member roles ensure everyone sees exactly what they need.',
    color: 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400',
  },
];

const stats = [
  { value: '99%', label: 'Uptime' },
  { value: '10x', label: 'Faster' },
  { value: '24/7', label: 'Available' },
  { value: '100+', label: 'Teams' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Engineering Lead at Vercel',
    text: 'TaskForge transformed how our engineering team manages sprints. The deadline tracking alone saved us hours every week.',
    rating: 5,
    initials: 'SC',
    color: 'bg-blue-600',
  },
  {
    name: 'Marcus Rivera',
    role: 'Product Manager at Stripe',
    text: 'The role-based access control is exactly what we needed. Admins get full visibility while team members stay focused on their tasks.',
    rating: 5,
    initials: 'MR',
    color: 'bg-violet-600',
  },
  {
    name: 'Priya Patel',
    role: 'CTO at Notion',
    text: 'Clean, fast, and beautifully designed. TaskForge is the best task management tool we have used for our distributed team.',
    rating: 5,
    initials: 'PP',
    color: 'bg-emerald-600',
  },
  {
    name: 'James O\'Brien',
    role: 'Startup Founder',
    text: 'As a founder wearing many hats, TaskForge keeps my small team organized without unnecessary complexity. Highly recommended.',
    rating: 4,
    initials: 'JO',
    color: 'bg-amber-600',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], [0, -160]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120]">
      <BackgroundShapes count={15} />

      {/* ─── Hero Section ─── */}
      <section id="hero" ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Parallax floating shapes */}
        <motion.div
          style={{ y: floatY1 }}
          className="absolute top-20 left-[10%] w-72 h-72 bg-blue-600/8 dark:bg-blue-500/8 rounded-full"
        />
        <motion.div
          style={{ y: floatY2 }}
          className="absolute top-40 right-[15%] w-48 h-48 bg-violet-600/8 dark:bg-violet-500/8 rounded-3xl rotate-45"
        />
        <motion.div
          style={{ y: floatY3 }}
          className="absolute bottom-20 left-[20%] w-32 h-32 bg-emerald-600/6 dark:bg-emerald-500/6 rounded-2xl"
        />

        {/* Decorative dots */}
        <motion.div
          style={{ y: floatY2 }}
          className="absolute top-32 right-[30%] grid grid-cols-5 gap-3"
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600/15 dark:bg-blue-400/15" />
          ))}
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-20"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                Smart Task Management
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight"
            >
              Manage your team.{' '}
              <span className="text-blue-600">Deliver results.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl"
            >
              TaskForge gives admins the power to build teams, assign tasks with deadlines,
              and track progress — all in a beautifully crafted interface.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
              <Link href="/signup">
                <motion.span
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-colors shadow-xl shadow-blue-600/25"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/login">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/50 transition-colors"
                >
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Stats Bar ─── */}
      <ParallaxSection speed={0.2} id="stats">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <AnimatedCard
                key={stat.label}
                delay={i * 0.1}
                className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-6 text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-blue-600">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                  {stat.label}
                </p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* ─── Features Section ─── */}
      <ParallaxSection speed={0.15} id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedCard hover={false} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Everything you need to{' '}
              <span className="text-blue-600">lead your team</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Built with precision for admins who demand the best workflow tools.
            </p>
          </AnimatedCard>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <AnimatedCard
                key={feature.title}
                id={`feature-${i}`}
                delay={i * 0.1}
                className="group bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* ─── How It Works ─── */}
      <ParallaxSection speed={0.1} id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedCard hover={false} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              How it <span className="text-blue-600">works</span>
            </h2>
          </AnimatedCard>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Team', desc: 'Sign up as admin and add team members to your workspace.', icon: Users },
              { step: '02', title: 'Assign Tasks', desc: 'Create tasks with priorities and deadlines, assign to members.', icon: Target },
              { step: '03', title: 'Track Progress', desc: 'Monitor task completion and team performance in real-time.', icon: CheckCircle2 },
            ].map((item, i) => (
              <AnimatedCard
                key={item.step}
                id={`step-${item.step}`}
                delay={i * 0.15}
                className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800"
              >
                <span className="text-6xl font-black text-slate-100 dark:text-slate-800 absolute top-4 right-6">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* ─── Testimonials Section ─── */}
      <ParallaxSection speed={0.1} id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedCard hover={false} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Loved by <span className="text-blue-600">teams everywhere</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              See what teams are saying about managing their workflow with TaskForge.
            </p>
          </AnimatedCard>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <AnimatedCard
                key={testimonial.name}
                delay={i * 0.12}
                className="group relative bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all overflow-hidden"
              >
                {/* Decorative quote */}
                <Quote className="absolute top-4 right-4 w-10 h-10 text-slate-100 dark:text-slate-800 group-hover:text-blue-100 dark:group-hover:text-blue-900/30 transition-colors" />

                <div className="relative z-10">
                  {/* Stars */}
                  <StarRating rating={testimonial.rating} />

                  {/* Quote text */}
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${testimonial.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-black">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* ─── CTA Section ─── */}
      <section id="cta" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedCard
            hover={false}
            className="bg-blue-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mt-24" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32" />
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/10 rounded-full" />
            <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-white/8 rounded-full" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                Ready to forge your workflow?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join TaskForge today and transform how your team collaborates.
              </p>
              <Link href="/signup">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl"
                >
                  Start For Free
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">TaskForge</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 TaskForge. Built with Next.js, TypeScript & SOLID principles.
          </p>
        </div>
      </footer>
    </div>
  );
}
