import Masonry from "react-masonry-css";

const images = Array.from({ length: 10 }, (_, index) => {
  if (index % 2 === 0) {
    return `https://picsum.photos/1024/768?random=${index}`;
  } else {
    return `https://picsum.photos/768/1024?random=${index}`;
  }
});

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export default function PostsGrid() {
  return (
    <div className="w-11/12 mx-auto">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4"
        columnClassName="pl-4"
      >
        {images.map((image) => (
          <div className="mb-4">
            <img src={image} alt="Post" />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
