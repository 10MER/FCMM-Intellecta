"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { 
  MessageCircle, 
  BookOpen, 
  Settings, 
  LogOut,
  GraduationCap,
  Award,
  Home,
  ArrowRight
} from "lucide-react";

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const username = params.username as string;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth, router]);

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const quickActions = [
    {
      icon: MessageCircle,
      title: "AI Chatbot",
      description: "Get instant answers about mass communication",
      href: "/chat",
      color: "bg-blue-500"
    },
    {
      icon: BookOpen,
      title: "Resources",
      description: "Access study materials and guides",
      href: "/resources",
      color: "bg-green-500"
    }
  ];

  const accountActions = [
    {
      icon: Settings,
      title: "Settings",
      description: "Manage your account preferences",
      href: "/settings",
      color: "bg-gray-500"
    },
    {
      icon: LogOut,
      title: "Sign Out",
      description: "Sign out of your account",
      onClick: handleSignOut,
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-26 h-18 flex items-center justify-center overflow-hidden">
            <img
              src="/MasscomLogo.png"
              alt="Logo"
              className="w-26 h-26 object-contain"
            />
              </div>
              <div>
                <h1 className="text-xl font-bold">FCMM Intellecta</h1>
                <p className="text-sm text-muted-foreground">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Welcome back!</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Go to home"
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Hi, {username}!</h2>
                <p className="text-muted-foreground">Ready to continue your learning journey?</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>Mass Communication Student</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-6">Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accountActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  {action.onClick ? (
                    <button
                      onClick={action.onClick}
                      className="w-full text-left"
                    >
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </button>
                  ) : (
                    <a href={action.href} className="block">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold mb-2">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
