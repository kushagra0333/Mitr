import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [showCursor, setShowCursor] = useState(false);
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = () =>
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice()) {
      setShowCursor(true);
    }
  }, []);

  useEffect(() => {
    if (!showCursor) return;

    const cursor = cursorRef.current;
    const trail = trailRef.current;

    if (!cursor || !trail) return;

    const move = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      trail.style.left = e.clientX + "px";
      trail.style.top = e.clientY + "px";
      trail.classList.add("animate");
      setTimeout(() => trail.classList.remove("animate"), 300);
    };

    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, [showCursor]);

  if (!showCursor) return null;

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="cursor-trail" ref={trailRef}></div>
    </>
  );
};

export default CustomCursor;
