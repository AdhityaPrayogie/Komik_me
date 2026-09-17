/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uploads.mangadex.org',
            },
        ],
    },
};

export default nextConfig;