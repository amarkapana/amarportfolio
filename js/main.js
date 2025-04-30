/**
 * Amarnath K Portfolio - Main JavaScript File
 * This file handles all animations, interactions and functionality for the portfolio
 */

// =============================================
// Preloader Animation
// =============================================
const preloader = document.querySelector('.preloader');
const preloaderText = document.querySelectorAll('.preloader__text span');
const preloaderProgressBar = document.querySelector('.preloader__progress-bar');

window.addEventListener('load', () => {
    // Animate in preloader text
    gsap.to(preloaderText, {
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });
    
    // Animate progress bar
    gsap.to(preloaderProgressBar, {
        width: "100%",
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
            // Animate out preloader
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut",
                delay: 0.2
            });
            
            // Start page animations
            initPageAnimations();
        }
    });
});

// =============================================
// Smooth Scrolling with Locomotive Scroll
// =============================================
let scroll;

function initSmoothScroll() {
    scroll = new LocomotiveScroll({
        el: document.querySelector('.smooth-scroll'),
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
        // Add these options:
        lerp: 0.1, // Makes scrolling smoother
        multiplier: 1, // Adjust scroll speed
        getDirection: true,
        resetNativeScroll: true // Helps with content visibility
    });

    // Add this resize observer to properly update content height
    const resizeObserver = new ResizeObserver(() => scroll.update());
    resizeObserver.observe(document.querySelector('.smooth-scroll'));
    
    // Update scroll on window resize
    window.addEventListener('resize', () => {
        scroll.update();
    });
    
    // Handle anchor links with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                scroll.scrollTo(target);
            }
        });
    });
    
    // Update locomotive scroll for GSAP ScrollTrigger integration
    scroll.on('scroll', ScrollTrigger.update);
    
    // Tell ScrollTrigger to use these proxy methods
    ScrollTrigger.scrollerProxy('.smooth-scroll', {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0, 
                left: 0, 
                width: window.innerWidth, 
                height: window.innerHeight
            };
        },
        pinType: document.querySelector('.smooth-scroll').style.transform ? "transform" : "fixed"
    });
}

// =============================================
// Page Transitions with Barba.js
// =============================================
function initPageTransitions() {
    barba.init({
        transitions: [{
            name: 'default-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        }]
    });
    
    barba.hooks.after(() => {
        scroll.update();
        initPageAnimations();
    });
}

// =============================================
// Navigation
// =============================================
const navToggle = document.querySelector('.navbar__toggle');
const navLinks = document.querySelector('.navbar__links');

function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section');
    
    function highlightNavLink() {
        let scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    if (scroll) {
        scroll.on('scroll', highlightNavLink);
    } else {
        window.addEventListener('scroll', highlightNavLink);
    }
}

// =============================================
// Hero Canvas Animation
// =============================================
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    
    // Set size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;
    scene.add(camera);
    
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6c63ff,
        transparent: true,
        opacity: 0.6
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Handle resize
    window.addEventListener('resize', () => {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate particles
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0008;
        
        // Mouse movement effect
        particlesMesh.rotation.x += mouseY * 0.0003;
        particlesMesh.rotation.y += mouseX * 0.0003;
        
        // Render
        renderer.render(scene, camera);
    };
    
    animate();
}

// =============================================
// Custom Cursor
// =============================================
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorCircle = document.querySelector('.cursor__inner--circle');
    const cursorDot = document.querySelector('.cursor__inner--dot');
    
    // Update cursor position on mouse move
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        // Move the cursor elements
        gsap.to(cursor, {
            x: posX,
            y: posY,
            duration: 0.1
        });
        
        gsap.to(cursorCircle, {
            x: posX,
            y: posY,
            duration: 0.15
        });
        
        gsap.to(cursorDot, {
            x: posX,
            y: posY,
            duration: 0.05
        });
    });
    
    // Scale up cursor on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .project__inner, input, textarea');
    
    hoverables.forEach(hoverable => {
        hoverable.addEventListener('mouseenter', () => {
            gsap.to(cursorCircle, {
                scale: 1.5,
                opacity: 0.5,
                duration: 0.3
            });
            gsap.to(cursorDot, {
                scale: 0.5,
                duration: 0.3
            });
        });
        
        hoverable.addEventListener('mouseleave', () => {
            gsap.to(cursorCircle, {
                scale: 1,
                opacity: 1,
                duration: 0.3
            });
            gsap.to(cursorDot, {
                scale: 1,
                duration: 0.3
            });
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            opacity: 0,
            duration: 0.3
        });
    });
    
    document.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            opacity: 1,
            duration: 0.3
        });
    });
}

// =============================================
// Project Filtering
// =============================================
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(button => button.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter projects
            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    gsap.to(project, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        display: 'block'
                    });
                } else {
                    gsap.to(project, {
                        scale: 0.95,
                        opacity: 0,
                        duration: 0.4,
                        display: 'none'
                    });
                }
            });
            
            // Update locomotive scroll
            if (scroll) {
                setTimeout(() => {
                    scroll.update();
                }, 500);
            }
        });
    });
}

// =============================================
// Contact Form
// =============================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.querySelector('.form-status');

    if (!form) return;

    // Initialize EmailJS
    emailjs.init('lndDbEYccEH2AaRBG'); // Replace with your actual public key

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        formStatus.innerHTML = '<div class="form-status__loading">Sending message...</div>';

        // Send form using EmailJS
        emailjs.sendForm('service_6a6mgva', 'template_zeo8n9n', form)
            .then(function(response) {
                formStatus.innerHTML = '<div class="form-status__success">Message sent successfully! I\'ll get back to you soon.</div>';
                form.reset();

                // Clear success message after a few seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            }, function(error) {
                formStatus.innerHTML = '<div class="form-status__error">There was an error sending your message. Please try again.</div>';
                console.error('EmailJS Error:', error);
            });
    });
}


// =============================================
// Page Animations
// =============================================
function initPageAnimations() {
    // Set up ScrollTrigger
    ScrollTrigger.matchMedia({
        // All devices
        "all": function() {
            // Hero section animations
            const heroContent = document.querySelector('.hero__content');
            if (heroContent) {
                gsap.fromTo(heroContent.children, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.5
                });
            }
            
            // Animate sections when they come into view
            gsap.utils.toArray('.section-heading').forEach(heading => {
                gsap.fromTo(heading, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: heading,
                        start: "top bottom-=100",
                        toggleActions: "play none none none"
                    }
                });
            });
            
            // Animate projects
            gsap.utils.toArray('.project').forEach(project => {
                gsap.fromTo(project, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: project,
                        start: "top bottom-=50",
                        toggleActions: "play none none none"
                    }
                });
            });
            
            // Animate about section
            const aboutContent = document.querySelector('.about__content');
            if (aboutContent) {
                gsap.fromTo(aboutContent.children, {
                    y: 30,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: aboutContent,
                        start: "top bottom-=100",
                        toggleActions: "play none none none"
                    }
                });
            }
            
            // Animate contact section
            const contactElements = document.querySelectorAll('.contact__info, .contact__form-container');
            contactElements.forEach(element => {
                gsap.fromTo(element, {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: element,
                        start: "top bottom-=100",
                        toggleActions: "play none none none"
                    }
                });
            });
        }
    });
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
}

// =============================================
// Initialize everything when DOM is loaded
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize smooth scrolling
    // initSmoothScroll();
    
    // Initialize page transitions
    initPageTransitions();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize hero canvas animation
    initHeroCanvas();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize project filtering
    initProjectFilter();
    
    // Initialize contact form
    initContactForm();
});