// Centralized video metadata for frame-accurate seeking
// All videos are 24fps

export const VIDEO_STATS = {
    homepage: {
        src: '/images/home-ui/hp.mp4',
        fallback: '/images/home-ui/fallback.png', // Use first keyframe
        duration: 5.041667,
        frameRate: 24,
        totalFrames: 121,
        frameDuration: 1 / 24,
    },
    about: {
        src: '/images/about-ui/about.mp4',
        fallback: '/images/about-ui/fallback.png',
        duration: 4.899984,
        frameRate: 24,
        totalFrames: 118,
        frameDuration: 1 / 24,
    },
    services: {
        src: '/images/services-ui/tech.mp4',
        fallback: '/images/services-ui/fallback.png',
        duration: 4.899984,
        frameRate: 24,
        totalFrames: 118,
        frameDuration: 1 / 24,
    },
    contact: {
        src: '/images/contact-ui/contact.mp4',
        fallback: '/images/contact-ui/fallback.png',
        duration: 5.208333,
        frameRate: 24,
        totalFrames: 125,
        frameDuration: 1 / 24,
    },
    portfolio: {
        src: '/images/portfolio-blog-ui/porfolio.mp4',
        fallback: '/images/portfolio-blog-ui/fallback.png',
        duration: 5.041667,
        frameRate: 24,
        totalFrames: 121,
        frameDuration: 1 / 24,
    },
} as const;

export type VideoStatsKey = keyof typeof VIDEO_STATS;
export type VideoStatsType = typeof VIDEO_STATS[VideoStatsKey];
