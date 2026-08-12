import React from "react";
import SubmissionForm from "./SubmissionForm";

const ConferenceForm = ({
  formData,
  handleInputChange,
  handleAddAuthor,
  handleRemoveAuthor,
  onSubmit,
  onDraft,
}) => {
  return (
    <SubmissionForm
      title="Conference / Seminar Submission"
      category="Conference"
      showResearchSection={false}
      basicFields={{
        title: "Title of Paper",
        domain: "Research Area / Domain",
        dropdown: "Category (Conference / Seminar)",
      }}
      dropdownOptions={[
        "Conference",
        "Seminar",
        "Symposium",
        "Workshop",
        "Keynote Presentation",
      ]}
      verificationLabels={{
        first: "Paper Link / DOI / Proceeding URL",
        second: "Scopus / Indexing Link",
      }}
      formData={formData}
      handleInputChange={handleInputChange}
      handleAddAuthor={handleAddAuthor}
      handleRemoveAuthor={handleRemoveAuthor}
      onSubmit={onSubmit}
      onDraft={onDraft}
    >
      <div className="flex flex-col gap-5 text-left">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          Conference & Event Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name of Conference/Seminar */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide flex items-center">
              Name of Conference / Seminar <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <input
              type="text"
              name="conferenceTitle"
              placeholder="e.g. International Conference On Innovations In Computational Intelligence"
              value={formData?.conferenceTitle || ""}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 placeholder:text-neutral-400"
            />
          </div>

          {/* Level of Conference */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Level of Conference <span className="text-red-500">*</span>
            </label>
            <select
              name="conferenceLevel"
              value={formData?.conferenceLevel || "International"}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
            >
              <option value="International">International</option>
              <option value="National">National</option>
              <option value="Regional">Regional / State</option>
              <option value="Institutional">University / Institutional</option>
            </select>
          </div>

          {/* Type of Author(s) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Type of Author(s) <span className="text-red-500">*</span>
            </label>
            <select
              name="authorType"
              value={formData?.authorType || "Faculty"}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
            >
              <option value="Faculty">Faculty</option>
              <option value="Student">Student</option>
              <option value="Research Scholar">Research Scholar</option>
              <option value="Joint (Faculty & Student)">Joint (Faculty & Student)</option>
            </select>
          </div>

          {/* Indexing Tier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Indexing Tier <span className="text-red-500">*</span>
            </label>
            <select
              name="indexingTier"
              value={formData?.indexingTier || "IEEE / ACM / Scopus Indexed"}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
            >
              <option value="IEEE / ACM / Scopus Indexed">IEEE / ACM / Scopus Indexed</option>
              <option value="Other Indexed">Other Peer-Reviewed Indexed</option>
              <option value="Non-Indexed">Non-Indexed</option>
            </select>
          </div>

          {/* Organised By */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Organised By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="organizedBy"
              placeholder="e.g. KIET Deemed to be University / IEEE Delhi Section"
              value={formData?.organizedBy || ""}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 placeholder:text-neutral-400"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Conference Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData?.startDate || ""}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Conference End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData?.endDate || ""}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800"
            />
          </div>

          {/* Venue / Location */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Venue / Location
            </label>
            <input
              type="text"
              name="venue"
              placeholder="e.g. New Delhi, India / Hybrid Mode"
              value={formData?.venue || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition-all focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Certification checkbox */}
        <div className="mt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-neutral-800 focus:ring-neutral-800 transition-colors"
              name="certified"
              checked={formData?.certified || false}
              onChange={handleInputChange}
              required
            />
            <span className="text-xs leading-relaxed text-neutral-600 group-hover:text-neutral-800 transition-colors">
              I certify that I have presented/published this paper at the specified conference/seminar, and all authorship details, date ranges, and certificates attached are authentic.
            </span>
          </label>
        </div>
      </div>
    </SubmissionForm>
  );
};

export default ConferenceForm;
