import React, { useEffect, useState } from 'react';
import styles from "@/styles/Home.module.scss";

interface NakaImageProps {
  locale: string;
  title: string;
  alt: string;
  className?: string;
}

const NakaImage: React.FC<NakaImageProps> = ({
  locale,
  title,
  alt,
  className,
}) => {
  const src = `/naka/naka-${locale}.png`;
  const fallbackUrl = '/naka/naka-blank.png';
  const [imageTitle, setImageTitle] = useState<string>(title);
  const [imageSrc, setImageSrc] = useState<string>(fallbackUrl);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch(src);
        if (response.status === 200) {
          setImageSrc(src);
          setImageTitle('');
        } else {
          setImageSrc(fallbackUrl);
          setImageTitle(title);
        }
      } catch (error) {
        console.error(`Image not found for ${locale}:`, error);
        setImageSrc(fallbackUrl);
      }
    };

    loadImage();
  }, [locale, fallbackUrl]);

  return  <div className={styles.imageContainer}>
    <h2 className={styles.imageTitle}>{imageTitle}</h2>
    <img src={imageSrc} alt={alt} className={className} />
  </div>
};

export default NakaImage
