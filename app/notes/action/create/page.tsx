// app/notes/action/create/page.tsx
import React from 'react';
import NoteForm from '@/components/NoteForm/NoteForm'; // Будемо використовувати оновлену NoteForm
import { Metadata } from 'next';
import css from './CreateNote.module.css'; // Імпорт CSS для цієї сторінки

// Метадані для сторінки створення нотатки
export const metadata: Metadata = {
  title: 'NoteHub - Створити нотатку',
  description:
    'Створіть нову нотатку в NoteHub. Швидке та просте додавання нових записів.',
  openGraph: {
    title: 'NoteHub - Створити нотатку',
    description:
      'Створіть нову нотатку в NoteHub. Швидке та просте додавання нових записів.',
    url: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/notes/action/create`
      : 'http://localhost:3000/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg', // Використовуємо те саме зображення
        width: 1200,
        height: 630,
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
        {/* Компонент NoteForm буде тут. Він буде обробляти логіку форми. */}
        <NoteForm />
      </div>
    </main>
  );
}
