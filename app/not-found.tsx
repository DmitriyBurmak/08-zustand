import Link from 'next/link';
import css from './not-found.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page not found',
    description: 'Sorry, the page you are looking for does not exist.',
    url: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Page not found',
      },
    ],
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
