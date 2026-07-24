// Configures the exactly four administrative claim categories of the institution.
// Each category lists the dynamic subtypes and schema definitions.

export const CLAIM_CATEGORIES = [
  {
    id: "research_publications",
    title: "Research Publications",
    description: "Incentive claims for peer-reviewed journal papers, conference proceedings, editorials, or review articles.",
    icon: "BookOpen",
    subtypes: [
      { id: "journal", label: "Journal Publication", schemaKey: "journalSchema" },
      { id: "conference", label: "Conference Publication", schemaKey: "conferenceSchema" },
      { id: "book_chapter", label: "Book Chapter", schemaKey: "bookChapterSchema" },
      { id: "editorial", label: "Editorial Article", schemaKey: "editorialSchema" },
      { id: "review_article", label: "Review Article", schemaKey: "reviewArticleSchema" }
    ]
  },
  {
    id: "books_chapters",
    title: "Books & Book Chapters",
    description: "Incentive claims for authored reference books, edited volumes, or chapters published with ISBN indices.",
    icon: "Book",
    subtypes: [
      { id: "book", label: "Authored Book", schemaKey: "bookSchema" },
      { id: "book_chapter_vol", label: "Book Chapter (Volume)", schemaKey: "bookChapterSchema" },
      { id: "edited_book", label: "Edited Book", schemaKey: "editedBookSchema" }
    ]
  },
  {
    id: "intellectual_property",
    title: "Intellectual Property",
    description: "Incentive claims for patents filed, published, or officially granted, and registered software copyrights.",
    icon: "ShieldCheck",
    subtypes: [
      { id: "patent_filed", label: "Patent Application (Filed)", schemaKey: "patentFiledSchema" },
      { id: "patent_published", label: "Patent Published", schemaKey: "patentPublishedSchema" },
      { id: "patent_granted", label: "Patent Granted", schemaKey: "patentGrantedSchema" },
      { id: "copyright", label: "Copyright Registered", schemaKey: "copyrightSchema" }
    ]
  },
  {
    id: "innovation_projects",
    title: "Innovation & Projects",
    description: "Claims for incubated startups, technology commercialization, consultancy assignments, or sponsored projects.",
    icon: "Briefcase",
    subtypes: [
      { id: "startup_registered", label: "Incubated Startup (Registered)", schemaKey: "startupRegisteredSchema" },
      { id: "startup_incubated", label: "Startup (Incubated)", schemaKey: "startupIncubatedSchema" },
      { id: "startup_commercialized", label: "Technology Transfer / Commercialized", schemaKey: "startupCommercializedSchema" },
      { id: "consultancy", label: "Consultancy Assignment", schemaKey: "consultancySchema" },
      { id: "funded_project", label: "Sponsored Research Project", schemaKey: "fundedProjectSchema" }
    ]
  }
];

export const getClaimTypeConfig = (subtypeId) => {
  for (const cat of CLAIM_CATEGORIES) {
    const found = cat.subtypes.find((t) => t.id === subtypeId);
    if (found) return { ...found, categoryId: cat.id, categoryTitle: cat.title };
  }
  return null;
};
