import './globals.css'
import { ReactNode } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'Project Tracker',
  description: 'Sleek, monochrome project tracker with dark/light mode',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <nav className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-semibold">Tracker</Link>
            <div className="flex items-center space-x-4">
              <Link href="/projects" className="hover:text-gray-700 dark:hover:text-gray-300">Projects</Link>
              <Link href="/about"    className="hover:text-gray-700 dark:hover:text-gray-300">About</Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Victor Zhang
        </footer>
      </body>
    </html>
  )
}
