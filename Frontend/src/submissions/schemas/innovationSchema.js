// Dynamic schemas for Incubated Startups and Technology Transfers

export const startupSchema = {
  id: "startup",
  title: "Incubated Startup Submission",
  sections: [
    {
      id: "startup_details",
      title: "1. Startup Registration & Entity Details",
      fields: [
        { name: "title", label: "Company Name", type: "text", required: true, gridSpan: 12 },
        { name: "cinNumber", label: "CIN / LLP Registration Number", type: "text", required: true, gridSpan: 6 },
        { name: "incubationCenter", label: "Incubation Center Name", type: "text", required: true, gridSpan: 6 },
        { name: "registrationDate", label: "Incorporation Date", type: "date", required: true, gridSpan: 6 },
        { name: "dpiitRecognized", label: "DPIIT Recognized?", type: "dropdown", options: ["Yes", "No", "In Progress"], required: true, gridSpan: 6 },
        { name: "websiteUrl", label: "Company Website URL", type: "verification_url", required: true }
      ]
    }
  ]
};

export const techTransferSchema = {
  id: "tech_transfer",
  title: "Technology Transfer Submission",
  sections: [
    {
      id: "transfer_details",
      title: "1. Commercialization & License Information",
      fields: [
        { name: "title", label: "Technology Title", type: "text", required: true, gridSpan: 12 },
        { name: "licensee", label: "Licensee Organization", type: "text", required: true, gridSpan: 6 },
        { name: "royaltyFee", label: "Royalty / Licensing Fee (INR)", type: "currency", required: true, gridSpan: 6 },
        { name: "transferDate", label: "Transfer Date", type: "date", required: true, gridSpan: 6 }
      ]
    }
  ]
};
