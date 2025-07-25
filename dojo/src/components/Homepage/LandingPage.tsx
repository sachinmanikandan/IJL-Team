import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for intersection observer
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, inView };
};

const images = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80",
    title: "Innovation Hub",
    subtitle: "Where Technology Meets Tradition"
  },
  {
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80",
    title: "Global Excellence",
    subtitle: "Connecting Markets Worldwide"
  },
  {
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80",
    title: "Sustainable Future",
    subtitle: "Building Tomorrow Today"
  },
];

const services = [
  {
    icon: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 2H5a2 2 0 00-2 2v13a2 2 0 002 2h4l3 3 3-3h4a2 2 0 002-2V4a2 2 0 00-2-2zm-7 3c1.727 0 3.272.805 4.272 2.058l-1.414 1.414C14.306 7.919 13.551 7.5 12 7.5s-2.306.419-2.858.972l-1.414-1.414C8.728 5.805 10.273 5 12 5zm0 10c-2.757 0-5-2.243-5-5 0-.827.335-1.577.879-2.121l1.414 1.414A2.483 2.483 0 009.5 10.5c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5c0-.448-.119-.866-.293-1.207l1.414-1.414A4.969 4.969 0 0117 10.5c0 2.757-2.243 5-5 5z"/>
      </svg>
    ),
    title: "Manufacturing Excellence",
    desc: "World-class facilities delivering high-quality products for global markets.",
    color: "from-blue-600 to-indigo-600"
  },
  {
    icon: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    title: "Indo-Japan Collaboration",
    desc: "Bridging Indian and Japanese expertise to foster innovation and sustainable growth.",
    color: "from-indigo-600 to-purple-600"
  },
  {
    icon: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    title: "Global Distribution",
    desc: "Efficient supply chain and distribution network connecting Asia and the world.",
    color: "from-purple-600 to-pink-600"
  },
  {
    icon: (
      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
      </svg>
    ),
    title: "Engineering Solutions",
    desc: "Cutting-edge engineering and R&D for next-generation industries.",
    color: "from-pink-600 to-red-600"
  },
];

const values = [
  {
    title: "Innovation",
    desc: "We drive progress through continuous innovation and advanced technology.",
    icon: "💡"
  },
  {
    title: "Integrity",
    desc: "We uphold the highest standards of ethics and transparency in all our operations.",
    icon: "🤝"
  },
  {
    title: "Sustainability",
    desc: "We are committed to sustainable practices for a better tomorrow.",
    icon: "🌱"
  },
  {
    title: "Collaboration",
    desc: "We believe in the power of partnership between India and Japan.",
    icon: "🌏"
  },
];

const LandingSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const aboutRef = useInView();
  const servicesRef = useInView();
  const valuesRef = useInView();

  // Carousel auto-slide with pause on hover
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        setCurrent((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 text-gray-900 overflow-x-hidden">
      {/* Hero Carousel */}
      <div 
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={images[current].url}
              alt={images[current].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/60 to-blue-900/80" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
              INDIA JAPAN LIGHTNING
              <span className="block text-3xl md:text-5xl lg:text-6xl font-light mt-2 text-blue-200">
                PVT LTD
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-4 max-w-3xl mx-auto">
              {images[current].title}
            </p>
            <p className="text-lg md:text-xl text-blue-200 mb-12">
              {images[current].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              className="group relative px-8 py-4 bg-white text-blue-900 text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:text-white shadow-2xl"
              onClick={() => window.location.href = "/home"}
            >
              <span className="relative z-10">Explore Dashboard</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            <button
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + images.length) % images.length)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>

      {/* About Section */}
      <section id="about" className="py-24 px-4" ref={aboutRef.ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={aboutRef.inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              About IJL
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed">
                <span className="font-bold text-2xl text-blue-900">India Japan Lightning (IJL)</span> is a pioneering joint venture dedicated to fostering industrial growth and technological innovation between India and Japan.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                With a commitment to quality, sustainability, and cross-cultural collaboration, IJL delivers world-class solutions in manufacturing, engineering, and global trade.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏭</span>
                  </div>
                  <span className="font-semibold text-gray-800">25+ Years</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <span className="font-semibold text-gray-800">50+ Countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                  <span className="font-semibold text-gray-800">5000+ Employees</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                alt="IJL Building"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center px-4 relative z-10"
        >
          <h3 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h3>
          <p className="text-xl md:text-2xl leading-relaxed font-light max-w-4xl mx-auto">
            To be the leading force in Indo-Japanese industrial collaboration, driving innovation, excellence, and sustainable growth for a global tomorrow.
          </p>
          <div className="mt-12 flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-lg opacity-90">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">200+</div>
              <div className="text-lg opacity-90">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg opacity-90">Industry Awards</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-24 px-4" ref={valuesRef.ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={valuesRef.inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our journey towards excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesRef.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50" ref={servicesRef.ref}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={servicesRef.inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions tailored to meet your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={servicesRef.inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500`} />
                  
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{service.desc}</p>
                  
                  {/* <button className="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-indigo-600 transition-colors">
                    Learn more
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button> */}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-10 opacity-90">
            Join us in building a bridge between innovation and tradition
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <button className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl">
              Get Started Today
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300">
              Contact Our Team
            </button> */}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingSection;