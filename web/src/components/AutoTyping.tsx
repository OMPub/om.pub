import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface AutoTypingProps {
  strings: string[];
}

const AutoTyping: React.FC<AutoTypingProps> = ({ strings }) => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings,
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, [strings]);

  return <span ref={el} />;
};

export default AutoTyping;
