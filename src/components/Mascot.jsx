import { useEffect, useRef } from "react";

function Mascot() {
  const ref = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafId = useRef(null);

  useEffect(() => {
    let running = true;

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!running) return;

      // smooth follow
      pos.current.x += (mouse.current.x - pos.current.x) * 0.25;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.25;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x - 25}px, ${pos.current.y - 25}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <img
      ref={ref}
      src="/logo.png"
      alt="mascot"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "50px",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    />
  );
}

export default Mascot;