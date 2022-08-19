import type { NextPage } from 'next'
import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'
import Link from 'next/link'

interface Props {
  posts: [Post]
}

export default function Home ({ posts }: Props) {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Diddy Blog</title>
        <meta name="description" content="Diddy's Blog" />
      </Head>
      
      <Header />
      <Banner />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p6'>
        {posts.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='border rounded-lg group cursor-pointer overflow-hidden'>
              <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} />
              <div className="flex justify-between p-5">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">{post.description} by {post.author.name}</p>
                </div>
                <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = ` *[ _type == "post"]{
    _id,
   title,
   author -> {
   name,
   image
 },
  description,
  mainImage,
  slug
 }`

 const posts = await sanityClient.fetch(query)

 return { 
  props: {
    posts,
  }
 }
}