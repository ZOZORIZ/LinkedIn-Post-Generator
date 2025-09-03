import { useRef, useEffect } from 'react';

export default function AutoResizingTextarea({ value, onChange, onFocus, ...props }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // Set to scrollHeight
    }
  }, [value]);

  // Custom onFocus handler to lock scroll
  const handleFocus = (e) => {
    // Find the scrollable parent (in your case, the direct parent div)
    const parent = textareaRef.current?.parentElement;
    if (parent) {
      const scrollTop = parent.scrollTop;
      setTimeout(() => {
        parent.scrollTop = scrollTop;
      }, 0);
    }
    // Call any user-provided onFocus
    if (onFocus) onFocus(e);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      {...props}
      style={{ overflow: 'hidden', resize: 'none' }} // Prevent manual resize and scrollbars
    />
  );
}