'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useNotes } from '@/hooks/useNotes';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';
import Loader from '@/app/loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import type { Note, NotesResponse, NoteTag } from '@/types/note';

interface NotesClientProps {
  initialNotes: Note[];
  initialTotalPages: number;
  currentTag: string;
}

const NotesClient: React.FC<NotesClientProps> = ({
  initialNotes,
  initialTotalPages,
  currentTag,
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notesPerPage = 12;

  useEffect(() => {
    setPage(1);
    setSearch('');
  }, [currentTag]);

  const apiTag = currentTag.toLowerCase() === 'all' ? undefined : currentTag;

  const {
    data: notesData,
    isLoading,
    isError,
    error,
  } = useNotes(
    { page, search: debouncedSearch, perPage: notesPerPage, tag: apiTag },
    {
      initialData: {
        notes: initialNotes,
        totalPages: initialTotalPages,
        total: initialTotalPages * notesPerPage,
        page: 1,
      } as NotesResponse,
    }
  );

  const totalPages = notesData?.totalPages || 1;
  const currentNotes = notesData?.notes || [];

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOpenCreateModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const initialFormValues = {
    title: '',
    content: '',
    tag: 'Todo' as NoteTag,
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            page={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        )}

        <button className={css.button} onClick={handleOpenCreateModal}>
          Create Note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage message={error?.message || 'Unknown error'} />
      )}{' '}
      {!isLoading && !isError && currentNotes.length === 0 ? (
        <div className={css.message}>No notes to display.</div>
      ) : (
        !isLoading &&
        !isError &&
        currentNotes.length > 0 && <NoteList notes={currentNotes} />
      )}
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <h2 className={css.modalTitle}>Create note</h2>{' '}
          <NoteForm
            initialValues={initialFormValues}
            onSubmitSuccess={handleModalClose}
            onClose={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
