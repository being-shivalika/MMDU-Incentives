export const getMockSubmissions = () => {
  const data = localStorage.getItem("mock_submissions");
  if (data) return JSON.parse(data);

  // Default initial mock data
  const defaultData = [
    {
      id: "1",
      title: "Advanced AI Research",
      submissionType: "Journal",
      category: "Research",
      department: "Computer Science",
      domain: "Artificial Intelligence",
      submissionDate: "2026-07-20T10:00:00Z",
      status: "Under Review",
      currentReviewLevel: "RPC",
      reviewingAuthority: "Research Committee",
      lastUpdated: "2026-07-22T14:30:00Z",
      generalInfo: {
        title: "Advanced AI Research",
        submissionType: "Journal",
        category: "Research",
        domain: "Artificial Intelligence",
        subDomain: "Machine Learning",
        description: "A comprehensive study on advanced AI methodologies in modern healthcare.",
      },
      publicationDetails: {
        "Authors": "John Doe",
        verificationLinks: []
      },
      workflowInfo: {
        status: "Under Review",
        currentReviewLevel: "RPC",
        reviewingAuthority: "Research Committee",
        lastUpdated: "2026-07-22T14:30:00Z",
        history: []
      },
      reviewInfo: {},
      incentiveInfo: {
        incentiveCategory: "Category A",
        eligibleIncentive: "Yes",
        estimatedAmount: "$500",
        claimStatus: "Pending"
      },
      permissions: { canEdit: false }
    }
  ];
  
  localStorage.setItem("mock_submissions", JSON.stringify(defaultData));
  return defaultData;
};

export const saveMockSubmission = (formData, type, category) => {
  const submissions = getMockSubmissions();
  
  const newSubmission = {
    id: Date.now().toString(),
    title: formData.title || "Untitled Submission",
    submissionType: type,
    category: category,
    department: "Computer Science", // Mock
    domain: formData.domain || "General",
    submissionDate: new Date().toISOString(),
    status: "Submitted",
    currentReviewLevel: "HOD",
    reviewingAuthority: "Department Head",
    lastUpdated: new Date().toISOString(),
    
    // Details mappings
    generalInfo: {
      title: formData.title || "Untitled Submission",
      submissionType: type,
      category: category,
      domain: formData.domain || "General",
      subDomain: formData.dropdown || "",
      description: formData.description || "N/A"
    },
    publicationDetails: {
      "Authors": formData.authors ? formData.authors.map(a => a.name).join(", ") : "N/A",
      "Publication Year": formData.publicationYear || "N/A",
      "Publisher Name": formData.publisherName || "N/A",
      "Edition": formData.edition || "N/A",
      "Page Count": formData.pageCount || "N/A",
      verificationLinks: [
        { title: "Verification 1", type: "Link", url: formData.firstVerification },
        { title: "Verification 2", type: "Link", url: formData.secondVerification },
        { title: "Verification 3", type: "Link", url: formData.thirdVerification },
        { title: "Verification 4", type: "Link", url: formData.fourthVerification },
      ].filter(link => link.url && link.url.startsWith("https://"))
    },
    workflowInfo: {
      status: "Submitted",
      currentReviewLevel: "HOD",
      reviewingAuthority: "Department Head",
      lastUpdated: new Date().toISOString(),
      history: [
        { stage: "Draft Created", date: new Date().toISOString(), completed: true },
        { stage: "Submitted to HOD", date: new Date().toISOString(), completed: true }
      ]
    },
    reviewInfo: {
      reviewerRemarks: "None",
      revisionRequests: "None",
      approvalNotes: "None"
    },
    incentiveInfo: {
      incentiveCategory: "Pending Evaluation",
      eligibleIncentive: "Pending",
      estimatedAmount: "TBD",
      claimStatus: "Under Review"
    },
    permissions: {
      canEdit: false
    }
  };

  submissions.unshift(newSubmission);
  localStorage.setItem("mock_submissions", JSON.stringify(submissions));
  return newSubmission;
};
