// Dynamic schema for Research Awards & Fellowships

export const researchAwardSchema = {
  id: "research_award",
  title: "Research Award / Fellowship Submission",
  sections: [
    {
      id: "award_details",
      title: "1. Award Metadata",
      fields: [
        { name: "title", label: "Award Name", type: "text", required: true, gridSpan: 12 },
        { name: "awardingBody", label: "Awarding Organization / Society", type: "text", required: true, gridSpan: 6 },
        { name: "awardLevel", label: "Award Scope", type: "dropdown", options: ["International", "National", "State / University"], required: true, gridSpan: 6 },
        { name: "awardDate", label: "Date Awarded", type: "date", required: true, gridSpan: 6 },
        { name: "awardUrl", label: "Official Award Announcement URL", type: "verification_url", required: true }
      ]
    }
  ]
};
