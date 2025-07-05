import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { NotesResponse } from '@/types/note';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
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
