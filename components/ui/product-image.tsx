'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export function ProductImage({ src, alt, className, fill = true }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${src}`);
      setHasError(true);
      setImgSrc('/placeholder.webp');
    }
  };

  // Validate image URL
  const isValidUrl = src && (src.startsWith('http') || src.startsWith('/'));
  const finalSrc = isValidUrl ? imgSrc : '/placeholder.webp';

  return (
    <Image
      src={finalSrc}
      alt={alt}
      fill={fill}
      className={className}
      onError={handleError}
      unoptimized={hasError}
    />
  );
}
