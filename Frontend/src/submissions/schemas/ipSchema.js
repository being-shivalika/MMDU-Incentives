// Schemas for Intellectual Property (Patent stages and Copyrights)

export const patentFiledSchema = {
  id: "patent_filed",
  title: "Filed Patent Incentive Claim",
  sections: [
    {
      id: "filed_metadata",
      title: "1. Patent Application (Filed)",
      fields: [
        { name: "title", label: "Patent Title", type: "text", required: true, gridSpan: 12 },
        { name: "applicationNumber", label: "Application Number", type: "patent_number", required: true, gridSpan: 6 },
        { name: "patentOffice", label: "Patent Office (IPO New Delhi, USPTO, etc.)", type: "text", required: true, gridSpan: 6 },
        { name: "filingDate", label: "Date of Filing", type: "date", required: true, gridSpan: 6 },
        { name: "patentUrl", label: "Official Patent Registry search link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const patentPublishedSchema = {
  id: "patent_published",
  title: "Published Patent Incentive Claim",
  sections: [
    {
      id: "published_metadata",
      title: "1. Published Patent details",
      fields: [
        { name: "title", label: "Patent Title", type: "text", required: true, gridSpan: 12 },
        { name: "applicationNumber", label: "Application Number", type: "patent_number", required: true, gridSpan: 6 },
        { name: "patentOffice", label: "Patent Office", type: "text", required: true, gridSpan: 6 },
        { name: "publicationDate", label: "Date of Publication", type: "date", required: true, gridSpan: 6 },
        { name: "patentUrl", label: "Official Patent Registry search link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const patentGrantedSchema = {
  id: "patent_granted",
  title: "Granted Patent Incentive Claim",
  sections: [
    {
      id: "granted_metadata",
      title: "1. Granted Patent details",
      fields: [
        { name: "title", label: "Patent Title", type: "text", required: true, gridSpan: 12 },
        { name: "patentNumber", label: "Patent Number / Grant No.", type: "patent_number", required: true, gridSpan: 6 },
        { name: "patentOffice", label: "Patent Office", type: "text", required: true, gridSpan: 6 },
        { name: "grantDate", label: "Date of Grant", type: "date", required: true, gridSpan: 6 },
        { name: "patentUrl", label: "Patent Office Registry Search Link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const copyrightSchema = {
  id: "copyright",
  title: "Copyright Incentive Claim",
  sections: [
    {
      id: "copyright_metadata",
      title: "1. Copyright details",
      fields: [
        { name: "title", label: "Title of Work", type: "text", required: true, gridSpan: 12 },
        { name: "registrationNumber", label: "Registration Number", type: "text", required: true, gridSpan: 6 },
        { name: "workType", label: "Type of Work (Software, Monograph, etc.)", type: "dropdown", options: ["Software Code", "Literary Work", "Artistic Work", "Monograph / Manual"], required: true, gridSpan: 6 },
        { name: "registrationDate", label: "Date of Registration", type: "date", required: true, gridSpan: 6 },
        { name: "copyrightUrl", label: "Copyright portal search verification link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};
