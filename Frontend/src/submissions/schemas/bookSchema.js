// Schemas for authored and edited reference books

export const bookSchema = {
  id: "book",
  title: "Authored Book Incentive Claim",
  sections: [
    {
      id: "book_metadata",
      title: "1. Authored Book Details",
      fields: [
        { name: "title", label: "Book Title", type: "text", required: true, gridSpan: 12 },
        { name: "isbn", label: "ISBN Code", type: "text", required: true, gridSpan: 6 },
        { name: "publisher", label: "Publisher", type: "text", required: true, gridSpan: 6 },
        { name: "edition", label: "Edition/Year", type: "text", required: true, gridSpan: 6 },
        { name: "publicationDate", label: "Publication Date", type: "date", required: true, gridSpan: 6 },
        { name: "bookUrl", label: "Publisher Catalog Verification URL", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const editedBookSchema = {
  id: "edited_book",
  title: "Edited Volume Incentive Claim",
  sections: [
    {
      id: "edited_book_metadata",
      title: "1. Edited Book details",
      fields: [
        { name: "title", label: "Book Title", type: "text", required: true, gridSpan: 12 },
        { name: "editors", label: "List of Editors", type: "text", required: true, gridSpan: 12, placeholder: "Comma separated editors list" },
        { name: "isbn", label: "ISBN Code", type: "text", required: true, gridSpan: 6 },
        { name: "publisher", label: "Publisher", type: "text", required: true, gridSpan: 6 },
        { name: "editedBookUrl", label: "Publisher Catalog Verification URL", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};
