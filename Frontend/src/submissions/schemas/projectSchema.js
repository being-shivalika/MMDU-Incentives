// Schemas for Innovation, Startups, and Projects

export const startupRegisteredSchema = {
  id: "startup_registered",
  title: "Startup Registered Incentive Claim",
  sections: [
    {
      id: "startup_reg_metadata",
      title: "1. Registered Startup details",
      fields: [
        { name: "title", label: "Company Name", type: "text", required: true, gridSpan: 12 },
        { name: "cinNumber", label: "CIN / LLP Registration Number", type: "text", required: true, gridSpan: 6 },
        { name: "registrationDate", label: "Incorporation Date", type: "date", required: true, gridSpan: 6 },
        { name: "websiteUrl", label: "MCA Registry / Portal search link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const startupIncubatedSchema = {
  id: "startup_incubated",
  title: "Startup Incubated Incentive Claim",
  sections: [
    {
      id: "startup_inc_metadata",
      title: "1. Incubation details",
      fields: [
        { name: "title", label: "Company Name", type: "text", required: true, gridSpan: 12 },
        { name: "incubationCenter", label: "Incubation Center Name", type: "text", required: true, gridSpan: 6 },
        { name: "incubationDate", label: "Date of Incubation", type: "date", required: true, gridSpan: 6 },
        { name: "incubationUrl", label: "Incubator Registry verification link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const startupCommercializedSchema = {
  id: "startup_commercialized",
  title: "Technology Transfer / Commercialization Claim",
  sections: [
    {
      id: "startup_comm_metadata",
      title: "1. Commercialization details",
      fields: [
        { name: "title", label: "Technology / Product Title", type: "text", required: true, gridSpan: 12 },
        { name: "licensee", label: "Licensee Organization", type: "text", required: true, gridSpan: 6 },
        { name: "royaltyFee", label: "Royalty / Licensing Fee (INR)", type: "currency", required: true, gridSpan: 6 },
        { name: "transferDate", label: "Transfer Date", type: "date", required: true, gridSpan: 6 },
        { name: "transferUrl", label: "Official Sanction / Transfer Agreement link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const consultancySchema = {
  id: "consultancy",
  title: "Consultancy Incentive Claim",
  sections: [
    {
      id: "consultancy_metadata",
      title: "1. Consultancy details",
      fields: [
        { name: "title", label: "Consultancy Assignment Title", type: "text", required: true, gridSpan: 12 },
        { name: "clientName", label: "Client Organization", type: "text", required: true, gridSpan: 6 },
        { name: "totalValue", label: "Consultancy Value (INR)", type: "currency", required: true, gridSpan: 6 },
        { name: "startDate", label: "Commencement Date", type: "date", required: true, gridSpan: 6 },
        { name: "completionDate", label: "Completion Date", type: "date", required: true, gridSpan: 6 },
        { name: "consultancyUrl", label: "Consultancy Agreement / Completion proof link", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};

export const fundedProjectSchema = {
  id: "funded_project",
  title: "Sponsored Research Project Claim",
  sections: [
    {
      id: "funded_metadata",
      title: "1. Sponsored Project details",
      fields: [
        { name: "title", label: "Project Title", type: "text", required: true, gridSpan: 12 },
        { name: "agency", label: "Funding Agency (DST, SERB, ISRO, Industry etc.)", type: "text", required: true, gridSpan: 6 },
        { name: "sanctionOrder", label: "Sanction Order Number", type: "text", required: true, gridSpan: 6 },
        { name: "grantAmount", label: "Total Sanctioned Amount (INR)", type: "currency", required: true, gridSpan: 6 },
        { name: "sanctionDate", label: "Sanction Date", type: "date", required: true, gridSpan: 6 },
        { name: "projectUrl", label: "Agency Sanction List / Verification URL", type: "verification_url", required: true, gridSpan: 12 }
      ]
    }
  ]
};
