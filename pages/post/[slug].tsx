import { useState } from 'react'
import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from "react-portable-text"
import { useForm, SubmitHandler } from "react-hook-form";
import Image from 'next/image'

interface Props {
    post: Post
}

interface IFormInput {
    _id: string,
    name: string,
    email: string,
    comment: string
}

function Post({ post }: Props) {
    const [submitted, setSubmitted] = useState(false)
    console.log(post)

    const {
        register, 
        handleSubmit, 
        formState: {errors}
    } = useForm<IFormInput>()

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(() => {
            setSubmitted(true)
            console.log(data)

        }).catch((err) => {
            console.log(err)
            setSubmitted(false)
        })
    }

  return (
    <main>
        <Header />

        <Image 
            className='w-full h-40 object-cover' 
            src={urlFor(post.mainImage).url()!} 
            alt=""
        />
        <article className='max-w-3xl mx-auto p-5'>
            <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
            <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
            <div className='flex items-center space-x-2'>
                <Image 
                    className='h-10 w-10 rounded-full'
                    src={urlFor(post.author.image).url()!} 
                    alt=''
                />
                <p className='text-sm font-extralight'>Blog Post by <span className='text-orange-500'>{post.author.name}</span> - published at {new Date(post._createdAt).toLocaleString()}</p>
            </div>

            <div className='m-10'>
                <PortableText
                    className=''
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                    projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                    content={post.body}
                    serializers={
                        {
                            h1: (props: any) => (
                                <h1 className="text-2xl font-bold my-5" {...props} />
                            ),
                            h2: (props: any) => (
                                <h1 className="text-xl font-bold my-5" {...props} />
                                ),
                                li: ({children}: any) => (
                                    <li className="ml-4 list-disc">
                                    {children}
                                </li>
                            ),
                            link: ({ href, children }: any) => (
                                <a href={href} className="text-blue-500 hover:underline">
                                    {children}
                                </a>
                            ),
                        }
                    }
                    />
                </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border-teal-400" />

        {submitted ? (
            <div className="flex flex-col p-10 my-10 bg-teal-500 text-white max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold">Thank You For your feedback!</h3>
                <p>once it has been reviewed it will appear below</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-10 max-w-2xl mx-auto mb-10">
            <h2 className="text-sm text-gray-400">Did you enjoy this article?</h2>
            <h3 className="text-2xl text-teal-400">Leave a comment below!</h3>
            <hr className="py-3 mt-2 border-gray-400" />

            <input
                {...register("_id")}
                type="hidden" 
                name="_id"
                value={post._id}
                />

            <label>
                <span className="text-gray-400">Name </span>
                <input 
                    {...register("name", {required: true})}
                    type="text" 
                    className="mb-5 shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-teal-500 focus:ring-2"
                    placeholder="Enter Name"
                />
            </label>
            <label>
                <span className="text-gray-400">Email </span>
                <input 
                    {...register("email")}
                    type="email" 
                    className="mb-5 shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-teal-500 focus:ring-2"
                    placeholder="Add an Email"
                    />
            </label>
            <label>
                <span>Comment </span>
                <textarea 
                    {...register("comment", {required: true})}
                    rows={8} 
                    className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-teal-500 focus:ring-2"
                    placeholder="Leave a comment"
                />
            </label>
            <div className='flex flex-col p-5'>
                {errors.name && (
                    <span className='text-red-500'>The Name Field is required</span>
                )}
                {errors.comment && (
                    <span className='text-red-500'>A Comment is required</span>
                )}
            </div>
            <input 
                className='bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer' 
                type='submit' 
                />
        </form>
    )}
        <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-teal-500 shadow space-y-2'>
            <h3 className="text-4xl">Comments</h3>
            <hr className="pb-2" />
            {post.comments.map((comment) => (
                <div key={comment._id} >
                    <p>
                        <span className='text-teal-500'>{comment.name}</span>: {comment.comment}
                    </p>
                </div>
            ))}
        </div>
    </main>
    )
}

export default Post

export const getStaticPaths = async () => {
    const query = `*[_type == 'post']{
        _id,
        slug {
            current
        }
    }`
    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[ _type == 'post' && slug.current == $slug][0]{
        _id,
       title,
       _createdAt,
       author -> {
       name,
       image
     },
    'comments': *[
        _type == 'comment' &&
        post._ref == ^._id &&
        approved == true
    ],
      description,
      mainImage,
      slug,
      body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    })

    if (!post) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 60,
    }
}