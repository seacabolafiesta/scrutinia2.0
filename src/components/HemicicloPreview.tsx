'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRealtimeScrutiny } from '@/hooks/useRealtimeScrutiny';
import { calculateDHondt } from '@/lib/dhondt';
import Hemiciclo from '@/components/escrutinio/Hemiciclo';

export default function HemicicloPreview() {
  const { resultados, isLoading } = useRealtimeScrutiny();

  const votosMap: { [partido: string]: number } = {};
  resultados.forEach((r) => {
    votosMap[r.candidatura] = r.votos_totales || 0;
  });

  const totalEscaños = 67;
  const { seats } = calculateDHondt(votosMap, totalEscaños, 0.03);
  const hasData = Object.values(seats).some((s) => s > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasData) {
    return null;
  }

  return (
    <div>
      <Hemiciclo escaños={seats} totalEscaños={totalEscaños} />
      <div className="text-center mt-6">
        <Link
          href="/escrutinio"
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 text-lg group"
        >
          Ver resultados completos
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
