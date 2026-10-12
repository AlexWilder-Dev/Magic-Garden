import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Lineup from '../components/Lineup';
import GardenWalk from '../components/GardenWalk';
import ByDay from '../components/ByDay';
import FoodHighlights from '../components/FoodHighlights';
import Parties from '../components/Parties';
import Inside from '../components/Inside';
import Reviews from '../components/Reviews';
import PlayHere from '../components/PlayHere';
import FindUs from '../components/FindUs';
import VineLine from '../components/VineLine';
import { scrollToId } from '../lib/ui';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'The Magic Garden · Battersea';
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!target) return;
    const t = window.setTimeout(() => {
      scrollToId(target);
      navigate(location.pathname + location.search, { replace: true, state: null });
    }, 60);
    return () => window.clearTimeout(t);
  }, [location, navigate]);

  return (
    <>
      <Hero />
      <div className="threaded">
        <VineLine from={0.86} to={0.12} seed={3} />
        <Lineup />
      </div>
      <div className="threaded">
        <VineLine from={0.12} to={0.78} seed={11} />
        <GardenWalk />
      </div>
      <div className="threaded">
        <VineLine from={0.78} to={0.2} seed={5} />
        <ByDay />
      </div>
      <div className="threaded">
        <VineLine from={0.2} to={0.84} seed={23} />
        <FoodHighlights />
      </div>
      <div className="threaded">
        <VineLine from={0.84} to={0.1} seed={8} />
        <Parties />
      </div>
      <div className="threaded">
        <VineLine from={0.1} to={0.66} seed={19} />
        <Inside />
      </div>
      <div className="threaded">
        <VineLine from={0.66} to={0.3} seed={2} />
        <Reviews />
      </div>
      <PlayHere />
      <FindUs />
    </>
  );
}
