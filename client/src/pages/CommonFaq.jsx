import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { useNavigate } from 'react-router-dom';
import AuthAxios from '../utils/AuthAxios';
import { jsPDF } from 'jspdf';

const sampleQ = [
    {
        title: "What are your gym's operating hours?",
        description: "Our gym is open during the week from around 6:00 AM to 10:00 PM"
    },
    {
        title: "Do I need a membership to use the gym?",
        description: "Yes, a membership is required, but we also offer day passes."
    },
    {
        title: "Do you have locker rooms and showers?",
        description: "Yes, we provide locker rooms, showers, and changing areas."
    }
];

const CommonFaq = () => {
    const [faqs, setFaqs] = useState(sampleQ);
    const [allFaqs, setAllFaqs] = useState([]);
    const navigate = useNavigate();

    const getAllFaqs = async () => {
        try {
            const rep = await AuthAxios.get("/discussion/all");
            setAllFaqs(rep.data?.data?.discussions);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllFaqs();
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Add logo or header image
        // doc.addImage('logo.png', 'PNG', 10, 10, 40, 40);
        
        // Title styling
        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text("FITNESS CENTER", 105, 30, { align: 'center' });
        
        doc.setFontSize(18);
        doc.text("Frequently Asked Questions", 105, 40, { align: 'center' });
        
        // Add date
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const today = new Date().toLocaleDateString();
        doc.text(`Generated on: ${today}`, 105, 50, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        // Add divider
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);
        
        let y = 70;
        
        // Common FAQs section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(52, 152, 219);
        doc.text("Common Questions", 20, y);
        y += 10;
        
        faqs.forEach((faq, index) => {
          // Check if we need a new page
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(44, 62, 80);
          doc.text(`Q${index + 1}: ${faq.title}`, 20, y);
          y += 8;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          
          // Split long answers into multiple lines
          const textLines = doc.splitTextToSize(faq.description, 170);
          doc.text(textLines, 25, y);
          y += textLines.length * 7 + 10;
        });
        
        // New FAQs section
        if (allFaqs.length > 0) {
          // Check if we need a new page
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.setTextColor(52, 152, 219);
          doc.text("Community Questions", 20, y);
          y += 10;
          
          allFaqs.forEach((faq, index) => {
            // Check if we need a new page
            if (y > 250) {
              doc.addPage();
              y = 20;
            }
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(44, 62, 80);
            doc.text(`Q${index + 1}: ${faq.title}`, 20, y);
            y += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            
            // Split long answers into multiple lines
            const textLines = doc.splitTextToSize(faq.description, 170);
            doc.text(textLines, 25, y);
            y += textLines.length * 7 + 10;
          });
        }
        
        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text(`Page ${i} of ${pageCount} - Fitness Center FAQ`, 105, 285, { align: 'center' });
        }
        
        doc.save("Fitness_Center_FAQs.pdf");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <TopNav />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
                    <button 
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors px-4 py-2 rounded-lg shadow-sm" 
                        onClick={generatePDF}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download FAQ Report
                    </button>
                </div>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Common Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-medium text-gray-800 flex items-start">
                                        <span className="inline-flex items-center justify-center bg-gray-800 text-white rounded-full h-6 w-6 text-sm mr-3 flex-shrink-0">Q</span>
                                        {faq.title}
                                    </h3>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-gray-700 flex items-start">
                                        <span className="inline-flex items-center justify-center bg-gray-400 text-white rounded-full h-6 w-6 text-sm mr-3 flex-shrink-0">A</span>
                                        {faq.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Community Questions</h2>
                    <div className="space-y-4">
                        {allFaqs.length > 0 ? (
                            allFaqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-800 flex items-start">
                                            <span className="inline-flex items-center justify-center bg-gray-800 text-white rounded-full h-6 w-6 text-sm mr-3 flex-shrink-0">Q</span>
                                            {faq.title}
                                        </h3>
                                        <button 
                                            className="bg-green-200 hover:bg-green-300 transition-colors px-4 py-2 rounded-lg text-sm font-medium shadow-sm" 
                                            onClick={() => navigate(`/faq/${faq._id}?answer=true`)}
                                        >
                                            Answer
                                        </button>
                                    </div>
                                    <div className="px-6 py-4">
                                        <p className="text-gray-700 flex items-start">
                                            <span className="inline-flex items-center justify-center bg-gray-400 text-white rounded-full h-6 w-6 text-sm mr-3 flex-shrink-0">A</span>
                                            {faq.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">No community questions available at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                <div className="flex gap-4 mt-8">
                    <button 
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors px-5 py-3 rounded-lg font-medium shadow-sm" 
                        onClick={() => navigate("/myfaq")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Questions
                    </button>
                    <button 
                        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors px-5 py-3 rounded-lg font-medium shadow-sm" 
                        onClick={() => navigate("/askfaq")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ask a Question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommonFaq;