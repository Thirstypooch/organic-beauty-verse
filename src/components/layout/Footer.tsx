import { Link } from "react-router-dom";
import { Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Gracias por suscribirte a nuestro boletín!", {
      description: "Recibirás novedades sobre nuestros últimos productos y ofertas.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-youorganic-cream pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Sobre YouOrganic
            </h3>
            <p className="text-youorganic-dark mb-4">
              Creamos productos premium de skincare orgánico con ingredientes naturales.
              Nuestra misión es ofrecer soluciones de belleza efectivas y sustentables.
            </p>
            <div className="flex items-center">
              <span className="text-sm text-youorganic-dark">Hecho con</span>
              <Heart size={16} className="mx-1 text-youorganic-green" />
              <span className="text-sm text-youorganic-dark">para tu piel</span>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/products/facial"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link
                  to="/assistant"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Asistente de Belleza
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Atención al Cliente
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shipping"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Información de Envío
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Devoluciones y Reembolsos
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-youorganic-dark hover:text-youorganic-green transition-colors"
                >
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Boletín */}
          <div>
            <h3 className="font-serif text-xl font-medium mb-4 text-youorganic-green">
              Boletín
            </h3>
            <p className="text-youorganic-dark mb-4">
              Suscríbete para recibir novedades, acceso a ofertas exclusivas y más.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-youorganic-dark/60" size={18} />
                <Input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="w-full pl-10 pr-4 py-2 rounded-full border-youorganic-light-green focus:border-youorganic-green"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-youorganic-green hover:bg-youorganic-green/90 text-white"
              >
                Suscribirse
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-youorganic-light-brown/30 mt-8 pt-6 text-center">
          <p className="text-sm text-youorganic-dark">
            © {new Date().getFullYear()} YouOrganic. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
