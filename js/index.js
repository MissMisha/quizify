// Initialize Lucide icons
lucide.createIcons();

// Form submission handler
document.querySelector('.signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    // Here you would typically handle the form submission
    console.log('Form submitted with email:', email);
    alert('Thank you for signing up!');
    e.target.reset();
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        document.querySelector(href).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add hover effect to quiz cards