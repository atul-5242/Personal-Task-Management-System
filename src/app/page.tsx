'use client'

import { useSession, signIn, signOut } from "next-auth/react";
import { FaTasks, FaChartLine, FaUsersCog, FaRegClock } from "react-icons/fa";
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <FaTasks className="w-8 h-8 text-purple-500" />,
      title: "Task Management",
      description: "Organize and track your tasks with intuitive categorization and priority settings."
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-purple-500" />,
      title: "Progress Tracking",
      description: "Monitor your productivity with visual progress indicators and status updates."
    },
    {
      icon: <FaUsersCog className="w-8 h-8 text-purple-500" />,
      title: "Project Collaboration",
      description: "Work seamlessly with team members on shared projects and tasks."
    },
    {
      icon: <FaRegClock className="w-8 h-8 text-purple-500" />,
      title: "Time Management",
      description: "Set due dates and reminders to stay on top of your deadlines."
    }
  ];

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-8">Welcome, {session.user.name || session.user.email}</h1>
          <button
            onClick={() => signOut()}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">TaskMaster</div>
          <button
            onClick={() => signIn()}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Your Tasks,<br />Elevate Your Productivity
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            A powerful task management system designed to help you organize, track, and complete your projects efficiently.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => signIn()}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200"
            >
              Get Started
            </button>
            <Link
              href="/components/auth/register"
              className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Powerful Features for Enhanced Productivity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:transform hover:scale-105 transition-all duration-200"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have transformed their task management experience.
          </p>
          <button
            onClick={() => signIn()}
            className="bg-white text-purple-600 px-12 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 text-lg"
          >
            Start Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white/70">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">TaskMaster</h3>
              <p>Empowering productivity through intelligent task management.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50">
            <p>&copy; 2024 TaskMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}