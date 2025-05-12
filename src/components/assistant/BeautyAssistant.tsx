
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import ProductCard from "../products/ProductCard";
import { Product } from "@/types/product";
import { products } from "@/data/mockProducts";

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
        "👋 Hello! I'm your YouOrganic AI Beauty Assistant. How can I help you find the perfect skincare products today? You can ask me about:  \n\n- Products for specific skin concerns\n- Recommendations based on your skin type\n- Advice for creating a skincare routine\n- Information about ingredients\n\nI'm here to help you find your perfect match!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      let response: Message;
      let recommendedProducts: Product[] = [];

      // Simple keyword based recommendation
      const lowercaseInput = input.toLowerCase();

      if (lowercaseInput.includes("dry skin") || lowercaseInput.includes("hydrat")) {
        recommendedProducts = products.filter(
          (p) => 
            p.name.includes("Hydrating") || 
            p.name.includes("Body Butter") || 
            p.description.toLowerCase().includes("hydrat")
        ).slice(0, 2);
        
        response = {
          role: "assistant",
          content: `For dry skin, I recommend products with rich moisturizing ingredients like shea butter and hyaluronic acid. These will help restore your skin's moisture barrier and provide long-lasting hydration.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else if (lowercaseInput.includes("oily skin") || lowercaseInput.includes("acne") || lowercaseInput.includes("breakout")) {
        recommendedProducts = products.filter(
          (p) => 
            p.name.includes("Clay") || 
            p.name.includes("Gentle Facial Cleanser") || 
            p.description.toLowerCase().includes("oil")
        ).slice(0, 2);
        
        response = {
          role: "assistant",
          content: `For oily or acne-prone skin, I recommend products that help control excess oil while maintaining your skin's natural balance. Look for non-comedogenic formulas with ingredients like clay or tea tree oil.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else if (lowercaseInput.includes("anti-aging") || lowercaseInput.includes("wrinkle") || lowercaseInput.includes("fine line")) {
        recommendedProducts = products.filter(
          (p) => 
            p.name.includes("Anti-Aging") || 
            p.name.includes("Vitamin C") || 
            p.description.toLowerCase().includes("fine line")
        ).slice(0, 2);
        
        response = {
          role: "assistant",
          content: `For anti-aging concerns, I recommend products rich in antioxidants like vitamin C and peptides. These ingredients help reduce the appearance of fine lines and support collagen production for firmer skin.`,
          timestamp: new Date(),
          products: recommendedProducts,
        };
      } else {
        // Default response with random products
        recommendedProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
        
        response = {
          role: "assistant",
          content: `I'd love to help you find the perfect skincare products! Could you tell me more about your skin type and concerns? This will help me make more personalized recommendations for your needs.`,
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
          AI Beauty Assistant
        </h1>

        <Card className="border-youorganic-light-green mb-4">
          <div className="bg-youorganic-cream/80 p-4 border-b border-youorganic-light-green flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-youorganic-green flex items-center justify-center text-white">
                <span className="font-serif font-bold">YO</span>
              </div>
              <span className="ml-3 font-medium">YouOrganic Beauty Assistant</span>
            </div>
            <span className="text-sm text-youorganic-dark/70">
              Ready to help
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
                                src={product.imageUrl} 
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
                                <a href={`/products/${product.category.toLowerCase()}/${product.id}`}>
                                  View Details
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
          </div>

          <div className="p-4 border-t border-youorganic-light-green">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask me about skincare products..."
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
              Our AI assistant provides recommendations based on your input. For
              personalized advice, we recommend consulting with a skincare specialist.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BeautyAssistant;
