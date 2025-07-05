// app/notes/[id]/page.tsx
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next'; // Імпорт Metadata
import type { Note } from '@/types/note'; // Імпорт типу Note

interface NoteDetailsPageProps {
  // Знову ж таки, params є Promise у вашому середовищі для обох функцій.
  params: Promise<{ id: string }>;
}

// generateMetadata - асинхронна функція для генерації метаданих сторінки
export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  // Отримуємо ID з params, враховуючи, що params є Promise
  const { id } = await params;
  const noteId = Number(id);

  // Якщо ID не є числом, повертаємо загальні метадані або метадані про помилку
  if (isNaN(noteId)) {
    return {
      title: 'Нотатка не знайдена',
      description: 'Запитувана нотатка не існує або ID недійсний.',
      openGraph: {
        title: 'Нотатка не знайдена',
        description: 'Запитувана нотатка не існує або ID недійсний.',
        url: 'http://localhost:3000/notes', // Або базовий URL вашого сайту
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub - Note not found',
          },
        ],
        type: 'website',
        siteName: 'NoteHub',
      },
    };
  }

  let note: Note | undefined;
  try {
    // Отримуємо дані нотатки. Використовуємо ту ж функцію, що і для prefetchQuery.
    note = await fetchNoteById(noteId);
  } catch (error) {
    console.error(
      `Помилка отримання нотатки для метаданих (ID: ${noteId}):`,
      error
    );
    // Якщо нотатка не знайдена, повертаємо метадані про помилку/відсутність
    return {
      title: 'Нотатка не знайдена',
      description: `Нотатка з ID ${noteId} не знайдена.`,
      openGraph: {
        title: 'Нотатка не знайдена',
        description: `Нотатка з ID ${noteId} не знайдена.`,
        url: `http://localhost:3000/notes/${noteId}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub - Note not found',
          },
        ],
        type: 'website',
        siteName: 'NoteHub',
      },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
  const pageUrl = `${baseUrl}/notes/${noteId}`;

  return {
    title: note.title,
    description:
      note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
    openGraph: {
      title: note.title,
      description:
        note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
      url: pageUrl,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${note.title}`,
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const noteId = Number(id);

  if (isNaN(noteId)) {
    return <div>Неправильний ID нотатки</div>;
  }

  const queryClient = new QueryClient();
  const queryKey = ['note', noteId];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={noteId} />
    </HydrationBoundary>
  );
}
