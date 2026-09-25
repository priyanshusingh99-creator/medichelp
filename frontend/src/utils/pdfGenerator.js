import { jsPDF } from 'jspdf';

export const exportDoctorChecklistPDF = (disease, checkedQuestions = []) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Header Banner
  doc.setFillColor(11, 15, 23); // Obsidian dark background
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(6, 182, 212); // Neon Cyan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MediHelp Medical Intelligence', 15, 20);

  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(`Clinical Consultation Dossier | Exported: ${dateStr}`, 15, 30);

  // Condition Overview Box
  let y = 50;
  doc.setLineWidth(0.5);
  doc.setDrawColor(6, 182, 212);
  doc.rect(15, y, 180, 25);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Target Condition: ${disease.name}`, 20, y + 10);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Body Region: ${disease.bodyRegion}  |  Severity Level: ${disease.severity}`, 20, y + 18);

  // Doctor Questions Checklist
  y += 35;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text('Key Questions to Ask Your Doctor:', 15, y);

  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const questions = disease.doctorQuestions || [];
  questions.forEach((q, idx) => {
    const isChecked = checkedQuestions.includes(idx);
    const boxSymbol = isChecked ? '[X]' : '[  ]';
    const lineText = `${boxSymbol}  ${q}`;
    
    // Wrap long question lines
    const splitText = doc.splitTextToSize(lineText, 175);
    doc.text(splitText, 18, y);
    y += (splitText.length * 6) + 4;
  });

  // Dietary Blueprint Summary
  y += 5;
  if (disease.dietaryRecommendations) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text('Recommended Dietary Protocol:', 15, y);

    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const foodsToEat = disease.dietaryRecommendations.foodsToEat ? disease.dietaryRecommendations.foodsToEat.join(', ') : 'N/A';
    const foodsToAvoid = disease.dietaryRecommendations.foodsToAvoid ? disease.dietaryRecommendations.foodsToAvoid.join(', ') : 'N/A';

    const eatLines = doc.splitTextToSize(`Foods to Include: ${foodsToEat}`, 175);
    doc.text(eatLines, 18, y);
    y += (eatLines.length * 5) + 3;

    doc.setTextColor(239, 68, 68); // Crimson
    const avoidLines = doc.splitTextToSize(`Foods to Limit/Avoid: ${foodsToAvoid}`, 175);
    doc.text(avoidLines, 18, y);
    y += (avoidLines.length * 5) + 5;
  }

  // Footer Disclaimer
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 275, 195, 275);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('MediHelp is an AI-assisted informational system. This report does not replace professional diagnosis or emergency medical advice.', 15, 282);

  // Save PDF
  doc.save(`${disease.name.replace(/\s+/g, '_')}_Doctor_Checklist.pdf`);
};
