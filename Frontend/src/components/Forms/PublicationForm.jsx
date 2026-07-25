import SubmissionForm from "./SubmissionForm";

const PublicationForm = ({ formData, handleInputChange, handleAddAuthor, handleRemoveAuthor, onSubmit, onDraft }) => {
  return (
    <SubmissionForm
      title="Publication Submission"
      category="Publication"
      basicFields={{
        title: "Publication Title",
        domain: "Research Area",
        dropdown: "Publication Type",
      }}
      dropdownOptions={[
        "Journal paper ",
        "Conference Paper",
        "Publication ",
        "Review Article",
      ]}
      verificationLabels={{
        first: "DOI",
        second: "Scopus Profile Link",
        third: "Publisher URL",
        fourth: "Journal Website",
      }}
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs uppercase text-zinc-500 block mb-1.5">
              Quartile
            </label>
            <select
              name="quartile"
              value={formData?.quartile || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select Quartile</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-zinc-500 block mb-1.5">
              Impact Factor
            </label>
            <input
              type="number"
              step="0.01"
              name="impactFactor"
              placeholder="e.g. 5.4"
              value={formData?.impactFactor || ""}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 accent-black" 
              name="certified"
              checked={formData?.certified || false}
              onChange={handleInputChange}
            />
            <span className="text-sm leading-6 text-zinc-600">
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
