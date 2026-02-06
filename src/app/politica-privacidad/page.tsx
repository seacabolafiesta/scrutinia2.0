import Link from 'next/link';

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 transition-colors">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-slate-800 pb-4">
          Política de Privacidad
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Responsable del Tratamiento</h2>
            <p className="mb-4">
              <strong>Identidad:</strong> Se Acabó La Fiesta (SALF)<br />
              <strong>Contacto DPD:</strong> <a href="mailto:privacidad@scrutinia.com" className="text-cyan-400 hover:underline">privacidad@scrutinia.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Finalidad del Tratamiento</h2>
            <p className="mb-4">
              En Scrutinia tratamos la información que nos facilitan las personas interesadas con las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Verificación Electoral:</strong> Gestionar la subida, almacenamiento y verificación de imágenes de actas electorales para garantizar la transparencia del proceso de escrutinio.</li>
              <li><strong>Gestión de Usuarios:</strong> Administrar el registro de usuarios colaboradores, apoderados o interventores que participan en la plataforma.</li>
              <li><strong>Asesoría Legal:</strong> Gestionar las consultas legales recibidas a través de nuestro chatbot o formularios de contacto relacionadas con incidencias electorales.</li>
              <li><strong>Seguridad:</strong> Garantizar la seguridad de la red y de la información, previniendo accesos no autorizados o ataques a la plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Legitimación</h2>
            <p className="mb-4">
              La base legal para el tratamiento de sus datos es:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Interés Público:</strong> Para las actividades de verificación y transparencia electoral, fundamentado en la participación democrática y el control ciudadano de los procesos electorales.</li>
              <li><strong>Consentimiento:</strong> Para el registro de usuarios y el envío de consultas, basado en el consentimiento expreso del interesado al registrarse o enviar el formulario.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Destinatarios</h2>
            <p className="mb-4">
              Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal o sea necesario para el cumplimiento de las finalidades descritas (ej. presentación de denuncias ante la Junta Electoral o Juzgados si se detectan irregularidades graves).
            </p>
            <p className="mb-4">
              Al ser un proyecto de software libre y datos abiertos, los datos agregados y anonimizados de los resultados electorales (actas) podrán ser puestos a disposición pública para su análisis estadístico y verificación independiente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">5. Derechos</h2>
            <p className="mb-4">
              Cualquier persona tiene derecho a obtener confirmación sobre si en SALF estamos tratando datos personales que les conciernan o no. Las personas interesadas tienen derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Acceder a sus datos personales.</li>
              <li>Solicitar la rectificación de los datos inexactos.</li>
              <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</li>
              <li>Solicitar la limitación del tratamiento de sus datos.</li>
              <li>Oponerse al tratamiento.</li>
            </ul>
            <p>
              Para ejercer estos derechos, puede enviar un correo electrónico a <a href="mailto:privacidad@scrutinia.com" className="text-cyan-400 hover:underline">privacidad@scrutinia.com</a> acreditando su identidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">6. Protección de Datos en Actas Electorales</h2>
            <p>
              Las actas de escrutinio son documentos públicos. No obstante, Scrutinia aplicará medidas técnicas para minimizar la exposición de datos personales innecesarios (como nombres de interventores o vocales) que pudieran aparecer en las imágenes, centrando el tratamiento en los datos numéricos de resultados electorales necesarios para la finalidad de verificación.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
