import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  fallbackSrc = 'https://picsum.photos/seed/placeholder/800/600?blur=10',
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Image'}
      onError={handleError}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={`${className} ${hasError ? 'opacity-50 grayscale' : ''}`}
      {...props}
    />
  );
};

export default SafeImage;
