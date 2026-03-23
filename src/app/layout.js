import './globals.css';

export const metadata = {
  title: 'Eloquence',
  description: 'Your personal speech coach',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}