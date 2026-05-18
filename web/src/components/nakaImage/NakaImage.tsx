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

  let formattedTitle: React.ReactNode = imageTitle;
  if (imageTitle) {
    const words = imageTitle.split(' ');
    if (words.length > 1) {
      // Split the first word (or first two if the first is very short, like "La" or "Die")
      let firstPart = words[0];
      let restPart = words.slice(1).join(' ');
      
      if (words.length > 2 && firstPart.length <= 3) {
        firstPart = words.slice(0, 2).join(' ');
        restPart = words.slice(2).join(' ');
      }
      
      // Using an SVG viewBox of 100x25 means the aspect ratio is fixed at 4:1.
      // The text is forced to stretch (spacingAndGlyphs) to exactly 100 units wide.
      // Since the SVG width is 100% of the container, the text will ALWAYS perfectly hit
      // the left and right margins, no matter what characters are in the string.
      // The font size in the SVG is 25. Since the SVG width is 90% of the parent,
      // its height is 90% * 0.25 = 22.5%. Thus, the font size is effectively 22.5cqi.
      const freedomCqi = 22.5;
      const restCqi = freedomCqi / 2;
      
      const isArabicScript = /[\u0600-\u06FF]/.test(firstPart);
      let marginB = '-2%';
      if (isArabicScript) {
        marginB = (locale === 'fa' || locale === 'ur') ? '8%' : '4%';
      }

      formattedTitle = (
        <>
          <svg dir="ltr" width="100%" viewBox="0 0 100 25" style={{ display: 'block', overflow: 'visible', marginBottom: marginB }}>
            <text x="0" y="20" fontSize="25" textLength="100" lengthAdjust="spacingAndGlyphs" 
                  fontFamily='"Big Shoulders Stencil Display", "Impact", "Arial Black", system-ui, sans-serif' 
                  fontWeight="900" fill="#111" style={{ direction: 'ltr' }}>
              {firstPart}
            </text>
          </svg>
          <span 
            className={styles.titleRest}
            style={{ fontSize: `max(1rem, ${restCqi}cqi)` }}
          >
            {restPart}
          </span>
        </>
      );
    } else {
      formattedTitle = (
        <svg dir="ltr" width="100%" viewBox="0 0 100 25" style={{ display: 'block', overflow: 'visible' }}>
          <text x="0" y="20" fontSize="25" textLength="100" lengthAdjust="spacingAndGlyphs" 
                fontFamily='"Big Shoulders Stencil Display", "Impact", "Arial Black", system-ui, sans-serif' 
                fontWeight="900" fill="#111" style={{ direction: 'ltr' }}>
            {imageTitle}
          </text>
        </svg>
      );
    }
  }

  return  <div className={styles.imageContainer} dir="auto">
    <h2 className={styles.imageTitle}>{formattedTitle}</h2>
    <img src={imageSrc} alt={alt} className={className} />
  </div>
};

export default NakaImage
