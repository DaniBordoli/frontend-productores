import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../assets/rutaycampoLogo.svg';
import { MobileNavbar } from '../components/MobileNavbar';

const STEPS = [
  {
    n: 1,
    title: 'Completá un breve formulario',
    desc: 'Indicá tus preferencias de envío y los detalles de tu carga',
  },
  {
    n: 2,
    title: 'Revisá la tarifa propuesta',
    desc: 'Confirmá la tarifa para avanzar con el pedido.',
  },
  {
    n: 3,
    title: 'Nos ocupamos del resto',
    desc: 'Coordinaremos el servicio para trasladar tu carga.',
  },
];

export const SolicitarViajeIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-300 lg:bg-white lg:flex-row lg:items-center lg:justify-center lg:p-8">
      {/* Mobile Navbar */}
      <MobileNavbar />
      
      <div className="flex flex-col flex-1 w-full lg:flex-row lg:flex-none lg:max-w-6xl lg:items-center lg:gap-14 xl:gap-20">

        {/* Left — placeholder image */}
        <div className="flex-1 lg:flex-none w-full lg:w-[520px] xl:w-[580px] lg:h-[660px] xl:h-[720px] lg:rounded-3xl overflow-hidden lg:shadow-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="text-gray-600 text-center">
            <p className="text-lg font-semibold">Imagen Placeholder</p>
            <p className="text-sm opacity-75 mt-2">Video o Imagen</p>
          </div>
        </div>

        {/* Right — content card */}
        <div className="relative mt-auto lg:mt-0 lg:flex-none w-full lg:max-w-lg lg:mx-0 bg-white rounded-t-[24px] lg:rounded-none px-4 py-8 lg:px-0 lg:py-0">

          {/* Close button - desktop only */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hidden lg:flex absolute -top-2 -right-12 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hover:bg-gray-50 transition-colors focus:outline-none z-10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          {/* Steps - mobile: horizontal scroll */}
          <div className="mb-8 lg:mb-10">
            <img src={logo} alt="Ruta y Campo" className="hidden lg:block w-14 h-14 mb-6" />
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">¡Creemos tu pedido!</h1>
            <p className="text-sm lg:text-base text-gray-500">
              En solo 3 pasos podés mover tu carga de forma segura y eficiente.
            </p>
          </div>

          {/* Steps - mobile: horizontal scroll */}
          <div className="flex overflow-x-auto snap-x snap-mandatory lg:hidden scrollbar-none" style={{ padding: '2rem 1rem' }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex-shrink-0 snap-start" style={{ padding: '0 1rem' }}>
                <div className="w-[72vw] p-4 rounded-2xl border border-gray-100 bg-white" style={{ boxShadow: '0px 1px 34px 0px rgba(16, 24, 40, 0.08)' }}>
                  <div className="w-10 h-10 rounded-full bg-[#45845C] flex items-center justify-center mb-4">
                    <span className="text-white text-sm font-semibold">{n}</span>
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-2">{title}</p>
                  <p className="text-sm font-normal" style={{ color: '#7A7A7A' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Steps - desktop: vertical list */}
          <div className="hidden lg:block space-y-3 mb-8">
            {STEPS.map(({ n, title, desc }) => (
              <div
                key={n}
                className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="w-9 h-9 rounded-full bg-[#45845C] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{n}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-[25%] lg:hidden bg-white border border-[#DEDEDE] hover:bg-gray-50 active:opacity-95 text-gray-900 py-3 lg:py-4 rounded-full text-sm lg:text-base font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              style={{ boxShadow: '0px 1px 34px 0px rgba(16, 24, 40, 0.08)' }}
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => navigate('/solicitar-viaje/form')}
              className="w-[75%] lg:w-full bg-gradient-to-r from-[#37784C] to-[#5F9C73] hover:opacity-90 active:opacity-95 text-white py-3 lg:py-4 rounded-full text-sm lg:text-base font-medium tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              style={{ boxShadow: '0px 1px 34px 0px rgba(16, 24, 40, 0.08)' }}
            >
              Comenzar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
