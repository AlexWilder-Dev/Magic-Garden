import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ClockProvider } from './lib/clock';
import { UIProvider } from './lib/ui';
import Header from './components/Header';
import MobileBar from './components/MobileBar';
import Footer from './components/Footer';
import BookingSheet from './components/BookingSheet';
import EventSheet from './components/EventSheet';
import DemoBadge from './components/DemoBadge';
import ArchDefs from './components/ArchDefs';
import Home from './pages/Home';

const WhatsOn = lazy(() => import('./pages/WhatsOn'));
const Menu = lazy(() => import('./pages/Menu'));

function ScrollReset() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (!(state as { scrollTo?: string } | null)?.scrollTo) window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ClockProvider>
        <UIProvider>
          <ArchDefs />
          <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
            Skip to content
          </a>
          <ScrollReset />
          <Header />
          <main id="main" tabIndex={-1}>
            <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/whats-on" element={<WhatsOn />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <MobileBar />
          <DemoBadge />
          <BookingSheet />
          <EventSheet />
        </UIProvider>
      </ClockProvider>
    </MotionConfig>
  );
}
