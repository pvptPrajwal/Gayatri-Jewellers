import { Outlet } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import { WhatsAppFloatingButton, BackToTopButton } from '../common/FloatingButtons';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <AnnouncementBar />
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFloatingButton />
    <BackToTopButton />
  </div>
);

export default MainLayout;
