import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SEOData {
  url: string;
  score: number;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  openGraph: { title: string; description: string; image: string };
  twitter: { card: string; title: string; description: string };
  headings: { h1: string[]; h2: string[]; h3: string[] };
  links: { internal: string[]; external: string[]; internalCount: number; externalCount: number };
  images: { total: number; withAlt: number; withoutAlt: number; list: Array<{ src: string; alt: string; hasAlt: boolean }> };
  issues: string[];
  recommendations: string[];
  aiInsights: { summary: string; suggestions: string[] } | null;
  geoAnalysis: {
    aiReadinessScore: number;
    aiRankingScore: number;
    factors: Array<{ factor: string; score: number; status: string }>;
    entities: { total: number; people: string[]; organizations: string[]; places: string[]; all: Array<{ type: string; name: string }> };
    contentMetrics: { wordCount: number; sentenceCount: number; avgSentenceLength: number };
    recommendations: string[];
  };
}

export const exportToPDF = (data: SEOData) => {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 20;

  const checkPageBreak = (space: number = 30) => {
    if (yPosition + space > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string, color: [number, number, number] = [37, 99, 235]) => {
    checkPageBreak(20);
    doc.setFillColor(...color);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPosition + 3);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;
  };

  const addText = (text: string, fontSize: number = 10, isBold: boolean = false, indent: number = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin - indent);
    lines.forEach((line: string) => {
      checkPageBreak(10);
      doc.text(line, margin + indent, yPosition);
      yPosition += fontSize * 0.5 + 2;
    });
  };

  // COVER PAGE
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 60, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('OptiGenius', pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('SEO & GEO Analysis Report', pageWidth / 2, 40, { align: 'center' });

  yPosition = 80;
  doc.setTextColor(0, 0, 0);

  // Report Info Box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 50, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 50, 'S');
  yPosition += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Analyzed URL:', margin + 10, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPosition += 7;
  const urlLines = doc.splitTextToSize(data.url, pageWidth - 2 * margin - 20);
  urlLines.forEach((line: string) => {
    doc.text(line, margin + 10, yPosition);
    yPosition += 5;
  });
  yPosition += 5;
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleString();
  doc.text('Report Generated: ' + dateStr, margin + 10, yPosition);
  doc.setTextColor(0, 0, 0);
  yPosition += 30;

  // Score Cards
  const scoreBoxWidth = (pageWidth - 2 * margin - 10) / 2;
  const seoColor = data.score >= 80 ? [34, 197, 94] : data.score >= 60 ? [234, 179, 8] : [239, 68, 68];
  doc.setFillColor(...seoColor);
  doc.roundedRect(margin, yPosition, scoreBoxWidth, 45, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SEO Score', margin + scoreBoxWidth / 2, yPosition + 12, { align: 'center' });
  doc.setFontSize(32);
  doc.text(String(data.score), margin + scoreBoxWidth / 2, yPosition + 30, { align: 'center' });
  doc.setFontSize(10);
  const scoreLabel = data.score >= 80 ? 'Excellent' : data.score >= 60 ? 'Good' : data.score >= 40 ? 'Needs Improvement' : 'Poor';
  doc.text(scoreLabel, margin + scoreBoxWidth / 2, yPosition + 40, { align: 'center' });

  const geoColor = data.geoAnalysis.aiReadinessScore >= 80 ? [34, 197, 94] : data.geoAnalysis.aiReadinessScore >= 60 ? [234, 179, 8] : [239, 68, 68];
  doc.setFillColor(...geoColor);
  doc.roundedRect(margin + scoreBoxWidth + 10, yPosition, scoreBoxWidth, 45, 3, 3, 'F');
  doc.setFontSize(16);
  doc.text('GEO AI Score', margin + scoreBoxWidth + 10 + scoreBoxWidth / 2, yPosition + 12, { align: 'center' });
  doc.setFontSize(32);
  doc.text(String(data.geoAnalysis.aiReadinessScore), margin + scoreBoxWidth + 10 + scoreBoxWidth / 2, yPosition + 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Ranking: ' + data.geoAnalysis.aiRankingScore, margin + scoreBoxWidth + 10 + scoreBoxWidth / 2, yPosition + 40, { align: 'center' });

  yPosition += 55;
  doc.setTextColor(0, 0, 0);

  // Table of Contents
  checkPageBreak(80);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margin, yPosition);
  yPosition += 10;
  const tocItems = ['1. Executive Summary', '2. Meta Tags Analysis', '3. GEO Analysis (AI Engine Optimization)', '4. AI-Powered Insights', '5. Issues & Recommendations', '6. Technical SEO Details'];
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  tocItems.forEach((item: string) => {
    yPosition += 7;
    doc.text(item, margin + 5, yPosition);
  });

  // EXECUTIVE SUMMARY
  doc.addPage();
  yPosition = 20;
  addSectionHeader('1. Executive Summary', [37, 99, 235]);
  yPosition += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall Performance', margin, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Score', 'Status']],
    body: [
      ['SEO Score', data.score + '/100', scoreLabel],
      ['GEO AI Readiness', data.geoAnalysis.aiReadinessScore + '/100', data.geoAnalysis.aiReadinessScore >= 70 ? 'Good' : 'Needs Work'],
      ['GEO AI Ranking', data.geoAnalysis.aiRankingScore + '/100', data.geoAnalysis.aiRankingScore >= 70 ? 'Competitive' : 'Improve'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { halign: 'center', cellWidth: 40 }, 2: { halign: 'center' } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Key Findings
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Findings', margin, yPosition);
  yPosition += 8;
  const findings = [];
  if (data.headings.h1.length !== 1) findings.push('H1 Tags: ' + (data.headings.h1.length === 0 ? 'Missing' : 'Multiple found') + ' (should be exactly 1)');
  if (!data.metaDescription) findings.push('Meta description is missing');
  if (data.images.withoutAlt > 0) findings.push(data.images.withoutAlt + ' images missing alt text');
  if (data.geoAnalysis.entities.total === 0) findings.push('No named entities detected - low factual density');
  if (findings.length === 0) findings.push('No critical issues found - good job!');
  findings.forEach((finding: string) => { addText('• ' + finding, 10, false, 5); });

  // META TAGS
  checkPageBreak(50);
  addSectionHeader('2. Meta Tags Analysis', [37, 99, 235]);
  yPosition += 5;

  autoTable(doc, {
    startY: yPosition,
    head: [['Element', 'Content', 'Status']],
    body: [
      ['Title', data.title || 'Not found', data.title ? (data.title.length >= 50 && data.title.length <= 60 ? 'Optimal' : data.title.length < 50 ? 'Too short' : 'Too long') : 'Missing'],
      ['Meta Description', data.metaDescription || 'Not found', data.metaDescription ? (data.metaDescription.length >= 150 && data.metaDescription.length <= 160 ? 'Optimal' : 'Check length') : 'Missing'],
      ['Meta Keywords', data.metaKeywords || 'Not set', data.metaKeywords ? 'Present' : 'Optional'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 90 }, 2: { halign: 'center', cellWidth: 30 } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Social Media Tags
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Social Media Tags', margin, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Platform', 'Property', 'Value']],
    body: [
      ['Open Graph', 'Title', data.openGraph.title || 'Not set'],
      ['Open Graph', 'Description', data.openGraph.description || 'Not set'],
      ['Open Graph', 'Image', data.openGraph.image || 'Not set'],
      ['Twitter', 'Card Type', data.twitter.card || 'Not set'],
      ['Twitter', 'Title', data.twitter.title || 'Not set'],
      ['Twitter', 'Description', data.twitter.description || 'Not set'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 116, 139], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 35 }, 2: { cellWidth: 90 } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;
  // GEO ANALYSIS
  doc.addPage();
  yPosition = 20;
  addSectionHeader('3. GEO Analysis - Generative Engine Optimization', [37, 99, 235]);
  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  addText('How well your content performs with AI engines like ChatGPT, Perplexity, and Gemini', 10);
  doc.setTextColor(0, 0, 0);
  yPosition += 5;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('AI-Readiness Factors', margin, yPosition);
  yPosition += 8;

  const factorsData = data.geoAnalysis.factors.map((f: any) => {
    const maxScore = f.factor === 'Sentence clarity' ? 30 : f.factor === 'Content structure' ? 25 : f.factor === 'Factual density' ? 20 : f.factor === 'Content length' ? 15 : 10;
    const percentage = Math.round((f.score / maxScore) * 100);
    return [f.factor, f.score + '/' + maxScore, percentage + '%', f.status];
  });

  autoTable(doc, {
    startY: yPosition,
    head: [['Factor', 'Score', 'Percentage', 'Status']],
    body: factorsData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { halign: 'center', cellWidth: 30 }, 2: { halign: 'center', cellWidth: 30 }, 3: { halign: 'center' } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Named Entities
  if (data.geoAnalysis.entities.total > 0) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Named Entities Detected (' + data.geoAnalysis.entities.total + ')', margin, yPosition);
    yPosition += 8;

    const entityRows = [];
    if (data.geoAnalysis.entities.people.length > 0) {
      entityRows.push(['People', String(data.geoAnalysis.entities.people.length), data.geoAnalysis.entities.people.slice(0, 5).join(', ')]);
    }
    if (data.geoAnalysis.entities.organizations.length > 0) {
      entityRows.push(['Organizations', String(data.geoAnalysis.entities.organizations.length), data.geoAnalysis.entities.organizations.slice(0, 5).join(', ')]);
    }
    if (data.geoAnalysis.entities.places.length > 0) {
      entityRows.push(['Places', String(data.geoAnalysis.entities.places.length), data.geoAnalysis.entities.places.slice(0, 5).join(', ')]);
    }

    if (entityRows.length > 0) {
      autoTable(doc, {
        startY: yPosition,
        head: [['Type', 'Count', 'Examples']],
        body: entityRows,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { halign: 'center', cellWidth: 20 }, 2: { cellWidth: 105 } }
      });
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }
  } else {
    checkPageBreak(20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    addText('No named entities detected. Consider adding specific people, organizations, or places to improve factual density.', 10);
    doc.setTextColor(0, 0, 0);
  }

  // Content Metrics
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Content Metrics', margin, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value', 'Assessment']],
    body: [
      ['Word Count', String(data.geoAnalysis.contentMetrics.wordCount), data.geoAnalysis.contentMetrics.wordCount >= 300 ? 'Good' : 'Too short'],
      ['Sentence Count', String(data.geoAnalysis.contentMetrics.sentenceCount), data.geoAnalysis.contentMetrics.sentenceCount >= 10 ? 'Good' : 'Limited'],
      ['Avg Words/Sentence', data.geoAnalysis.contentMetrics.avgSentenceLength.toFixed(1), data.geoAnalysis.contentMetrics.avgSentenceLength <= 20 ? 'Clear' : 'Complex'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { halign: 'center', cellWidth: 40 }, 2: { halign: 'center' } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // GEO Recommendations
  if (data.geoAnalysis.recommendations.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('GEO Recommendations', margin, yPosition);
    yPosition += 8;

    data.geoAnalysis.recommendations.forEach((rec: string, index: number) => {
      checkPageBreak(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text((index + 1) + '.', margin + 5, yPosition);
      doc.setFont('helvetica', 'normal');
      const recLines = doc.splitTextToSize(rec, pageWidth - 2 * margin - 15);
      recLines.forEach((line: string, lineIndex: number) => {
        if (lineIndex > 0) checkPageBreak();
        doc.text(line, margin + 12, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    });
  }

  // AI INSIGHTS
  if (data.aiInsights) {
    doc.addPage();
    yPosition = 20;
    addSectionHeader('4. AI-Powered Insights', [147, 51, 234]);
    yPosition += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Content Summary', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    addText(data.aiInsights.summary, 10);
    yPosition += 5;

    if (data.aiInsights.suggestions.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('SEO Improvement Suggestions', margin, yPosition);
      yPosition += 8;

      data.aiInsights.suggestions.forEach((suggestion: string, index: number) => {
        checkPageBreak(15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text((index + 1) + '.', margin + 5, yPosition);
        doc.setFont('helvetica', 'normal');
        const suggestionLines = doc.splitTextToSize(suggestion, pageWidth - 2 * margin - 15);
        suggestionLines.forEach((line: string, lineIndex: number) => {
          if (lineIndex > 0) checkPageBreak();
          doc.text(line, margin + 12, yPosition);
          yPosition += 5;
        });
        yPosition += 3;
      });
    }
  }

  // ISSUES & RECOMMENDATIONS
  doc.addPage();
  yPosition = 20;
  addSectionHeader('5. Issues & Recommendations', [234, 88, 12]);

  if (data.issues.length > 0) {
    yPosition += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text('Issues Found', margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;

    data.issues.forEach((issue: string, index: number) => {
      checkPageBreak(12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const issueLines = doc.splitTextToSize((index + 1) + '. ' + issue, pageWidth - 2 * margin - 10);
      issueLines.forEach((line: string, lineIndex: number) => {
        if (lineIndex > 0) checkPageBreak();
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });
    yPosition += 10;
  }

  if (data.recommendations.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text('Recommendations', margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;

    data.recommendations.forEach((rec: string, index: number) => {
      checkPageBreak(12);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const recLines = doc.splitTextToSize((index + 1) + '. ' + rec, pageWidth - 2 * margin - 10);
      recLines.forEach((line: string, lineIndex: number) => {
        if (lineIndex > 0) checkPageBreak();
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });
  }

  // TECHNICAL SEO DETAILS
  doc.addPage();
  yPosition = 20;
  addSectionHeader('6. Technical SEO Details', [37, 99, 235]);

  yPosition += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Headings Structure', margin, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Heading Type', 'Count', 'Status']],
    body: [
      ['H1', String(data.headings.h1.length), data.headings.h1.length === 1 ? 'Perfect' : data.headings.h1.length === 0 ? 'Missing' : 'Too many'],
      ['H2', String(data.headings.h2.length), data.headings.h2.length > 0 ? 'Good' : 'None found'],
      ['H3', String(data.headings.h3.length), data.headings.h3.length > 0 ? 'Good' : 'None found'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { halign: 'center', cellWidth: 40 }, 2: { halign: 'center' } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // H1 Tags Details
  if (data.headings.h1.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('H1 Tags Found', margin, yPosition);
    yPosition += 8;

    data.headings.h1.forEach((h1: string, index: number) => {
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const h1Lines = doc.splitTextToSize((index + 1) + '. ' + h1, pageWidth - 2 * margin - 10);
      h1Lines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 2;
    });
    yPosition += 5;
  }

  // Links Summary
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Links Analysis', margin, yPosition);
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [['Link Type', 'Count', 'Assessment']],
    body: [
      ['Internal Links', String(data.links.internalCount), data.links.internalCount >= 5 ? 'Good' : 'Add more'],
      ['External Links', String(data.links.externalCount), data.links.externalCount > 0 ? 'Good' : 'Consider adding'],
      ['Total Links', String(data.links.internalCount + data.links.externalCount), 'Combined'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { halign: 'center', cellWidth: 40 }, 2: { halign: 'center' } }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Images Analysis
  checkPageBreak(40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Images Analysis', margin, yPosition);
  yPosition += 8;

  const altTextPercentage = data.images.total > 0 ? Math.round((data.images.withAlt / data.images.total) * 100) : 0;

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Count', 'Status']],
    body: [
      ['Total Images', String(data.images.total), data.images.total > 0 ? 'Present' : 'None found'],
      ['With Alt Text', String(data.images.withAlt), altTextPercentage + '%'],
      ['Without Alt Text', String(data.images.withoutAlt), data.images.withoutAlt === 0 ? 'Perfect' : 'Fix needed'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { halign: 'center', cellWidth: 40 }, 2: { halign: 'center' } }
  });

  // Footer on last page
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  checkPageBreak(20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Report generated by OptiGenius - AI-Powered SEO & GEO Analysis', pageWidth / 2, yPosition, { align: 'center' });

  // Save PDF
  const fileName = 'OptiGenius-Report-' + new Date().toISOString().split('T')[0] + '.pdf';
  doc.save(fileName);
};
export const exportToMarkdown = (data: SEOData) => {
  let markdown = '';
  markdown += '# OptiGenius SEO Report\n\n';
  markdown += '**URL:** ' + data.url + '\n\n';
  markdown += '**Generated:** ' + new Date().toLocaleString() + '\n\n';
  markdown += '---\n\n';

  markdown += '## Overall Scores\n\n';
  markdown += '### SEO Score: ' + data.score + '/100\n';
  const scoreLabel = data.score >= 80 ? 'Excellent ✅' : data.score >= 60 ? 'Good ⚠️' : data.score >= 40 ? 'Needs Improvement ⚠️' : 'Poor ❌';
  markdown += '**Status:** ' + scoreLabel + '\n\n';

  markdown += '### GEO Analysis Scores\n';
  markdown += '- **AI Readiness Score:** ' + data.geoAnalysis.aiReadinessScore + '/100\n';
  markdown += '- **AI Ranking Prediction:** ' + data.geoAnalysis.aiRankingScore + '/100\n\n';
  markdown += '---\n\n';

  markdown += '## Meta Tags\n\n';
  markdown += '### Title\n' + (data.title || '*Not found*') + '\n\n';
  markdown += '### Meta Description\n' + (data.metaDescription || '*Not found*') + '\n\n';
  if (data.metaKeywords) {
    markdown += '### Meta Keywords\n' + data.metaKeywords + '\n\n';
  }
  markdown += '---\n\n';

  markdown += '## GEO Analysis - Generative Engine Optimization\n\n';
  markdown += '*How well your content performs with AI engines like ChatGPT, Perplexity, and Gemini*\n\n';

  markdown += '### AI-Readiness Factors\n\n';
  data.geoAnalysis.factors.forEach((factor) => {
    markdown += '- **' + factor.factor + ':** ' + factor.score + ' (' + factor.status + ')\n';
  });
  markdown += '\n';

  if (data.geoAnalysis.entities.total > 0) {
    markdown += '### Named Entities (' + data.geoAnalysis.entities.total + ')\n\n';
    
    if (data.geoAnalysis.entities.people.length > 0) {
      markdown += '#### People (' + data.geoAnalysis.entities.people.length + ')\n';
      data.geoAnalysis.entities.people.forEach((person) => {
        markdown += '- ' + person + '\n';
      });
      markdown += '\n';
    }

    if (data.geoAnalysis.entities.organizations.length > 0) {
      markdown += '#### Organizations (' + data.geoAnalysis.entities.organizations.length + ')\n';
      data.geoAnalysis.entities.organizations.forEach((org) => {
        markdown += '- ' + org + '\n';
      });
      markdown += '\n';
    }

    if (data.geoAnalysis.entities.places.length > 0) {
      markdown += '#### Places (' + data.geoAnalysis.entities.places.length + ')\n';
      data.geoAnalysis.entities.places.forEach((place) => {
        markdown += '- ' + place + '\n';
      });
      markdown += '\n';
    }
  } else {
    markdown += '### Named Entities\n*No named entities detected. Consider adding specific people, organizations, or places to improve factual density.*\n\n';
  }

  markdown += '### Content Metrics\n\n';
  markdown += '| Metric | Value |\n';
  markdown += '|--------|-------|\n';
  markdown += '| Word Count | ' + data.geoAnalysis.contentMetrics.wordCount + ' |\n';
  markdown += '| Sentence Count | ' + data.geoAnalysis.contentMetrics.sentenceCount + ' |\n';
  markdown += '| Avg Words/Sentence | ' + data.geoAnalysis.contentMetrics.avgSentenceLength + ' |\n\n';

  if (data.geoAnalysis.recommendations.length > 0) {
    markdown += '### GEO Recommendations\n\n';
    data.geoAnalysis.recommendations.forEach((rec, index) => {
      markdown += (index + 1) + '. ' + rec + '\n';
    });
    markdown += '\n';
  }

  markdown += '---\n\n';

  if (data.aiInsights) {
    markdown += '## AI-Powered Insights\n\n';
    markdown += '### Content Summary\n' + data.aiInsights.summary + '\n\n';

    if (data.aiInsights.suggestions.length > 0) {
      markdown += '### SEO Improvement Suggestions\n\n';
      data.aiInsights.suggestions.forEach((suggestion, index) => {
        markdown += (index + 1) + '. ' + suggestion + '\n';
      });
      markdown += '\n';
    }
    markdown += '---\n\n';
  }

  if (data.issues.length > 0) {
    markdown += '## Issues Found ⚠️\n\n';
    data.issues.forEach((issue) => {
      markdown += '- ❌ ' + issue + '\n';
    });
    markdown += '\n';
  }

  if (data.recommendations.length > 0) {
    markdown += '## Recommendations ✅\n\n';
    data.recommendations.forEach((rec) => {
      markdown += '- ✅ ' + rec + '\n';
    });
    markdown += '\n';
  }

  markdown += '---\n\n';

  markdown += '## Headings Summary\n\n';
  markdown += '- **H1 Tags:** ' + data.headings.h1.length + '\n';
  markdown += '- **H2 Tags:** ' + data.headings.h2.length + '\n';
  markdown += '- **H3 Tags:** ' + data.headings.h3.length + '\n\n';

  if (data.headings.h1.length > 0) {
    markdown += '### H1 Tags\n';
    data.headings.h1.forEach((h1) => {
      markdown += '- ' + h1 + '\n';
    });
    markdown += '\n';
  }

  markdown += '---\n\n';

  markdown += '## Links Summary\n\n';
  markdown += '- **Internal Links:** ' + data.links.internalCount + '\n';
  markdown += '- **External Links:** ' + data.links.externalCount + '\n\n';
  markdown += '---\n\n';

  markdown += '## Images Summary\n\n';
  markdown += '- **Total Images:** ' + data.images.total + '\n';
  markdown += '- **With Alt Text:** ' + data.images.withAlt + '\n';
  markdown += '- **Without Alt Text:** ' + data.images.withoutAlt + '\n\n';

  markdown += '---\n\n';
  markdown += '## Social Media Tags\n\n';
  markdown += '### Open Graph\n';
  markdown += '- **Title:** ' + (data.openGraph.title || '*Not set*') + '\n';
  markdown += '- **Description:** ' + (data.openGraph.description || '*Not set*') + '\n';
  markdown += '- **Image:** ' + (data.openGraph.image || '*Not set*') + '\n\n';

  markdown += '### Twitter Card\n';
  markdown += '- **Card Type:** ' + (data.twitter.card || '*Not set*') + '\n';
  markdown += '- **Title:** ' + (data.twitter.title || '*Not set*') + '\n';
  markdown += '- **Description:** ' + (data.twitter.description || '*Not set*') + '\n\n';

  markdown += '---\n\n';
  markdown += '*Report generated by OptiGenius - AI-Powered SEO & GEO Analysis*\n';

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'OptiGenius-Report-' + new Date().toISOString().split('T')[0] + '.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
