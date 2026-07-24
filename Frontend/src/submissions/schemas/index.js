import {
  journalSchema,
  conferenceSchema,
  bookChapterSchema,
  editorialSchema,
  reviewArticleSchema
} from "./publicationSchema";
import { bookSchema, editedBookSchema } from "./bookSchema";
import { patentFiledSchema, patentPublishedSchema, patentGrantedSchema, copyrightSchema } from "./ipSchema";
import {
  startupRegisteredSchema,
  startupIncubatedSchema,
  startupCommercializedSchema,
  consultancySchema,
  fundedProjectSchema
} from "./projectSchema";

export const ALL_SCHEMAS = {
  journalSchema,
  conferenceSchema,
  bookChapterSchema,
  editorialSchema,
  reviewArticleSchema,
  bookSchema,
  editedBookSchema,
  patentFiledSchema,
  patentPublishedSchema,
  patentGrantedSchema,
  copyrightSchema,
  startupRegisteredSchema,
  startupIncubatedSchema,
  startupCommercializedSchema,
  consultancySchema,
  fundedProjectSchema
};
