import { useParams } from "react-router-dom";

import ApplicantCreatePublication from "./ApplicantCreatePublication";
import ApplicantCreatePatent from "./ApplicantCreatePatent";
import ApplicantCreateBook from "./ApplicantCreateBook";
import ApplicantCreateBookChapter from "./ApplicantCreateBookChapter";
import ApplicantCreateBookSection from "./ApplicantCreateBookSection";
import ApplicantCreateProject from "./ApplicantCreateProject";
import ApplicantCreateClaim from "./ApplicantCreateClaim";
import ApplicantCreateConference from "./ApplicantCreateConference";

const FORM_MAP = {
  publication: ApplicantCreatePublication,
  patent: ApplicantCreatePatent,
  book: ApplicantCreateBook,
  book_chapter: ApplicantCreateBookChapter,
  book_section: ApplicantCreateBookSection,
  startup: ApplicantCreateProject,
  copyright: ApplicantCreateClaim,
  conference: ApplicantCreateConference,
};

const ApplicantsCreateSubmission = () => {
  const { category } = useParams();

  const FormComponent = FORM_MAP[category];

  if (!FormComponent) {
    return <div>Invalid Submission Type</div>;
  }

  return <FormComponent />;
};

export default ApplicantsCreateSubmission;
