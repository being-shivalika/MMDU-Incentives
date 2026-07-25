export const CLAIM_CATEGORIES = {
  RESEARCH_PUBLICATIONS: 'research_publications',
  BOOKS_CHAPTERS: 'books_chapters',
  INTELLECTUAL_PROPERTY: 'intellectual_property',
  INNOVATION_PROJECTS: 'innovation_projects'
};

export const CLAIM_SUBTYPES = {
  // Research Publications
  JOURNAL: 'journal',
  CONFERENCE: 'conference',
  BOOK_CHAPTER: 'book_chapter',
  EDITORIAL: 'editorial',
  REVIEW_ARTICLE: 'review_article',
  
  // Books
  BOOK: 'book',
  BOOK_CHAPTER_VOL: 'book_chapter_vol',
  EDITED_BOOK: 'edited_book',
  
  // IP
  PATENT_FILED: 'patent_filed',
  PATENT_PUBLISHED: 'patent_published',
  PATENT_GRANTED: 'patent_granted',
  COPYRIGHT: 'copyright',
  
  // Innovation
  STARTUP_REGISTERED: 'startup_registered',
  STARTUP_INCUBATED: 'startup_incubated',
  STARTUP_COMMERCIALIZED: 'startup_commercialized',
  CONSULTANCY: 'consultancy',
  FUNDED_PROJECT: 'funded_project'
};

export const ALL_SUBTYPES = Object.values(CLAIM_SUBTYPES);
