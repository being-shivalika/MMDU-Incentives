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
    </SubmissionForm>
  );
};

export default PublicationForm;
