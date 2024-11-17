import PostsGrid from "@/components/PostsGrid";
import { BadgeCheck, ChevronLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <main>
            <section className="flex justify-between items-center">
                <button>
                    <ChevronLeft />
                </button>
                <div className="font-bold flex items-center gap-2">
                    user name
                    <div className="size-5 rounded-full inline-flex justify-center items-center text-black">
                        <BadgeCheck />
                    </div>
                </div>
                <Link href={'settings'}>
                    <Settings />
                </Link>
            </section>
            <section className="mt-8 flex justify-center">
                <div className="p-2 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red">
                    <div className="p-2 bg-white rounded-full">
                        <div className="size-40 aspect-square overflow-hidden rounded-full">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="text-center mt-4">
                <h1 className="text-xl">Name</h1>
                <p className="text-gray-500 mt-1 mb-1">Business account</p>
                <p>
                    Entrepreneur, Husband, Father<br />
                    Contact: name@name.name
                </p>
            </section>
            <section className="mt-4">
                <div className="flex justify-center gap-4 font-bold">
                    <Link href={'/'}>Posts</Link>
                    <Link className='text-gray-400' href={'/highlights'}>Highlights</Link>
                </div>
            </section>
            <section className="mt-4">
                <PostsGrid />
            </section>
        </main>
    )
}