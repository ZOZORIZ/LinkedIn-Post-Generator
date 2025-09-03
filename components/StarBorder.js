import { forwardRef } from 'react';

const StarBorder = forwardRef(({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...rest
}, ref) => {
  return (
    <Component
      ref={ref}
      className={`relative overflow-hidden rounded-[20px] border border-gray-600 ${className}`}
      {...rest}
    >
      {/* Top trail */}
      <span
        className="absolute w-full h-[2px] top-0 left-0 animate-border-horizontal z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed,
        }}
      />
      {/* Bottom trail */}
      <span
        className="absolute w-full h-[2px] bottom-0 left-0 animate-border-horizontal-reverse z-10"
        style={{
          background: `linear-gradient(270deg, transparent, ${color}, transparent)`,
          animationDuration: speed,
        }}
      />

      {/* Button content */}
      <span className="relative z-20">{children}</span>
    </Component>
  );
});

StarBorder.displayName = 'StarBorder';

export default StarBorder;
