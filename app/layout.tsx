import './globals.css';
import Header from './components/Header';
import { Providers } from './providers';

export const metadata = {
  title: 'Finance App',
  description: 'Aplicação de Finanças',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
