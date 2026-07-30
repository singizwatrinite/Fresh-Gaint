document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL REVEAL ANIMATION LOGIC
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;

        reveals.forEach(box => {
            const boxTop = box.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                box.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger initial view check on load

    // 2. STATS COUNTER LOGIC
    const counters = document.querySelectorAll('.counter');
    const speed = 120; // Lower = faster count-up speed

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const inc = Math.max(1, Math.ceil(target / speed));

            const updateCount = () => {
                count += inc;
                if (count < target) {
                    counter.innerText = count.toLocaleString();
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target.toLocaleString() + (target === 100 ? "%" : "+");
                }
            };
            updateCount();
        });
    };

    // Trigger counters via IntersectionObserver
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.disconnect(); // Run animation only once
            }
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }
});