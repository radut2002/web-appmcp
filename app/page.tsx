import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import Table from '@/components/table'
import TablePlaceholder from '@/components/table-placeholder'
import ExpandingArrow from '@/components/expanding-arrow'
import { db, GeneratedImagesTable } from '@/lib/drizzle'
import { Fragment } from 'react'
import { desc } from 'drizzle-orm'

// Simple Nav component
function Nav() {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-white/80 shadow-sm mb-8">
      <Link href="/" className="text-xl font-bold text-gray-800">
        Home
      </Link>
      <div className="space-x-6">
        <Link href="#users" className="hover:underline text-gray-700">
          Users
        </Link>
        <Link href="#images" className="hover:underline text-gray-700">
          Images
        </Link>
        <Link href="https://github.com/drizzle-team/drizzle-orm" className="hover:underline text-gray-700" target="_blank" rel="noopener noreferrer">
          Drizzle ORM
        </Link>
      </div>
    </nav>
  )
}

// Simple Footer component
function Footer() {
  return (
    <footer className="w-full py-6 mt-16 bg-white/80 text-center text-gray-500 text-sm border-t">
      &copy; {new Date().getFullYear()} Postgres on Vercel Demo. Built with Next.js & Drizzle ORM.
    </footer>
  )
}

// Async component to display generated images
async function GeneratedImagesList() {
  const images = await db
    .select()
    .from(GeneratedImagesTable)
    .orderBy(desc(GeneratedImagesTable.createdAt))
    .limit(12)

  if (!images.length) {
    return <div className="text-gray-500 text-center py-8">No generated images found.</div>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
      {images.map((img) => (
        <div key={img.id} className="bg-white/60 rounded-lg shadow p-4 flex flex-col items-center">
          <div className="w-full h-48 flex items-center justify-center mb-3">
            <Image
              src={img.thumbnailUrl || img.imageUrl}
              alt={img.prompt || 'Generated image'}
              width={256}
              height={192}
              className="rounded-md object-cover max-h-48"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-700 truncate mb-1" title={img.prompt}>{img.prompt}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{img.model}</span>
              <span>
                {img.createdAt
                  ? new Date(img.createdAt as string | number | Date).toLocaleDateString()
                  : ''}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { Nav, Footer, GeneratedImagesList }
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Link
        href="https://vercel.com/templates/next.js/postgres-drizzle"
        className="group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
      >
        <p>Deploy your own to Vercel</p>
        <ExpandingArrow />
      </Link>
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#4b4b4b] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Postgres on Vercel
      </h1>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
        Postgres demo with{' '}
        <Link
          href="https://github.com/drizzle-team/drizzle-orm"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Drizzle
        </Link>{' '}
        as the ORM. <br /> Built with{' '}
        <Link
          href="https://nextjs.org/docs"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Next.js App Router
        </Link>
        .
      </p>

      <div className="flex justify-center space-x-5 pt-10 mt-10 border-t border-gray-300 w-full max-w-xl text-gray-600">
        <Link
          href="https://postgres-prisma.vercel.app/"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Prisma
        </Link>
        <Link
          href="https://postgres-starter.vercel.app/"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Starter
        </Link>
        <Link
          href="https://postgres-kysely.vercel.app/"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Kysely
        </Link>
      </div>

      <div className="sm:absolute sm:bottom-0 w-full px-20 py-10 flex justify-between">
        <Link href="https://vercel.com">
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href="https://github.com/vercel/examples/tree/main/storage/postgres-drizzle"
          className="flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <p className="font-light">Source</p>
        </Link>
      </div>
    </main>
  )
}
