import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/schemas";
import { fetchProducts, fetchCategories } from "@/services/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  products?: Product[];
};

const BeautyAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu Asistente de Belleza YouOrganic. ¿Cómo puedo ayudarte a encontrar los productos de skincare perfectos hoy? Puedes preguntarme sobre:\n\n- Productos para preocupaciones específicas de la piel\n- Recomendaciones según tu tipo de piel\n- Consejos para crear una rutina de skincare\n- Información sobre ingredientes\n\n¡Estoy aquí para ayudarte a encontrar tu combinación perfecta!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Productos";
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      let response: Message;
      let recommendedProducts: Product[] = [];

      const lowercaseInput = input.toLowerCase();

      if (lowercaseInput.includes("seca") || lowercaseInput.includes("dry skin") || lowercaseInput.includes("hidrat")) {
        recommendedProducts = allProducts.filter(
          (p) =>
            p.description.toLowerCase().includes("hidrat") ||
            p.name.toLowerCase().includes("aloe") ||
            p.name.toLowerCase().includes("óleo")
        ).slice(0, 2);

        response = {
          role: "assistant",
          content: `Para piel seca, te recomiendo productos con ingredientes hidratantes ricos como ácido hialurónico y aceites orgánicos. Estos ayudarán a restaurar la barrera de humedad de tu piel y proporcionarán hidratación duradera.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else if (lowercaseInput.includes("acné") || lowercaseInput.includes("acne") || lowercaseInput.includes("oily")) {
        recommendedProducts = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes("acné") ||
            p.name.toLowerCase().includes("acne") ||
            p.name.toLowerCase().includes("cleanser")
        ).slice(0, 2);

        response = {
          role: "assistant",
          content: `Para piel con tendencia al acné, te recomiendo nuestros tratamientos especializados que ayudan a controlar el exceso de grasa mientras mantienen el equilibrio natural de tu piel.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else if (lowercaseInput.includes("anti") || lowercaseInput.includes("arrugas") || lowercaseInput.includes("aging")) {
        recommendedProducts = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes("antiaging") ||
            p.name.toLowerCase().includes("retinol") ||
            p.name.toLowerCase().includes("vita-c")
        ).slice(0, 2);

        response = {
          role: "assistant",
          content: `Para preocupaciones anti-envejecimiento, te recomiendo productos ricos en antioxidantes como vitamina C y retinol. Estos ingredientes ayudan a reducir la apariencia de líneas finas y estimulan la producción de colágeno.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else {
        recommendedProducts = [...allProducts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        response = {
          role: "assistant",
          content: `¡Me encantaría ayudarte a encontrar los productos de skincare perfectos! ¿Podrías contarme más sobre tu tipo de piel y tus preocupaciones? Esto me ayudará a hacer recomendaciones más personalizadas.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-bold mb-8 text-youorganic-green">
          Asistente de Belleza IA
        </h1>

        <Card className="border-youorganic-light-green mb-4">
          <div className="bg-youorganic-cream/80 p-4 border-b border-youorganic-light-green flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-youorganic-green flex items-center justify-center text-white">
                <span className="font-serif font-bold">YO</span>
              </div>
              <span className="ml-3 font-medium">Asistente de Belleza YouOrganic</span>
            </div>
            <span className="text-sm text-youorganic-dark/70">
              Lista para ayudarte
            </span>
          </div>

          <div className="bg-white p-4 h-[500px] overflow-y-auto flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-youorganic-green text-white"
                      : "bg-youorganic-cream text-youorganic-dark"
                  }`}
                >
                  <div className="whitespace-pre-line mb-1">{message.content}</div>
                  <div className="text-xs opacity-70 text-right">
                    {formatTime(message.timestamp)}
                  </div>

                  {message.products && message.products.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {message.products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex space-x-3">
                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={product.imageUrl || "https://via.placeholder.com/100"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-youorganic-dark text-sm mb-1">
                                {product.name}
                              </h4>
                              <p className="text-youorganic-dark/70 text-xs mb-2">
                                ${product.price.toFixed(2)}
                              </p>
                              <Button
                                asChild
                                variant="default"
                                size="sm"
                                className="w-full bg-youorganic-green hover:bg-youorganic-green/90 text-white text-xs py-1"
                              >
                                <a href={`/products/${getCategoryName(product.categoryId).toLowerCase()}/${product.id}`}>
                                  Ver Detalles
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-youorganic-cream text-youorganic-dark px-4 py-3 rounded-lg">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-youorganic-green animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-youorganic-green animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-youorganic-green animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-youorganic-light-green">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Pregúntame sobre productos de skincare..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none border-youorganic-light-green focus-visible:ring-youorganic-green"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-youorganic-green hover:bg-youorganic-green/90"
              >
                <Send size={18} />
              </Button>
            </div>
            <p className="text-xs text-youorganic-dark/60 mt-2">
              Nuestro asistente IA ofrece recomendaciones basadas en tu consulta. Para
              asesoría personalizada, recomendamos consultar con un especialista en skincare.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BeautyAssistant;
