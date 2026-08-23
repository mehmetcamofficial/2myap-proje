import { useState } from 'react';

interface ServiceImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackAlt?: string;
}

export function ServiceImage({ src, alt, fallbackAlt, className, ...props }: ServiceImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className={`flex items-center justify-center bg-[hsl(var(--muted))] ${className ?? ''}`}>
        <span className="text-center text-sm text-[hsl(var(--muted-foreground))] px-4">
          {fallbackAlt || alt || 'Görsel yüklenemedi'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
