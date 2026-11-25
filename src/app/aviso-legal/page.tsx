import Link from 'next/link';

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
          Aviso Legal y Condiciones de Uso
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Información General</h2>
            <p className="mb-4">
              En cumplimiento con el deber de información recogido en la normativa vigente de Servicios de la Sociedad de la Información y de Comercio Electrónico, se facilitan a continuación los siguientes datos de información general de este sitio web:
            </p>
            <p className="mb-2">
              <strong>Titular:</strong> Se Acabó La Fiesta (en adelante, "SALF").<br />
              <strong>Objeto:</strong> Scrutinia es una plataforma de software libre diseñada para la transparencia electoral, verificación de actas y escrutinio ciudadano.<br />
              <strong>Contacto:</strong> <a href="mailto:info@scrutinia.com" className="text-cyan-400 hover:underline">info@scrutinia.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Software Libre y Licencia</h2>
            <p className="mb-4">
              Scrutinia es un proyecto de <strong>Software Libre</strong> desarrollado por la comunidad y el equipo técnico de SALF. El código fuente de esta plataforma está disponible para su auditoría, mejora y replicación bajo los términos de la licencia correspondiente publicada en nuestro repositorio oficial.
            </p>
            <p className="mb-4">
              Fomentamos la transparencia tecnológica como pilar fundamental de la transparencia democrática. Cualquier usuario es libre de estudiar cómo funciona el programa y adaptarlo a sus necesidades, siempre respetando la atribución original y los términos de la licencia libre.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Uso del Sitio Web</h2>
            <p className="mb-4">
              El acceso y uso de Scrutinia atribuye la condición de USUARIO, aceptando desde dicho acceso las presentes condiciones de uso. El USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que se ofrecen a través de la plataforma y, con carácter enunciativo pero no limitativo, a no emplearlos para:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.</li>
              <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos.</li>
              <li>Provocar daños en los sistemas físicos y lógicos de la plataforma, de sus proveedores o de terceras personas.</li>
              <li>Introducir datos falsos, actas manipuladas o información engañosa destinada a alterar la percepción del escrutinio electoral.</li>
            </ul>
            <p>
              Scrutinia se reserva el derecho de retirar o verificar cualquier contenido (como imágenes de actas) que contravenga estas normas o la integridad del proceso de verificación electoral.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Exclusión de Garantías y Responsabilidad</h2>
            <p className="mb-4">
              SALF no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
            <p>
              La información mostrada en Scrutinia tiene carácter informativo y de control ciudadano, no sustituyendo en ningún caso a los resultados oficiales provisionales o definitivos proclamados por las Juntas Electorales competentes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Modificaciones</h2>
            <p>
              SALF se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su portal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Legislación Aplicable</h2>
            <p>
              La relación entre SALF y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales competentes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
