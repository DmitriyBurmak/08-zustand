import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { NotesResponse } from '@/types/note';
import { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}
export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';

  const pageTitle =
    tag === 'all'
      ? 'NoteHub - Усі нотатки'
      : `NoteHub - Нотатки за тегом: ${tag}`;
  const pageDescription =
    tag === 'all'
      ? 'Переглядайте та керуйте всіма своїми нотатками на NoteHub.'
      : `Переглядайте та керуйте своїми нотатками, відфільтрованими за тегом "${tag}" на NoteHub.`;

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000';
  const pageUrl = `${baseUrl}/notes/filter/${tag.toLowerCase()}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tag === 'all' ? 'All notes' : `${tag} notes`} page`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';
  const apiTag = tag.toLowerCase() === 'all' ? undefined : tag;
  const queryClient = new QueryClient();
  const initialPage = 1;
  const initialSearch = '';
  const initialPerPage = 12;

  const queryKey = [
    'notes',
    initialPage,
    initialSearch,
    initialPerPage,
    apiTag,
  ];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () =>
      fetchNotes(initialPage, initialSearch, initialPerPage, apiTag),
  });

  const prefetchedNotesData = queryClient.getQueryData<NotesResponse>(queryKey);
  const initialNotes = prefetchedNotesData?.notes || [];
  const initialTotalPages = prefetchedNotesData?.totalPages || 1;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialNotes={initialNotes}
        initialTotalPages={initialTotalPages}
        currentTag={tag}
      />
    </HydrationBoundary>
  );
}
