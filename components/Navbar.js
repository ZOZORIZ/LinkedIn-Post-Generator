import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const buttonRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        setIsLoggedIn(data.isLoggedIn);
        setUserName(data.userName || '');
        
        console.log('Auth status:', data);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();

    // GSAP setup
    gsap.set(buttonRef.current, {
      opacity: 0,
      y: -50,
      scale: 1,
    });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(buttonRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "expo.out",
    }, "+=4.5");
  }, []);

  const handleLogout = async () => {
    try {
      await fetch ('/api/auth/logout');
      window.location.reload();
    }catch{
      console.error('Logout Failed',error);
    }
  };

  const firstName = userName ? userName.split(' ')[0] : '';

  return (
    <header className="fixed p-0 top-0 left-0 right-0 z-50 backdrop-blur-md h-20 lg:h-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-24 lg:h-40">
          {isLoggedIn ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-white flex font-basetext-md w-full">Welcome,&nbsp; <span className='font-bold'>{firstName}</span></span>
              <button
                ref={buttonRef}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#ff7f7f] hover:bg-white hover:text-red-500 group"
                style={{
                  transform: 'perspective(1000px)',
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.3s ease',
                }}
                onMouseMove={(e) => {
                  const button = e.currentTarget;
                  const rect = button.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  const rotateX = (y - centerY) / 10;
                  const rotateY = (centerX - x) / 10;

                  button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                }}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              ref={buttonRef}
              className="flex items-center gap-2 p-4 lg:p-0 px-2 lg:px-6 py-3 lg:py-3 shadow-[0_10px_20px_0_#7f8cff55] rounded-lg bg-[#0077B5] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#7f8cff] hover:bg-white hover:text-[#0077B5] group"
              onClick={() => {
                window.location.href = '/api/auth/linkedin';
              }}
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span className="relative text-sm lg:text-base">
                Sign in with LinkedIn
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0077B5] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
