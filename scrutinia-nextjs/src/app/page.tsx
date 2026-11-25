export const dynamic = 'force-dynamic';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AsesorSection from '@/components/AsesorSection';
import ScrutiniaSection from '@/components/ScrutiniaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ScrutiniaSection />
      <AsesorSection />
      <Footer />
    </>
  );
}
