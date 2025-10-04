
// --- File Content Placeholders ---
    // NOTE: The system environment replaces these placeholders with the actual base64 content of the uploaded files.
    const PDF_BASE64_CONTENT = "data:application/pdf;base64,__file_content_uploaded:VINAY KUMAR KHARE - Telecom OSS Fulfillment.pdf__";
    // ASSUMPTION: A DOCX file with a similar name has also been uploaded.
    const DOCX_BASE64_CONTENT = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,__file_content_uploaded:VINAY KUMAR KHARE - Telecom OSS Fulfillment.docx__";

    document.addEventListener('DOMContentLoaded', () => {

      // --- 2. Print to PDF Functionality ---
      printCvBtn.addEventListener('click', () => {
        window.print();
        console.log("Print/Save as PDF initiated.");
      });

      // --- 3. Optional: Add a subtle animation on scroll for visual appeal ---
      // Intersection Observer to fade in sections as they come into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1, // Trigger when 10% of the item is visible
      });

      // Target all section cards for animation
      document.querySelectorAll('.section-card').forEach(card => {
        card.style.opacity = '0'; // Start invisible
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
      });

      // Class to apply on intersection
      document.head.insertAdjacentHTML('beforeend', `
                <style>
                    .animate-fade-in {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }
                </style>
            `);

    });