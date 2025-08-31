// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('bg-opacity-90');
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('bg-opacity-90');
            navbar.classList.remove('shadow-md');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Custom cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', function(e) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            // Add small delay to cursor outline for effect
            setTimeout(function() {
                cursorOutline.style.left = e.clientX + 'px';
                cursorOutline.style.top = e.clientY + 'px';
            }, 50);
        });
        
        // Change cursor size on clickable elements
        const clickables = document.querySelectorAll('a, button, input, .card-hover');
        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
            });
            
            item.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
            });
        });
    }
    
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('[id^="hero-"], [id^="about-"], [id^="skill-"], [id^="services-"], [id^="service-"], [id^="portfolio-"], [id^="experience-"], [id^="contact-"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translate(0)';
                
                // For progress bars
                if (entry.target.classList.contains('progress-fill')) {
                    const width = entry.target.getAttribute('data-width');
                    if (width) {
                        entry.target.style.width = width;
                    }
                }
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Progress bars animation
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                if (width) {
                    entry.target.style.width = width;
                }
            }
        });
    }, { threshold: 0.1 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
    
    // Portfolio filter
    const filterButtons = document.querySelectorAll('[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('text-gray-300');
            });
            
            button.classList.remove('text-gray-300');
            button.classList.add('bg-primary', 'text-white');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Initialize Three.js scene
    initThreeJsScene();
});

// Three.js background animation
function initThreeJsScene() {
    const canvas = document.getElementById('hero-canvas');
    
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    
    // Set initial size
    const updateSize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    updateSize();
    
    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6d28d9,
        transparent: true,
        opacity: 0.8
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Position camera
    camera.position.z = 3;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize with debounce for performance
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            updateSize();
        }, 250);
    });
}

// Contact form handling with Web3Forms
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const result = document.getElementById("result");
    
    if (form && result) {
        form.addEventListener("submit", function (e) {
            const formData = new FormData(form);
            e.preventDefault();
            var object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            var json = JSON.stringify(object);
            result.innerHTML = "Please wait...";
            result.style.display = "block";
            result.classList.remove("text-green-500", "text-red-500");
            result.classList.add("text-gray-300");

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        result.innerHTML = json.message;
                        result.classList.remove("text-gray-300");
                        result.classList.add("text-green-500");
                    } else {
                        console.log(response);
                        result.innerHTML = json.message;
                        result.classList.remove("text-gray-300");
                        result.classList.add("text-red-500");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    result.innerHTML = "Something went wrong!";
                    result.classList.remove("text-gray-300");
                    result.classList.add("text-red-500");
                })
                .then(function () {
                    form.reset();
                    setTimeout(() => {
                        result.style.display = "none";
                    }, 5000);
                });
        });
    }
});
