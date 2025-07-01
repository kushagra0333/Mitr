// src/components/CustomCursor.js
import React, { useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor");
    const trail = document.querySelector(".cursor-trail");

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
  }, []);

  return (
    <>
      <div className="custom-cursor"></div>
      <div className="cursor-trail"></div>
    </>
  );
};

export default CustomCursor;