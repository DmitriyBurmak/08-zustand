import { Field, Form, Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { NoteTag, CreateNotePayload } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  initialValues: FormValues;
  onSubmitSuccess: () => void;
  onClose: () => void;
}

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Content must be at most 500 characters'),
  tag: Yup.string().oneOf(tags, 'invalid tag').required('Required'),
});

export default function NoteForm({
  initialValues,
  onSubmitSuccess,
  onClose,
}: NoteFormProps) {
  const queryClient = useQueryClient();
  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (values: CreateNotePayload) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });

      onSubmitSuccess();
    },
    onError: (error: Error) => {
      console.error('Error creating a note:', error);
    },
  });
  const handleSubmit = (values: FormValues) => {
    const payload: CreateNotePayload = {
      title: values.title,
      content: values.content,
      tag: values.tag,
    };
    createMutation(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows="8"
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isPending}
            >
              Create Note{' '}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
