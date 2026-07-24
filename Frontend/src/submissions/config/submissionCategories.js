// Central taxonomy of submission categories and submission types across the institution.
// Adding a new submission type only requires adding an entry here and attaching its schema key.

export const SUBMISSION_CATEGORIES = [
  {
    id: "research_publications",
    label: "Research Publications",
    description: "Peer-reviewed journal articles, conference papers, books, and book chapters",
    icon: "BookOpen",
    types: [
      {
        id: "journal_publication",
        label: "Journal Publication",
        description: "Indexed journals (Scopus, WoS, UGC-CARE)",
        schemaKey: "journalPublicationSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "conference_publication",
        label: "Conference Publication",
        description: "International and national conference proceedings",
        schemaKey: "conferencePublicationSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "book",
        label: "Book Publication",
        description: "Authored or edited books with ISBN",
        schemaKey: "bookSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "book_chapter",
        label: "Book Chapter",
        description: "Chapters published in edited volumes",
        schemaKey: "bookChapterSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      }
    ]
  },
  {
    id: "intellectual_property",
    label: "Intellectual Property",
    description: "Patents, copyrights, trademarks, and design registrations",
    icon: "ShieldCheck",
    types: [
      {
        id: "patent",
        label: "Patent Application / Grant",
        description: "Indian or International patent filings and grants",
        schemaKey: "patentSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "copyright",
        label: "Copyright Registration",
        description: "Software, literary, or artistic copyright grants",
        schemaKey: "copyrightSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "design_registration",
        label: "Design Registration",
        description: "Industrial design registration certificates",
        schemaKey: "designRegistrationSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      }
    ]
  },
  {
    id: "projects_consultancy",
    label: "Projects & Consultancy",
    description: "Sponsored research grants, industry consultancy projects, and seed grants",
    icon: "Briefcase",
    types: [
      {
        id: "funded_project",
        label: "Sponsored Research Grant",
        description: "Government or private agency funded research grants",
        schemaKey: "fundedProjectSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "consultancy",
        label: "Consultancy Assignment",
        description: "Industry consultation or contract research",
        schemaKey: "consultancySchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      }
    ]
  },
  {
    id: "innovation_incubation",
    label: "Innovation & Startup",
    description: "Faculty/Student startups, prototypes, and technology transfers",
    icon: "Rocket",
    types: [
      {
        id: "startup",
        label: "Incubated Startup",
        description: "Registered startup or spin-off company",
        schemaKey: "startupSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      },
      {
        id: "tech_transfer",
        label: "Technology Transfer",
        description: "Licensed technology or commercialized IP",
        schemaKey: "techTransferSchema",
        workflowKey: "STANDARD_RESEARCH_WORKFLOW",
        incentiveEligible: true
      }
    ]
  },
  {
    id: "recognition_awards",
    label: "Awards & Recognitions",
    description: "National, international, or professional society awards",
    icon: "Award",
    types: [
      {
        id: "research_award",
        label: "Research Award / Fellowship",
        description: "Prestigious academic awards or society fellowships",
        schemaKey: "researchAwardSchema",
        workflowKey: "FAST_TRACK_WORKFLOW",
        incentiveEligible: false
      }
    ]
  }
];

export const getSubmissionTypeConfig = (typeId) => {
  for (const cat of SUBMISSION_CATEGORIES) {
    const found = cat.types.find((t) => t.id === typeId);
    if (found) return { ...found, categoryId: cat.id, categoryLabel: cat.label };
  }
  return null;
};
