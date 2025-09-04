import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from '../components/LoadingScreen';
import StarBorder from '../components/StarBorder';
import { AuroraBackground } from "../components/ui/aurora-background"
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CopyButton from '../components/icons/copy-tick';
import AutoResizingTextarea from '../components/ui/autosize';
import CustomAlertDialog from '../components/CustomAlertDialog';


export default function Home() {
  const [useUnicode, setUseUnicode] = useState(false);
  const { user, loading,picture } = useAuth();
  const [output, setOutput] = useState('');
  const [originalOutput, setOriginalOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [selectedApi, setSelectedApi] = useState('classic');
  const [currentSection, setCurrentSection] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [postVisibility, setPostVisibility] = useState("Anyone");
  const [selectedFile, setSelectedFile] = useState(null); // <--- actual file
const [selectedImagePreview, setSelectedImagePreview] = useState(null); // just for preview
  const [formData, setFormData] = useState({
    topic: '',
    goals: '',
    audience: '',
    achievement: '',
    tone: '',
    length: ''
  });
  const [generateOffset, setGenerateOffset] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const mainRef = useRef(null);
  const buttonRef = useRef(null);
  const glowRef = useRef(null);
  const apiButton = useRef(null);
  const sectionRefs = useRef([]);
  const apibuttonRefs =useRef(null);
  const text1 = useRef(null);
  const text2 = useRef(null);
  const text3 = useRef(null);
  const text4 = useRef(null);
  const Prev = useRef(null);
  const Generate = useRef(null);
  const outputSectionRef = useRef(null);
  const [flag,setFlag] = useState(false);
  const dropdownRef = useRef(null);
  const handleMouseEnter = () => {
    setGenerateOffset(-80);
    if(Prev.current){
      Prev.current.style.opacity=0;
    }
  }
  const handleMouseLeave = () => {
    setGenerateOffset(0);
    if(Prev.current){
      Prev.current.style.opacity=1;
    }
  }

  const unicodeMap = {
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };

  const applyUnicode = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, (match, word) => {
      // For each matched word, apply the Unicode mapping.
      return word.split('').map(char => unicodeMap[char] || char).join('');
    });
  };

  const deUnicode = (text) => {
    const reverseMap = Object.fromEntries(Object.entries(unicodeMap).map(([k, v]) => [v, k]));
    if (!text) return '';
    return text.split('').map(char => reverseMap[char] || char).join('');
  };

  useEffect(() => {
    if(useUnicode){
      setOutput(applyUnicode(originalOutput));

    }else{
      setOutput(originalOutput);
    }
  },[originalOutput, useUnicode]);


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
    console.log(output);

    // Scroll to output section if output is set
    if (output && outputSectionRef.current && currentSection !==0) {
      outputSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Create ScrollTrigger instances after a short delay to ensure DOM is ready
    setTimeout(() => {
      try {
        // Create ScrollTrigger for each section
        sectionRefs.current.forEach((section, index) => {
          if (section) {
            ScrollTrigger.create({
              trigger: section,
              start: "top center",
              end: "bottom top",
              markers: false // Set to true for debugging
            });
          }
        });
        
        ScrollTrigger.refresh();
      } catch (error) {
        console.error('Error creating ScrollTrigger instances:', error);
      }
    }, 100);

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

  
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [output, currentSection, showDropdown]);
  

  const startMainAnimations = () => {
    gsap.set(buttonRef.current, {y:50, opacity: 0})
    gsap.set(apibuttonRefs.current, {y:50, opacity:0})
    
    // Set initial states for text
    gsap.set([text1.current, text2.current, text3.current, text4.current], {
      opacity: 0,
      y: 50,
      scale: 0.9,
      filter:'blur(10px)'
    })

    gsap.to(mainRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    });

    const tl = gsap.timeline();

    tl.to(apibuttonRefs.current, {
      opacity: 1,
      duration: 0.8,
      y:0,  
      ease: "power2.out"
    })
    .to(text1.current, {
      filter:'blur(0px',
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .to(text2.current, {
      filter:'blur(0px',
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(text3.current, {
      filter:'blur(0px',
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(text4.current, {
      filter:'blur(0px',
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(".input-container", {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      y: 0
    }, "-=0.3")
    .to(buttonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.3")

    gsap.to(".input-container", {
      y: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    gsap.to('.bouncy', {
      scale: 1.09,
      duration: 2,
      ease: 'elastic.out(1, 0.3)',
      repeat: -1,
      yoyo: true
    });

    const button = buttonRef.current;
    const glow = glowRef.current;

    const handleMouseMove = (e) => {
      if (!button || !glow) return;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(glow, {
        x: x,
        y: y,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      if (!glow) return;
      gsap.to(glow, { opacity: 0.2, scale: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      if (!glow) return;
      gsap.to(glow, { opacity: 0, scale: 0, duration: 0.3 });
    };

    if (button && glow) {
      // Remove any existing listeners first
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);

      // Add new listeners
      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);

      // Set initial glow state
      gsap.set(glow, { 
        xPercent: -50, 
        yPercent: -50, 
        opacity: 0, 
        scale: 0,
        position: 'absolute',
        pointerEvents: 'none'
      });
    }

    setIsPageLoaded(true);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.topic.trim()) return;

    // Set the button to center position when generate is pressed
    setGenerateOffset(-80);
    if(Prev.current){
      Prev.current.style.opacity=0;
    }

    try {
      setIsLoading(true);
      let response;
      if(selectedApi == 'classic'){
            response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: formData.topic,
              goal: formData.goals,
              audience: formData.audience,
              achievement: formData.achievement,
              tone: formData.tone,
              length: formData.length
            }),
      });
    }
      else if(selectedApi == 'n8n'){
        response = await fetch('/api/generaten8n', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: formData.topic,
              goal: formData.goals,
              audience: formData.audience,
              achievement: formData.achievement,
              tone: formData.tone,
              length: formData.length
            }),
        });
      }

      if (!response.ok){
        const errorMessage = selectedApi === 'n8n' 
          ? "n8n servers are down, Please try again later." 
          : "Failed to generate post. Please try again.";
        toast.error(errorMessage);
        return; // Add this return statement
      }

      const data = await response.json();
      setOriginalOutput(data.output);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate post. Please try again.');
      // Remove the window.location.reload line or fix it to window.location.reload()
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (index) => {
    const section = sectionRefs.current[index];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setCurrentSection(index);
    }
  };

  const handleNextSection = () => {
    if (currentSection < sectionRefs.current.length - 1) {
      const nextIndex = currentSection + 1;
      setCurrentSection(nextIndex); 
      scrollToSection(nextIndex);
    } else {
      handleSubmit(); 
    }
  };
  

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      const prevIndex = currentSection - 1;
      setCurrentSection(prevIndex); 
      scrollToSection(prevIndex);
    }
  };
  const handleMainSection = () => {
    setFlag(true);

    setFormData({
      topic: '',
      goals: '',
      audience: '',
      achievement: '',
      tone: '',
      length: ''
    });
    setOutput('');
    setOriginalOutput('');
    setIsLoading(false);
    setCurrentSection(0);
    scrollToSection(0);
  };

  const handlePost = async () => {
    if(!user){ 
      console.log("User not logged in..cannot post");
      return
    }
    console.log("post button clicked");
    setIsPosting(true)

    const formData = new FormData();
    formData.append("generatedContent", output);
    formData.append("visibility", postVisibility);
    if (selectedFile) {
      formData.append("image", selectedFile); // ✅ send file
    }
    const res = await fetch('/api/request', {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
    if (res.ok) {
      setShareStatus('success');
      if (data.postUrl) {
        window.open(data.postUrl, '_blank');
        toast.success("Posted Successfully", {
          onClick: () => window.open(data.postUrl, '_blank'),
        });
      }
      setIsPosting(false);
    } else {
      setShareStatus('error');
      toast.error(data.error || "Failed to share to LinkedIn.");
      setIsPosting(false);
    }
  };

  const handledropdown = () => {
    console.log("buttonclicked")
    
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    console.log("file:",file);
    if (file) {
      setSelectedFile(file);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative min-h-screen font-['DM_Sans'] overflow-hidden scroll-smooth">
      {!isPageLoaded && <LoadingScreen onLoaded={startMainAnimations} />}

      <Head>
        <title>AI LinkedIn Post Generator</title>
        <meta name="description" content="Let AI craft your next LinkedIn post" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuroraBackground>
        <div className="relative z-10 min-h-screen w-full overflow-hidden">
          <main ref={mainRef} className="relative overflow-hidden min-h-screen flex flex-col justify-center items-center opacity-0 scroll-smooth">
            <section ref={el => sectionRefs.current[0] = el} className="min-h-[85vh] lg:min-h-screen flex items-center justify-center gap-20">
              <div className="grid place-items-center h-dvg ">
                <div ref={apibuttonRefs} className='flex flex-row justify-center gap-5 sm:gap-6 md:gap-8 lg:gap-10 opacity-0'>
                  {['n8n', 'classic'].map(api => (
                    <button
                      key={api}
                      ref={apiButton}
                      onClick={() => {
                        setSelectedApi(api)
                        if(api ==='n8n'){
                          setShowWarning(true);
                        }
                        else{
                          setShowWarning(false);
                        }
                      }
                      }
                      className={`text-sm lg:text-xl flex justify-center items-center mb-3 w-[130px] lg:w-[200px] h-12 lg:h-16 text-white backdrop-blur-md rounded-[18px] hover:scale-105 hover:shadow-[0_0_20px_rgba(127,140,255,0.5)] transition-all duration-300 cursor-pointer border ${selectedApi === api ? 'bg-[#7f8cff]/30 border-[#7f8cff] shadow-[0_0_20px_rgba(127,140,255,0.3)]' : 'bg-black/30 border-white/10'}`}
                    >
                      <span className='relative z-10'>{api === 'n8n' ? 'n8n' : 'Classic API'}</span>
                    </button>
                  ))}
                </div>
                <div className='w-full px-10 sm:px-12 md:px-24 lg:px-40 text-xs lg:text-lg lg:mt-2 flex items-center justify-center'>
                  {showWarning && (
                          <span className='text-red-500 text-center'><i>n8n servers are down most of the time. </i> <br></br>
                          <span style={{color:"white"}}><i>Classic API</i></span>
                           <i> is preferred.</i>
                           </span>
                    )} 

                </div>
                <h1 className="text-[clamp(2rem,11vw,5rem)] tracking-[2px] leading-none mt-[2vh] mb-[3vh] text-center font-bold relative group select-none">
                  <div ref={text1} className="inline-block">
                    <span className="bg-gradient-to-r from-[#7f8cff] to-[#515dc8] bg-clip-text text-transparent">Let AI </span>
                  </div>
                  <br></br>
                  <div ref={text2} className="inline-block">
                    <span className="text-white">Craft Your Next </span>
                  </div>
                  <br></br>
                  <div ref={text3} className="inline-block">
                    <span className='text-white'>Linked</span>
                  </div>
                  <div ref={text4} className="inline-block">
                    <span className="bg-[linear-gradient(90deg,#7f8cff_30%,#515dc8_80%)] bg-clip-text text-transparent">In Post</span>
                  </div>
                </h1>
                <div className="input-container flex justify-center items-center mx-auto h-16 lg:h-24 w-[min(700px,80vw)] shadow-[0_30px_60px_0_#7f8cff55] rounded-[18px] bg-[rgba(10,12,27,0.7)] border-2 border-[#7f8cff] p-4 sm:p-6 md:p-8 relative backdrop-blur-[2px] transition-all duration-300 hover:border-white hover:shadow-[0_30px_60px_0_#ffffff55] bouncy pointer-events-auto y:50 opacity-0">
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder="What's your LinkedIn post about?"
                    className="w-[min(700px,100vw)] h-24 bg-transparent border-none text-center outline-none text-white text-xs lg:text-lg placeholder-[#b2bfff]"
                  />
                </div>
                <StarBorder
                  ref={buttonRef}
                  as="button"
                  color="#7f8cff"
                  speed="5s"
                  onClick={() => {
                    if (formData.topic.trim()) {
                      handleNextSection();
                    }
                  }}
                  disabled={!formData.topic.trim()}
                  className="text-sm lg:text-lg flex justify-center items-center mx-auto shadow-[0_30px_60px_0_#7f8cff55] h-12 lg:h-14 mt-7 lg:mt-16 lg:px-8 lg:py-4 w-[min(160px,26vw)] bg-[rgba(10,12,27,0.7)] border-3 border-gray-500 transition-colors duration-300 pointer-events-auto"
                >
                  {/* Glow element inside StarBorder */}
                  <div
                    ref={glowRef}
                    className="absolute z-10 rounded-full bg-[#7f8cff] blur-lg pointer-events-none w-20 h-24 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0"
                  ></div>

                  {/* Text with z-20 to be above glow */}
                  <span className="relative z-20 text-[#b2bfff]">Next</span>
                </StarBorder>


              </div>
              
            </section>

            <section ref={el => sectionRefs.current[1] = el} className="min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center gap-5">
              <span className="w-full text-3xl lg:text-6xl font-bold text-center text-white"><br></br>What do you hope <br></br>to achieve with this post? <br></br></span>
              <span className='text-xs lg:text-xl text-center text-white'>(e.g. inspire, inform, promote, share experience)</span>
              <input
                type='text'
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                className='w-[min(500px,90vw)] h-16 mt-5 px-4 rounded-2xl focus:shadow-[0_30px_60px_0_#555da255] hover:shadow-[0_30px_60px_0_#ffffff20] bg-white/10 blur-backdrop-3xl border-2 border-white/5 text-white placeholder-[#b2bfff] focus:border-[#555da2] focus:outline-none hover:border-white/50'
                placeholder="Enter your post goal..."
              />
              <div className="flex gap-4 lg:mt-4">
                <button
                  onClick={handlePreviousSection}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white hover:border-[#7f8cff] transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextSection}
                  disabled={!formData.goals.trim()}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white transition-all hover:bg-[#4a53a3] hover:font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </section>

            <section ref={el => sectionRefs.current[2] = el} className="min-h-[60vh] lg:min-h-screen flex flex-col items-center justify-center gap-5">
              <span className='w-full mt-20 lg:mt-0 text-4xl lg:text-6xl font-bold text-center text-white'>Who is your target <br></br>audience for this post?<br></br></span>
              <span className='text-xs lg:text-xl text-center text-white'>(e.g., students, designers, managers, recruiters)</span>
              <input
                type='text'
                value={formData.audience}
                onChange={(e) => handleInputChange('audience', e.target.value)}
                className='w-[min(500px,90vw)] h-16 mt-5 px-4 rounded-2xl focus:shadow-[0_30px_60px_0_#555da255] hover:shadow-[0_30px_60px_0_#ffffff20] bg-white/10 blur-backdrop-3xl border-2 border-white/5 text-white placeholder-[#b2bfff] focus:border-[#555da2] focus:outline-none hover:border-white/50'
                placeholder='Enter your target audience'
              />
              <div className="flex gap-4 lg:mt-4">
                <button
                  onClick={handlePreviousSection}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white hover:border-[#7f8cff] transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextSection}
                  disabled={!formData.audience.trim()}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white transition-all hover:bg-[#4a53a3] hover:font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </section>

            <section ref={el => sectionRefs.current[3] = el} className="min-h-[70vh] lg:min-h-screen flex flex-col align-center items-center justify-center gap-5">
              <span className='w-[min(1200px,90vw)] mt-20 lg:mt-0 text-3xl lg:text-6xl font-bold text-center text-white'>What achievement or experience do you want to highlight in the post?</span>
              <input
                type='text'
                value={formData.achievement}
                onChange={(e) => handleInputChange('achievement', e.target.value)}
                className='w-[min(500px,90vw)] h-16 mt-5 px-4 rounded-2xl focus:shadow-[0_30px_60px_0_#555da255] hover:shadow-[0_30px_60px_0_#ffffff20] bg-white/10 blur-backdrop-3xl border-2 border-white/5 text-white placeholder-[#b2bfff] focus:border-[#555da2] focus:outline-none hover:border-white/50'
                placeholder='Enter your achievement or story'
              />
              <div className="flex gap-4 lg:mt-4">
                <button
                  onClick={handlePreviousSection}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white hover:border-[#7f8cff] transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextSection}
                  disabled={!formData.achievement.trim()}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white transition-all hover:bg-[#4a53a3] hover:font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </section>

            <section ref={el => sectionRefs.current[4] = el} className="min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center gap-5">
              <span className='w-full mt-20 lg:mt-0 text-3xl lg:text-6xl font-bold text-center text-white'>What kind of tone <br></br>would you like the post to have?<br></br></span>
              <span className='text-xs lg:text-xl text-center text-white'>(e.g., professional, friendly, motivational, witty)</span>
              <input
                type='text'
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
                className='w-[min(500px,90vw)] h-16 mt-5 px-4 rounded-2xl focus:shadow-[0_30px_60px_0_#555da255] hover:shadow-[0_30px_60px_0_#ffffff20] bg-white/10 blur-backdrop-3xl border-2 border-white/5 text-white placeholder-[#b2bfff] focus:border-[#555da2] focus:outline-none hover:border-white/50'
                placeholder='Enter your desired tone'
              />
              <div className="flex gap-4 lg:mt-4">
                <button
                  onClick={handlePreviousSection}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white hover:border-[#7f8cff] transition-all duration-300"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextSection}
                  disabled={!formData.tone.trim()}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white transition-all hover:bg-[#4a53a3] hover:font-bold duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </section>

            <section ref={el => sectionRefs.current[5] = el} className="min-h-[80vh] lg:min-h-screen flex flex-col items-center justify-center gap-5">
              <span className='w-full text-3xl lg:text-6xl font-bold text-white text-center'>How long do you want<br></br> your post to be (in words)? <br></br></span>
              <span className='text-xs lg:text-xl text-white text-center'>(e.g., 100, 150, 200, Hundred, Twohundred)</span>
              <input
                type='text'
                value={formData.length}
                onChange={(e) => handleInputChange('length', e.target.value)}
                className='w-[min(500px,90vw)] h-16 mt-5 px-4 rounded-2xl focus:shadow-[0_30px_60px_0_#555da255] hover:shadow-[0_30px_60px_0_#ffffff20] bg-white/10 blur-backdrop-3xl border-2 border-white/5 text-white placeholder-[#b2bfff] focus:border-[#555da2] focus:outline-none hover:border-white/50'
                placeholder='Enter desired word count'
              />
              <div className="flex gap-4 lg:mt-4">
                <button
                  ref={Prev}
                  onClick={handlePreviousSection}
                  className="text-lg flex justify-center items-center px-8 py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white hover:border-[#7f8cff] transition-all duration-300"
                >
                  Previous
                </button>
                <div style={{
                    transform: `translateX(${(!formData.length.trim() || isLoading) ? 0 : window.innerWidth >= 640 ? generateOffset : 0}px)`,
                    transition: 'transform 0.5s'
                  }}>
                  <button
                    ref={Generate}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleSubmit}
                    disabled={!formData.length.trim() || isLoading}
                    className={`text-lg flex justify-center items-center py-4 rounded-[18px] bg-[rgba(10,12,27,0.7)] border border-white/10 text-white transition-all delay-150 hover:bg-[#4a53a7] duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${generateOffset !== 0? 'font-base sm:font-bold' : 'font-base'} ${generateOffset !== 0 ? 'px-10 sm:px-20' : 'px-8 sm:px-10'}`}
                  >
                    {isLoading && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isLoading ? 'Generating...' : 'Generate Post'}
                  </button>
                </div>
              </div>
            </section>

            {output && (
              <section ref={outputSectionRef} className="min-h-screen flex flex-col justify-center p-4 sm:p-8" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
                <div className="smooth-transform w-[clamp(330px,800px,80vw)] bg-[rgba(10,12,27,0.7)] rounded-[18px] p-5 mt-0 sm:mt-20 lg:p-8 backdrop-blur-md border-2 border-[#7f8cff] relative max-h-[370px] sm:max-h-[60vh]" style={{ transformStyle: 'preserve-3d', perspective: '1000px'}}
                onMouseMove={(e) => {
                  const button = e.currentTarget;
                  const rect = button.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  const rotateX = (y - centerY) / 90;
                  const rotateY = (centerX - x) / 90;

                  button.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                }}
                >
                  <div className="flex items-center justify-between mb-5 w-full">
                    <h2 className="text-3xl lg:text-5xl text-white font-bold drop-shadow-[0_6px_20px_rgba(127,140,255,0.7)]">
                        Generated Post
                    </h2>
                    <div className='flex items-center gap-10'>
                      <div className='relative group flex flex-col items-center'>
                        <div className='absolute bottom-full mb-2 bg-white text-black text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap'>
                          Click To Copy
                        </div>
                        <CopyButton textToCopy={output} />
                      </div>
                      <div className='relative group flex flex-col items-center'>
                        <div className='absolute bottom-full mb-3 bg-white text-black text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap'>
                          Click To Format
                        </div>
                        <img onClick={() => setUseUnicode(!useUnicode)} className='cursor-pointer h-7 hover:scale-110' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB3ElEQVR4nO3ZO2sUURgG4OB668RGQZSAjZdGgpWNlWIhwSoWgliqpLH2hn9BsRRjYyOIUQl4AU2hIngDb92ipSQgiiDeyCMDIwSL7BnmzMzZYV742nf3KZbz7TkjI126dCkVbMJ13I8wd3ENU7iASezFmjogR1WfXzn0MJZVBTmu3rzBrjZAsvzARBsgWX5jrA2QLM/QawMky3jdkA/oLzFzWFA8U3VD1gZ09bAFp/ElsPd1cpD/erfja0DvfNKQvPtcQO8CVqQO2R0I6aUO2RHQO1caUQNkf0DvvWGAXAronUwaku1S+DOgcz7ail8AMobNA2YrDuJmYOehKIiCkNg5Gw3RIORMVESDkO84FW3zbRDyL9NY1QZIlst1Q6bzG5Kl5gZm8Vmx7EvyHMluSrAn/wcYkpdJQhZ1r8SdwP6dyULy/tGAE778uVI1JP+MpwH9t4YBcrXy34l6IFcC+vvDAHkQ0P8+aQjW55fYg/IwWUi2fmAmsP9icpAcMI7nwnOgLshswEPPY3zET8XyqfTymMDSmOVEKUQikCdYPuyQPjaURjQMeYGNURANQb7ld8KroyFyyLGaAO9wEuuiAhZBtuHVgEecIvMWj3Ab53Eke2Ko5Mt36dKlffkLtiMPC6r8bNMAAAAASUVORK5CYII=" alt="bold" />
                      </div>
                    </div>
                  </div>
      

                  {picture && typeof picture === 'string' && picture.startsWith('http') && user && (
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={picture}
                        alt="Profile"
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
                      />
                      <div className="relative">
                        <button
                          className="flex flex-col items-start text-left"
                          onClick={() => setShowDropdown((prev) => !prev)}
                          type="button"
                        >
                          <span className="flex items-center">
                            <span className="text-white font-bold text-lg lg:text-2xl">{user}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 ml-2 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                          <span className="text-white text-sm text-left">{`Post to ${postVisibility}`}</span>
                        </button>

                        {showDropdown && (
                          <div ref={dropdownRef} className="absolute left-0 mt-2 w-56 rounded-xl bg-[#23262a] border border-[#444] shadow-lg z-50 p-4">
                            <div className="mb-2 text-white font-semibold">Who can see your post?</div>
                            <button
                              className={`flex items-center w-full p-2 rounded-lg mb-1 ${postVisibility === "Anyone" ? "bg-[#353a40]" : "hover:bg-[#353a40]"}`}
                              onClick={() => { setPostVisibility("Anyone"); setShowDropdown(false); }}
                            >
                              <span className="mr-2">
                                {/* Globe icon */}
                                <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="white" strokeWidth="2" />
                                </svg>
                              </span>
                              <span className='text-white'>Anyone</span>
                            </button>
                            <button
                              className={`flex items-center w-full p-2 rounded-lg ${postVisibility === "Connections only" ? "bg-[#353a40]" : "hover:bg-[#353a40]"}`}
                              onClick={() => { setPostVisibility("Connections only"); setShowDropdown(false); }}
                            >
                              <span className="mr-2">
                                {/* Connections icon */}
                                <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                                  <circle cx="8" cy="8" r="3" />
                                  <circle cx="16" cy="8" r="3" />
                                  <circle cx="12" cy="16" r="3" />
                                </svg>
                              </span>
                              <span className='text-white'>Connections only</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center mb-2 text-sm text-gray-300 italic">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17.25V21h3.75l11.06-11.06a2.121 2.121 0 0 0-3-3L3 17.25z"/>
                    </svg>
                    Click anywhere on the text to edit.
                  </div>
                  <div className='max-h-[240px] sm:max-h-[300px] lg:max-h-[300px] overflow-auto cool-scrollbar mb-2'>
                    <AutoResizingTextarea
                      value={output}
                      onChange={e => setOriginalOutput(e.target.value)}
                      className="flex text-white text-sm lg:text-[20px] w-full outline-none bg-transparent whitespace-pre-wrap"
                    />
                  </div>
                  {user ? (
                  <div className="flex justify-left origin-center opacity-80 transition-all duration-300 hover:opacity-100 items-center gap-2 relative">
                    <label className="cursor-pointer flex flex-col items-center relative group">
                      <img
                        src="/images/photo.png"
                        alt="Add image"
                        width="40"
                        className="mb-0 w-10 mt-0 align-left justify-left hover:scale-110"
                      />
                      <div className="absolute bottom-full mb-2 bg-white text-black text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                        Upload Image
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      {selectedFile && (
                        <span className="text-xs text-white">{selectedFile.name}</span>
                      )}
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        aria-label="Remove image"
                        className="absolute -top-2 left-8 bg-gray-800 bg-opacity-80 p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-[#7f8cff] z-10 shadow"
                        style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setSelectedImagePreview(null);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  ) : null}
                </div>
                <div className='w-[min(800px,90vw)] h-25 items-center flex justify-center gap-2 sm:gap-10 mt-0 sm:mt-4 z-50'>
                  <button
                    onClick={handleSubmit}
                   className='text-white rounded-[18px] text-md sm:text-lg mt-5 justify-center items-center p-4 px-2 sm:px-7 align-center bg-transparent border border-white/20 z-50 backdrop-blur-md transition-all duration-100 hover:border-[#7f8cff] hover:scale-105 hover:border-2 flex'
                   >
                    {isLoading && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isLoading ? 'Regenerating...':'Regenerate'}
                  </button>
                  <button 
                  className='text-white text-md lg:text-lg rounded-[18px] mt-5 justify-center items-center p-1 lg:p-4 px-7 sm:px-7 align-center bg-transparent border border-white/20 z-50 backdrop-blur-md transition-all duration-100 hover:scale-105 hover:bg-gradient-to-r hover:bg-clip-padding from-[#7f8cff] to [#fffff]'
                  onClick={handleMainSection}
                  >
                   Start Over
                  </button>
                  
                  {!loading && (
                    <>
                      {user ? (
                        <div
                          className="relative cursor-pointer text-white rounded-[18px] mt-5 bg-[#0077B5] lg:p-4 lg:px-12 p-2 px-8 items-center text-center shadow-[0_10px_20px_0_#7f8cff55] 
                                overflow-hidden transition-all duration-300 group
                                hover:shadow-[0_10px_20px_0_#ffffff]/50"
                          onClick={() => setIsAlertOpen(true)}
                        >
                          <span className="relative z-10 text-md lg:text-lg group-hover:text-[#0077B5] group-hover:font-bold transition-colors duration-300 delay-100 flex items-center">
                            {isPosting && (
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            )}
                            {isPosting ? 'Posting...' : 'Post to LinkedIn'}
                          </span>
                          <div className="absolute inset-0 bg-white transform -translate-x-80 transition-transform duration-300 ease-in-out group-hover:translate-x-0"></div>
                        </div>
                      ) : (
                        <div
                          className="relative cursor-not-allowed text-md lg:text-lg text-center text-white rounded-[18px] mt-5 bg-gray-500 p-1.5 sm:p-4 px-7 lg:px-12 shadow-[0_10px_20px_0_#4a556855] opacity-60 flex items-center justify-center"
                          onClick={() => toast.error("Please log in to post to LinkedIn.")}
                        >
                          Post to LinkedIn
                        </div>
                      )}
                    </>
                  )}
                </div>

                <CustomAlertDialog
                  isOpen={isAlertOpen}
                  onClose={() => setIsAlertOpen(false)}
                  onConfirm={() => {
                    handlePost();
                    setIsAlertOpen(false);
                  }}
                  title="Are you sure you want to post this to LinkedIn?"
                >
                  This will post the generated content to your LinkedIn profile. This action cannot be undone.
                </CustomAlertDialog>

              </section>
            )}
          </main>
        </div>
      </AuroraBackground>
    </div>
  );
}
