import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Github, Linkedin, Mail } from "lucide-react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Semantic Search App",
  description: "A semantic search application built with Next.js, TypeScript, and OpenAI.",
  generator: "Matias Rodriguez",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <header className="fixed top-0 right-0 p-4 flex gap-4">
          <a
            href="https://github.com/matiasrodriguezc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
            title="GitHub"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/matiasrodriguezc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:matiasrodriguezc01@gmail.com"
            className="text-foreground hover:text-primary transition-colors"
            title="Email"
            aria-label="Email"
          >
            <Mail size={24} />
          </a>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
