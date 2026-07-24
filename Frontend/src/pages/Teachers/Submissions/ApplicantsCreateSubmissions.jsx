import { useParams } from "react-router-dom";

import PublicationForm from "../../../components/Forms/PublicationForm";
import PatentForm from "../../../components/Forms/PatentForm";
import BookForm from "../../../components/Forms/BookForm";
import StartupForm from "../../../components/Forms/StartupForm";
import CopyrightForm from "../../../components/Forms/CopyRightForm";
// ...

const FORM_MAP = {
  publication: PublicationForm,
  patent: PatentForm,
  book: BookForm,
  startup: StartupForm,
  copyright: CopyrightForm,
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
