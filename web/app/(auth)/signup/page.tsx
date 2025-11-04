"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { SignupForm } from "@/components/forms/SignupForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </motion.div>

        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Mass Communication Portal</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </motion.div>

        {/* Login Form */}
        <SignupForm />

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-center space-y-4"
        >
          <div className="text-xs text-muted-foreground">
            <p>Contact your administrator for access to the portal</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
