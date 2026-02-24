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

async function exportToWord() {
    const resumeElement = document.getElementById('resume-content');
    const clone = resumeElement.cloneNode(true);
    const imgElement = clone.querySelector('img');

    // Helper to ensure image is loaded and converted correctly
    async function getBase64Image(img) {
        return new Promise((resolve) => {
            // Create a new image object to avoid modifying the UI version
            const tempImg = new Image();
            tempImg.crossOrigin = "anonymous"; // Helps with local security blocks
            tempImg.onload = function() {
                const canvas = document.createElement("canvas");
                canvas.width = tempImg.naturalWidth;
                canvas.height = tempImg.naturalHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(tempImg, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            tempImg.onerror = () => resolve(null); // Fallback if image fails
            tempImg.src = img.src;
        });
    }

    if (imgElement) {
        const base64 = await getBase64Image(imgElement);
        
        if (base64) {
            const imageHtml = `
                <table align="left" width="120" style="width:1.25in; border-collapse:collapse; margin-right: 20px;">
                    <tr>
                        <td width="120" style="width:1.25in; padding:0;">
                            <img src="${base64}" width="120" height="120" style="width:1.25in; height:1.25in; display:block;">
                        </td>
                    </tr>
                </table>`;
            imgElement.outerHTML = imageHtml;
        }
    }

    const content = clone.innerHTML;
    const header = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <style>
                @page { size: 21cm 29.7cm; margin: 0.75in; }
                body { font-family: 'Arial', sans-serif; font-size: 10.5pt; }
                img { width: 1.25in !important; height: 1.25in !important; }
            </style>
        </head>
        <body>`;
    
    const sourceHTML = header + content + "</body></html>";
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
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