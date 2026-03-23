import './globals.css';

export const metadata = {
  title: 'Eloquence',
  description: 'Your personal speech coach',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FDFAF7] dark:bg-[#1C1410] transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}