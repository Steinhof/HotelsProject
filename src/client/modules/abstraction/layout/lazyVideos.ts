export default function lazyLoadingVideos(): void {
    document.addEventListener('DOMContentLoaded', () => {
        const lazyVideos = document.querySelectorAll('video.lazyload');

        if ('IntersectionObserver' in window) {
            const lazyVideoObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(function(video) {
                        if (video.isIntersecting) {
                            for (const source in video.target.children) {
                                const videoSource =
                                    video.target.children[source];
                                if (videoSource.tagName === 'SOURCE') {
                                    videoSource.src = videoSource.dataset.src;
                                }
                            }

                            video.target.load();
                            video.target.classList.remove('lazyload');
                            lazyVideoObserver.unobserve(video.target);
                        }
                    });
                },
            );

            lazyVideos.forEach(lazyVideo => {
                lazyVideoObserver.observe(lazyVideo);
            });
        }
    });
}
