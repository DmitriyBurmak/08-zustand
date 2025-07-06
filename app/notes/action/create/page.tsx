import React from 'react';
import NoteForm from '@/components/NoteForm/NoteForm';
import { Metadata } from 'next';
import css from './CreateNote.module.css';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'NoteHub - Створити нотатку',
  description:
    'Створіть нову нотатку в NoteHub. Швидке та просте додавання нових записів.',
  openGraph: {
    title: 'NoteHub - Створити нотатку',
    description:
      'Створіть нову нотатку в NoteHub. Швидке та просте додавання нових записів.',
    url: `${baseUrl}/notes/action/create`,
    images: [
      {
        ...NOTEHUB_OG_IMAGE,
        alt: 'NoteHub - Create Note Page',
      },
    ],
    type: 'website',
    siteName: 'NoteHub',
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Створити нотатку</h1>
        <NoteForm />
      </div>
    </main>
  );
}
