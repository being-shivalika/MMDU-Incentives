import SubmissionForm from "./SubmissionForm";

const PublicationForm = ({
  formData,
  handleInputChange,
  handleAddAuthor,
  handleRemoveAuthor,
  onSubmit,
  onDraft,
}) => {
  return (
    <SubmissionForm
      title="Publication Submission"
      category="Publication"
      basicFields={{
        title: "Publication Title",
        domain: "Research Area",
        dropdown: "Publication Type",
      }}
      // Updated to match your exact SRS requirements
      dropdownOptions={[
        "Journal",
        "Book",
        "Book Chapter",
        "Conference",
        "Editorial",
        "Case Report",
        "Meta-analysis",
        "Case Study",
      ]}
      verificationLabels={{
        first: "DOI",
        second: "Scopus Link",
      }}
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      <div className="flex flex-col gap-5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          Publication Specifics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Quartile
            </label>
            <select
              name="quartile"
              value={formData?.quartile || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
            >
              <option value="">Select Quartile</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Impact Factor
            </label>
            <input
              type="number"
              step="0.01"
              name="impactFactor"
              placeholder="e.g. 5.4"
              value={formData?.impactFactor || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-neutral-800 focus:ring-neutral-800 transition-colors"
              name="certified"
              checked={formData?.certified || false}
              onChange={handleInputChange}
            />
            <span className="text-sm leading-relaxed text-neutral-600 group-hover:text-neutral-800 transition-colors">
              I certify that all information provided in this submission is
              accurate and that all research details, authorship information,
              identifiers, verification links, and supporting metadata are
              authentic.
            </span>
          </label>
        </div>
      </div>
    </SubmissionForm>
  );
};

export default PublicationForm;