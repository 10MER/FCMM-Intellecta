"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  MessageCircle, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  Lightbulb,
  User as UserIcon,
  LogOut
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const features = [
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      description: "Get instant answers about mass communication, journalism, and media studies.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description: "Access curated materials, study guides, and industry insights.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow students and professionals in the field.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { icon: Award, label: "Academic Excellence", value: "Top Programs" },
    { icon: Globe, label: "Global Network", value: "Worldwide" },
    { icon: Lightbulb, label: "Innovation", value: "Cutting Edge" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    {/* Navigation */}
    <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-26 h-18 flex items-center justify-center overflow-hidden">
            <img
              src="/MasscomLogo.png"
              alt="Logo"
              className="w-26 h-26 object-contain"
            />
          </div>
            <span className="text-xl font-bold">FCMM Intellecta</span>
          </div>
  
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="animate-pulse bg-muted h-10 w-20 rounded-xl"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">Welcome back!</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email?.split("@")[0]}
                  </p>
                </div>
                <Link
                  href={`/hi/${user.email?.split("@")[0]}`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Exclusive Student Access
            </motion.div>
            
            {user ? (
              <>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user.email?.split('@')[0]}!
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Ready to continue your learning journey? Access your personalized dashboard and explore all the tools and resources available to you.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Your Gateway to
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Mass Communication
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Access our intelligent chatbot, comprehensive resources, and specialized tools designed for Mass Communication students. Join our community of learners and professionals.
                </p>
              </>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex justify-center"
            >
              {user ? (
                <Link 
                  href={`/hi/${user.email?.split('@')[0]}`}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  TRY IT NOW
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">FCMM Intellecta</div>
                </div>
                <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-foreground font-medium">Interactive Chatbot Interface</p>
                    <p className="text-sm text-muted-foreground mt-2">Powered by AI for Mass Communication</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Award className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and resources designed specifically for Mass Communication students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
            <img
              src="/MasscomLogo.png"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
              </div>
              <span className="font-semibold">FCMM Intellecta</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BUE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
