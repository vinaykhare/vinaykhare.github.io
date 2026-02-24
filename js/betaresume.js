document.addEventListener('DOMContentLoaded', () => {
    
    // PDF Trigger
    document.getElementById('printCvBtn').addEventListener('click', () => {
        window.print();
    });

    // Word Trigger
    // document.getElementById('downloadDocxBtn').addEventListener('click', async () => {
    //     await generateBeautifulDocx();
    // });

    // Tabular Word Trigger
    document.getElementById('downloadTableDocxBtn').addEventListener('click', async () => {
        exportToWord();
    });
});

function exportToWord() {
    const resumeElement = document.getElementById('resume-content');
    
    // 1. Create a clone so we don't mess up the actual UI
    const clone = resumeElement.cloneNode(true);
    
    // 2. Find the image in the clone
    const imgElement = clone.querySelector('img');
    
    // 3. Helper to convert image to Base64
    function getBase64Image(img) {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL("image/png");
    }

    // 4. Update the src to Base64 if the image is loaded
    if (imgElement && imgElement.complete) {
        const base64 = getBase64Image(imgElement);
        imgElement.src = base64;
    }

    const content = clone.innerHTML;

    const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <style>
                @page { size: 21cm 29.7cm; margin: 0cm; }
                body { font-family: 'Arial', sans-serif; }
            </style>
        </head>
        <body>`;
    const footer = "</body></html>";

    const sourceHTML = header + content + footer;

    const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vinay_Khare_Resume.doc';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/*
async function generateBeautifulDocx() {
    // 1. Safety Check: Is the library even there?
    if (typeof window.HTMLtoDOCX !== 'function') {
        console.error("Library html-to-docx not loaded!");
        alert("The document generator is still loading. Please wait a moment and try again.");
        return;
    }

    const container = document.querySelector('.resume-paper');
    if (!container) return;

    // 2. Clone the content so we don't mess up the actual web page
    const clone = container.cloneNode(true);

    // 3. FIX: Handle Images (The most common cause of failure)
    // Word cannot resolve "./assets/logo.png". 
    // For now, let's remove images to ensure it works. 
    // (If you want them kept, we'd need to convert them to Base64 strings).
    const images = clone.querySelectorAll('img');
    images.forEach(img => img.remove()); 

    const content = clone.innerHTML;
    
    // 4. Word-specific Styles
    const styles = `
        h1 { color: #0056b3; font-family: 'Arial'; font-size: 22pt; margin: 0; }
        h5 { color: #333333; font-family: 'Arial'; font-size: 14pt; border-bottom: 1px solid #0056b3; padding-bottom: 5px; }
        p, li { font-family: 'Arial'; font-size: 10pt; line-height: 1.2; }
        .text-primary { color: #0056b3; }
        .badge { color: #666666; font-size: 9pt; }
        ul { margin-top: 5px; }
    `;

    try {
        console.log("Generating Docx...");
        const docxBlob = await window.HTMLtoDOCX(content, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        }, styles);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(docxBlob);
        link.download = 'Vinay_Khare_Resume.docx';
        link.click();
        URL.revokeObjectURL(link.href);
        console.log("Success!");
    } catch (error) {
        // Detailed error logging to your browser console
        console.error("DOCX Error Details:", error);
        alert("Word generation failed. Check the console for details or use 'Save as PDF'.");
    }
}
*/