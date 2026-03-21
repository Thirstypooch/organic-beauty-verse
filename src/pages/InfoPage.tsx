import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

interface InfoPageProps {
  page: "shipping" | "returns" | "faq" | "privacy" | "terms";
}

const PAGE_CONTENT: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  shipping: {
    title: "Información de Envío",
    sections: [
      {
        heading: "Tiempos de entrega",
        body: "Los pedidos se procesan en un plazo de 1 a 2 días hábiles. El tiempo de envío estándar es de 3 a 7 días hábiles dependiendo de tu ubicación. Ofrecemos envío express con entrega en 1 a 3 días hábiles por un costo adicional.",
      },
      {
        heading: "Costos de envío",
        body: "El envío estándar tiene un costo fijo que se calcula al momento del checkout según tu ubicación. Los pedidos superiores a $50 USD califican para envío gratuito dentro del territorio nacional.",
      },
      {
        heading: "Seguimiento de pedido",
        body: "Una vez que tu pedido sea despachado, recibirás un correo electrónico con el número de seguimiento para que puedas rastrear tu paquete en tiempo real.",
      },
      {
        heading: "Envíos internacionales",
        body: "Actualmente realizamos envíos a toda Latinoamérica. Los tiempos de entrega internacionales varían entre 7 y 15 días hábiles. Los impuestos y aranceles de importación corren por cuenta del comprador.",
      },
    ],
  },
  returns: {
    title: "Devoluciones y Reembolsos",
    sections: [
      {
        heading: "Política de devolución",
        body: "Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto. El producto debe estar sin abrir, en su empaque original y en perfectas condiciones para ser elegible para un reembolso completo.",
      },
      {
        heading: "Productos dañados o defectuosos",
        body: "Si recibes un producto dañado o defectuoso, contáctanos dentro de las 48 horas siguientes a la recepción. Te enviaremos un reemplazo sin costo adicional o procesaremos un reembolso completo incluyendo los gastos de envío.",
      },
      {
        heading: "Proceso de reembolso",
        body: "Una vez que recibamos el producto devuelto y verifiquemos su estado, procesaremos tu reembolso en un plazo de 5 a 10 días hábiles. El reembolso se realizará al mismo método de pago utilizado en la compra original.",
      },
      {
        heading: "Productos no elegibles",
        body: "Por razones de higiene, no aceptamos devoluciones de productos que hayan sido abiertos o utilizados, a menos que presenten un defecto de fabricación.",
      },
    ],
  },
  faq: {
    title: "Preguntas Frecuentes",
    sections: [
      {
        heading: "¿Los productos de YouOrganic son realmente orgánicos?",
        body: "Sí. Todos nuestros productos están formulados con ingredientes orgánicos certificados, provenientes de granjas que siguen prácticas de agricultura sostenible. No utilizamos parabenos, sulfatos, fragancias sintéticas ni químicos dañinos.",
      },
      {
        heading: "¿Son sus productos libres de crueldad animal?",
        body: "Absolutamente. YouOrganic nunca prueba sus productos en animales. Somos una marca 100% libre de crueldad (cruelty-free) y estamos comprometidos con el bienestar animal.",
      },
      {
        heading: "¿Cuánto duran los productos una vez abiertos?",
        body: "Recomendamos usar nuestros productos dentro de los 6 meses posteriores a la apertura del frasco. Al ser formulados con ingredientes naturales, es importante mantenerlos alejados de la exposición solar directa y en un lugar fresco.",
      },
      {
        heading: "¿Puedo usar los productos si tengo piel sensible?",
        body: "Nuestros productos están diseñados para ser suaves con todo tipo de piel, incluyendo pieles sensibles. Sin embargo, siempre recomendamos realizar una prueba de parche antes del primer uso. Si experimentas irritación, descontinúa su uso.",
      },
      {
        heading: "¿Cómo puedo contactar al servicio al cliente?",
        body: "Puedes contactarnos a través de nuestro correo electrónico hello@youorganic.com o mediante nuestras redes sociales. Nuestro equipo de atención al cliente está disponible de lunes a viernes, de 9:00 a 18:00 horas.",
      },
    ],
  },
  privacy: {
    title: "Política de Privacidad",
    sections: [
      {
        heading: "Información que recopilamos",
        body: "Recopilamos información personal que proporcionas voluntariamente al crear una cuenta, realizar una compra o contactarnos. Esto incluye tu nombre, dirección de correo electrónico, dirección de envío y número de teléfono.",
      },
      {
        heading: "Uso de la información",
        body: "Utilizamos tu información personal para procesar pedidos, mejorar nuestros servicios, enviar comunicaciones sobre tu pedido y, con tu consentimiento, enviarte información sobre nuevos productos y ofertas especiales.",
      },
      {
        heading: "Protección de datos",
        body: "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Tus datos de pago son procesados de forma segura a través de MercadoPago.",
      },
      {
        heading: "Tus derechos",
        body: "Tienes derecho a acceder, rectificar, cancelar u oponerte al tratamiento de tus datos personales. Para ejercer cualquiera de estos derechos, contáctanos a hello@youorganic.com.",
      },
    ],
  },
  terms: {
    title: "Términos de Servicio",
    sections: [
      {
        heading: "Aceptación de los términos",
        body: "Al acceder y utilizar el sitio web de YouOrganic, aceptas estos términos y condiciones de servicio. Si no estás de acuerdo con alguna parte de estos términos, te pedimos que no utilices nuestro sitio.",
      },
      {
        heading: "Productos y precios",
        body: "Nos esforzamos por mostrar los colores y las imágenes de nuestros productos con la mayor precisión posible. Sin embargo, los colores reales pueden variar según la configuración de tu pantalla. Los precios están sujetos a cambios sin previo aviso.",
      },
      {
        heading: "Propiedad intelectual",
        body: "Todo el contenido del sitio web de YouOrganic, incluyendo textos, imágenes, logotipos y diseños, es propiedad de YouOrganic y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización.",
      },
      {
        heading: "Limitación de responsabilidad",
        body: "YouOrganic no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso de nuestros productos. Nuestra responsabilidad máxima se limita al monto pagado por el producto en cuestión.",
      },
      {
        heading: "Ley aplicable",
        body: "Estos términos se rigen por las leyes vigentes. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales competentes.",
      },
    ],
  },
};

const InfoPage = ({ page }: InfoPageProps) => {
  const content = PAGE_CONTENT[page];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-youorganic-cream/30">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-youorganic-green mb-8">
            {content.title}
          </h1>
          <div className="space-y-6">
            {content.sections.map((section, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <h2 className="font-serif text-lg font-semibold text-youorganic-dark mb-3">
                    {section.heading}
                  </h2>
                  <p className="text-youorganic-dark/70 leading-relaxed text-sm">
                    {section.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfoPage;
