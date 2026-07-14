import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantify | AI Calling Agent",
  description: "Manage inbound and outbound AI calling agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-50 h-screen flex overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col hidden md:flex">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Quantify
            </h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
              Dashboard
            </Link>
            <Link href="/agents" className="block px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
              AI Agents
            </Link>
            <Link href="/scheduler" className="block px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
              Scheduler
            </Link>
            <Link href="/calls" className="block px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">
              Call Logs
            </Link>
            <Link href="/live" className="block px-4 py-2 rounded-lg bg-blue-900/30 text-blue-400 font-medium hover:bg-blue-900/50 transition-colors mt-4">
              Live Panel
            </Link>
          </nav>
          <div className="p-4 border-t border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                L
              </div>
              <div className="text-sm">
                <p className="font-medium">Lucas</p>
                <p className="text-neutral-400">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
