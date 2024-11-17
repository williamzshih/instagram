'use client'
import Masonry from "react-masonry-css";

const images: string[] = Array.from(
    { length: 50 },
    (_, i) => `https://picsum.photos/id/${i}/${i % 2 === 0 ? '768/1024' : '1024/768'}`);

export default function PostsGrid() {
    return (
        <div className="max-w-4xl mx-auto">
            <Masonry
                breakpointCols={{
                    default: 4,
                    860: 3,
                    700: 2
                }}
                className="flex -ml-4"
                columnClassName="pl-4">
                {images.map(src => (
                    <div className="mb-4">
                        <img src={src} />
                    </div>
                ))}
            </Masonry>
        </div>
    )
}