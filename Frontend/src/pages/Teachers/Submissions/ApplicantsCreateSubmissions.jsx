import { useParams } from "react-router-dom";

import ApplicantCreatePublication from "./ApplicantCreatePublication";
import ApplicantCreatePatent from "./ApplicantCreatePatent";
import ApplicantCreateBook from "./ApplicantCreateBook";
import ApplicantCreateProject from "./ApplicantCreateProject";
import ApplicantCreateClaim from "./ApplicantCreateClaim";

const FORM_MAP = {
  publication: ApplicantCreatePublication,
  patent: ApplicantCreatePatent,
  book: ApplicantCreateBook,
  startup: ApplicantCreateProject,
  copyright: ApplicantCreateClaim,
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
