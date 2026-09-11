import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import { WhatsAppFloatingButton, BackToTopButton } from '../common/FloatingButtons';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-charcoal focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
    >
      Skip to main content
    </a>
    <AnnouncementBar />
    <Header />
    <main id="main-content" className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFloatingButton />
    <BackToTopButton />
  </div>
);

export default MainLayout;
