// `components/ImageSlider.tsx`
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    images: string[];
    height?: number | string;
}

export function ImageSlider({ images, height = 520 }: Props) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 5000);
        return () => clearInterval(t);
    }, [images]);

    if (!images || images.length === 0) return (
        <div className="flex items-center justify-center w-full bg-neutral-100" style={{ height }}>
            <span className="text-neutral-500">No images</span>
        </div>
    );

    const containerStyle = typeof height === 'number' ? { height: `${height}px` } : { height };

    return (
        <div className="relative w-full overflow-hidden" style={containerStyle}>
            {images.map((src, i) => (
                <Image
                    key={i}
                    src={src}
                    alt={`slide-${i}`}
                    fill
                    className={`object-cover transition-opacity duration-700 rounded-xl ${
                        i === index ? 'opacity-100' : 'opacity-0 pointer-events-none '
                    }`}
                    priority={i === 0}
                />
            ))}

            {/* <button
                onClick={() => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-sm"
                aria-label="prev"
            >
                <ChevronLeft className="w-5 h-5" />
            </button> */}

            {/* <button
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-sm"
                aria-label="next"
            >
                <ChevronRight className="w-5 h-5" />
            </button> */}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 transition-all rounded-full ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/60'}`}
                        aria-label={`dot-${i}`}
                    />
                ))}
            </div>
        </div>
    );
}
