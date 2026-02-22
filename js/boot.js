// Initialize Animations
AOS.init({
    duration: 1000,
    once: true,
    mirror: false
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navbarCollapse).toggle();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function calculateExperience() {
        const items = document.querySelectorAll('.timeline-item');
        
        items.forEach(item => {
            const startStr = item.getAttribute('date-start');
            let endStr = item.getAttribute('date-end');
            
            const startDate = new Date(startStr);
            const endDate = (endStr === 'present') ? new Date() : new Date(endStr);
            
            let years = endDate.getFullYear() - startDate.getFullYear();
            let months = endDate.getMonth() - startDate.getMonth();
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            // Format the string
            let durationStr = "";
            if (years > 0) durationStr += years + (years === 1 ? " yr " : " yrs ");
            if (months > 0) durationStr += months + (months === 1 ? " mo" : " mos");
            
            const badge = item.querySelector('.duration-badge');
            if (badge) {
                badge.innerText = durationStr || "Less than a month";
            }
        });
    }

    calculateExperience();
});