// Schemas for publications containing distinct metadata fields per subtype

export const journalSchema = {
  id: "journal",
  title: "Journal Publication Incentive Claim",
  sections: [
    {
      id: "pub_metadata",
      title: "1. Journal Details",
      fields: [
        { name: "title", label: "Paper Title", type: "text", required: true, gridSpan: 12, placeholder: "Enter complete title of paper" },
        { name: "journalName", label: "Journal Name", type: "text", required: true, gridSpan: 6, placeholder: "e.g., IEEE Transactions on Computers" },
        { name: "issn", label: "ISSN Number", type: "text", required: true, gridSpan: 6, placeholder: "e.g., 0018-9162" },
        { name: "publisher", label: "Publisher", type: "text", required: true, gridSpan: 6 },
        { name: "publicationDate", label: "Publication Date", type: "date", required: true, gridSpan: 6 },
        { name: "indexingTier", label: "Indexing Tier", type: "dropdown", options: ["Scopus & SCI/SCIE", "Scopus Only", "UGC CARE List", "Other"], required: true, gridSpan: 6 },
        { name: "quartile", label: "Journal Quartile", type: "dropdown", options: ["Q1", "Q2", "Q3", "Q4", "None"], required: true, gridSpan: 6, dependsOn: { field: "indexingTier", valueIn: ["Scopus & SCI/SCIE", "Scopus Only"] } },
        { name: "impactFactor", label: "Impact Factor", type: "text", required: false, gridSpan: 6 },
        { name: "doi", label: "DOI Link (Verification Link)", type: "doi_lookup", required: true, gridSpan: 6 },
        { name: "scopusUrl", label: "Scopus Profile Link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const conferenceSchema = {
  id: "conference",
  title: "Conference Proceeding Incentive Claim",
  sections: [
    {
      id: "conf_metadata",
      title: "1. Conference Details",
      fields: [
        { name: "title", label: "Paper Title", type: "text", required: true, gridSpan: 12 },
        { name: "conferenceName", label: "Conference Name", type: "text", required: true, gridSpan: 6 },
        { name: "organizer", label: "Organizer Society (IEEE, ACM, etc.)", type: "text", required: true, gridSpan: 6 },
        { name: "venue", label: "Venue Location", type: "text", required: true, gridSpan: 6 },
        { name: "conferenceDates", label: "Conference Dates", type: "text", required: true, gridSpan: 6, placeholder: "e.g. July 12-15, 2026" },
        { name: "doi", label: "DOI / Proceedings Link", type: "doi_lookup", required: true, gridSpan: 6 },
        { name: "proceedingsUrl", label: "Official Proceeding Verification Link", type: "verification_url", required: true, gridSpan: 6 }
      ]
    }
  ]
};

export const bookChapterSchema = {
  id: "book_chapter",
  title: "Book Chapter Claim",
  sections: [
    {
      id: "chapter_metadata",
      title: "1. Chapter Information",
      fields: [
        { name: "title", label: "Chapter Title", type: "text", required: true, gridSpan: 12 },
        { name: "bookTitle", label: "Book Title", type: "text", required: true, gridSpan: 6 },
        { name: "isbn", label: "ISBN Code", type: "text", required: true, gridSpan: 6 },
        { name: "publisher", label: "Publisher Name", type: "text", required: true, gridSpan: 6 },
        { name: "publicationDate", label: "Date of Publication", type: "date", required: true, gridSpan: 6 },
        { name: "chapterUrl", label: "Verification URL (Publisher Link)", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const editorialSchema = {
  id: "editorial",
  title: "Editorial Contribution Claim",
  sections: [
    {
      id: "editorial_metadata",
      title: "1. Editorial Assignment details",
      fields: [
        { name: "journalName", label: "Journal Name", type: "text", required: true, gridSpan: 6 },
        { name: "issn", label: "Journal ISSN", type: "text", required: true, gridSpan: 6 },
        { name: "publisher", label: "Publisher", type: "text", required: true, gridSpan: 6 },
        { name: "roleVolume", label: "Volume & Issue Handled", type: "text", required: true, gridSpan: 6 },
        { name: "editorialUrl", label: "Editorial Page Verification Link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const reviewArticleSchema = {
  id: "review_article",
  title: "Review Article Incentive Claim",
  sections: [
    {
      id: "review_metadata",
      title: "1. Review Paper details",
      fields: [
        { name: "title", label: "Review Article Title", type: "text", required: true, gridSpan: 12 },
        { name: "journalName", label: "Journal Name", type: "text", required: true, gridSpan: 6 },
        { name: "issn", label: "Journal ISSN", type: "text", required: true, gridSpan: 6 },
        { name: "indexingTier", label: "Indexing Tier", type: "dropdown", options: ["Scopus & SCI/SCIE", "UGC CARE", "Other"], required: true, gridSpan: 6 },
        { name: "reviewUrl", label: "Article Verification URL", type: "verification_url", required: true, gridSpan: 6 }
      ]
    }
  ]
};
