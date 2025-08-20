// TODO: fix this
export const getImageWidth = (url?: string) => {
  if (!url) return 1920;
  if (url.startsWith("https://picsum.photos/id/")) {
    const segments = url.split("/");
    const width = segments[segments.length - 2];
    return parseInt(width);
  }
  return 1920;
};

// TODO: fix this
export const getImageHeight = (url?: string) => {
  if (!url) return 1080;
  if (url.startsWith("https://picsum.photos/id/")) {
    const segments = url.split("/");
    const height = segments[segments.length - 1];
    return parseInt(height);
  }
  return 1080;
};
