import {groq} from 'next-sanity'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'
import Avatar from '../../../components/avatar'
import CoverImage from '../../../components/cover-image'
import DateComponent from '../../../components/date'
import MoreStories from '../../../components/more-stories'
import PortableText from '../../../components/portable-text'
import {sanityFetch} from '@/sanity/lib/fetch'
import {postQuery, settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/image'
import * as demo from '@/sanity/lib/demo'

export async function generateStaticParams() {
  return sanityFetch({
    query: groq`*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
    perspective: 'published',
    stega: false,
  })
}

export async function generateMetadata({params}, parent) {
  const post = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors: post?.author?.name ? [{name: post?.author?.name}] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  }
}

export default async function PostPage({params}) {
  const [post, settings] = await Promise.all([
    sanityFetch({
      query: postQuery,
      params,
    }),
    sanityFetch({
      query: settingsQuery,
    }),
  ])

  if (!post?._id) {
    return notFound()
  }

  return (
    <div className='container mx-auto px-5'>
      <h2 className='mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter'>
        <Link href='/' className='hover:underline'>
          {settings?.title || demo.title}
        </Link>
      </h2>
      <article>
        <h1 className='mb-12 text-balance text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl'>
          {post.title}
        </h1>
        <div className='hidden md:mb-12 md:block'>
          {post.author && <Avatar name={post.author.name} picture={post.author.picture} />}
        </div>
        <div className='mb-8 sm:mx-0 md:mb-16'>
          <CoverImage image={post.coverImage} priority />
        </div>
        <div className='mx-auto max-w-2xl'>
          <div className='mb-6 block md:hidden'>
            {post.author && <Avatar name={post.author.name} picture={post.author.picture} />}
          </div>
          <div className='mb-6 text-lg'>
            <div className='mb-4 text-lg'>
              <DateComponent dateString={post.date} />
            </div>
          </div>
        </div>
        {post.content?.length && (
          <PortableText className='mx-auto max-w-2xl' value={post.content} />
        )}
      </article>
      <aside>
        <hr className='border-accent-2 mb-24 mt-28' />
        <h2 className='mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl'>
          Recent Stories
        </h2>
        <Suspense>
          <MoreStories skip={post._id} limit={2} />
        </Suspense>
      </aside>
    </div>
  )
}
