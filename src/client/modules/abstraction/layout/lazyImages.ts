/*
 * If lazy attribute active, else use a fallback func
 */
export default function lazyLoadingImages(): void {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach((img: any) => {
            if (img.dataset.src) {
                img.src = img.dataset.src!;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }

    if ('IntersectionObserver' in window) {
        document.addEventListener('DOMContentLoaded', () => {
            const lazyImages = [].slice.call(
                document.querySelectorAll('img.lazyload'),
            );
            const lazyImageObserver = new IntersectionObserver(
                (entries: any[]) => {
                    return entries.forEach(
                        (item: IntersectionObserverEntry) => {
                            if (item.isIntersecting) {
                                const lazyImage = item.target as HTMLImageElement;
                                if (lazyImage.dataset.src) {
                                    lazyImage.src = lazyImage.dataset.src;
                                }
                                if (lazyImage.dataset.srcset) {
                                    lazyImage.srcset = lazyImage.dataset.srcset;
                                }
                                lazyImage.classList.remove('lazyload');
                                lazyImageObserver.unobserve(lazyImage);
                            }
                        },
                    );
                },
            );

            lazyImages.forEach((lazyImage: any) => {
                lazyImageObserver.observe(lazyImage);
            });
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            let lazyImages = [].slice.call(
                document.querySelectorAll('img.lazyload'),
            );
            let active = false;

            const lazyLoad = () => {
                if (!active) {
                    active = true;

                    setTimeout(() => {
                        lazyImages.forEach((lazyImage: HTMLImageElement) => {
                            if (
                                lazyImage.getBoundingClientRect().top <=
                                    window.innerHeight &&
                                lazyImage.getBoundingClientRect().bottom >= 0 &&
                                getComputedStyle(lazyImage).display !== 'none'
                            ) {
                                if (lazyImage.dataset.src) {
                                    lazyImage.src = lazyImage.dataset.src;
                                }

                                if (lazyImage.dataset.srcset) {
                                    lazyImage.srcset = lazyImage.dataset.srcset;
                                }

                                lazyImage.classList.remove('lazyload');

                                lazyImages = lazyImages.filter(
                                    image => image !== lazyImage,
                                );

                                if (lazyImages.length === 0) {
                                    document.removeEventListener(
                                        'scroll',
                                        lazyLoad,
                                    );
                                    window.removeEventListener(
                                        'resize',
                                        lazyLoad,
                                    );
                                    window.removeEventListener(
                                        'orientationchange',
                                        lazyLoad,
                                    );
                                }
                            }
                        });

                        active = false;
                    }, 200);
                }
            };

            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
        });
    }
}
