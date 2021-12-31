export const baseUrl = process.env.NEXT_PUBLIC_HOST;
export const fetcher = (url) => fetch(url).then((res) => res.json());
