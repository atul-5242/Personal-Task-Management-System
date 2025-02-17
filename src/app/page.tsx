'use client'

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { FaTasks, FaChartLine, FaUsersCog, FaRegClock } from "react-icons/fa";

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

  // Array of travel destination images
  const placeImages = [
    {
      src: "https://images.unsplash.com/photo-1501747188-61c00b3d8ba0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Tropical Beach Paradise",
    },
    {
      src: "https://images.unsplash.com/photo-1517837125937-53bd402f49d6?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Mountain Landscape",
    },
    {
      src: "https://images.unsplash.com/photo-1518414881329-0f96c8f2a924?q=80&w=1789&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Historic City",
    },
  ];

  return (
    <main>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">TaskMaster</div>
          <div className="absolute right-4 top-4 flex items-center gap-4">
            {session ? (
              <>
                <span className="text-white">
                  Welcome, {session.user?.name || 'User'}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:opacity-90 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/components/auth/login"
                className="px-6 py-2 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>
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
            <Link
              href={session ? "/components/projects" : "/components/auth/login"}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200"
            >
              Get Started
            </Link>
            <Link
              href="/components/auth/register"
              className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Add this before or after your main content */}
      <div className="grid grid-cols-3 gap-8 my-16 px-8">
        {placeImages.map((image, index) => (
          <div key={index} className="relative h-[300px] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"> 
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

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
          <div className="text-center mt-8">
            <Link
              href={session ? "/projects" : "/components/auth/login"}
              className="px-8 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
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
    </main>
  );
}