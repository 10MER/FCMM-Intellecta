"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Mass Communication Student Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 text-muted-foreground text-lg"
          >
            Access the program chatbot, resources, and tools. Sign up to request
            access — an administrator will review your request.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 flex gap-3"
          >
            <Link href="/(auth)/signup" className="inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-sm font-medium hover:opacity-90">
              Get Access
            </Link>
            <Link href="/(auth)/login" className="inline-flex items-center rounded-md border px-5 py-3 text-sm font-medium hover:bg-muted">
              Log In
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl border p-6 bg-card"
        >
          <div className="aspect-video w-full rounded-md bg-gradient-to-br from-purple-200/60 to-blue-200/60 dark:from-purple-500/10 dark:to-blue-500/10 flex items-center justify-center">
            <span className="text-muted-foreground">Chatbot preview will appear here</span>
          </div>
        </motion.div>
      </section>
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Mass Communication</p>
          <div className="flex gap-4 text-sm">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
