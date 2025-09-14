import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  queryType?: 'temperature' | 'location' | 'salinity' | 'general';
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your oceanographic AI assistant. Ask me anything about Argo float data - temperature profiles, salinity measurements, float locations, or data trends. Try asking: "Show me temperature data for floats near 10°S, 75°E"',
      timestamp: '2 minutes ago',
      queryType: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // TODO: Remove mock functionality - integrate with real LLM backend
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: 'Just now'
    };

    // Mock bot response
    const mockResponses = [
      {
        content: "I found 4 active Argo floats in that region. The average temperature at 150m depth is 28.2°C. Would you like me to show you the detailed profile plots?",
        queryType: 'temperature' as const
      },
      {
        content: "Based on the latest data, float ARGO001 at coordinates (-10.5°, 75.2°) shows a salinity of 34.7 PSU at surface level. The salinity increases to 35.1 PSU at 200m depth.",
        queryType: 'salinity' as const
      },
      {
        content: "I've identified 12 floats within a 200km radius of those coordinates. 9 are currently active and reporting data. The most recent measurements were taken 2 hours ago.",
        queryType: 'location' as const
      }
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: randomResponse.content,
      timestamp: 'Just now',
      queryType: randomResponse.queryType
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
    console.log('Message sent:', inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQueries = [
    "Show temperature profiles for the Indian Ocean",
    "Find floats with salinity > 35 PSU",
    "What's the deepest measurement today?",
    "Compare temperatures at 100m vs 200m depth"
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Conversational Data Interface</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ask complex oceanographic questions in natural language. Our AI understands your queries and returns precise data insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Ocean Assistant
                  <Badge variant="secondary" className="ml-auto">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="flex-shrink-0">
                            {message.type === 'bot' ? (
                              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <Bot className="h-4 w-4 text-primary-foreground" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-card border'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className={`text-xs mt-2 flex items-center gap-2 ${
                              message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              <span>{message.timestamp}</span>
                              {message.queryType && message.type === 'bot' && (
                                <Badge variant="outline" className="text-xs py-0">
                                  {message.queryType}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about ocean data... (e.g., 'Show me temperature trends in the Arabian Sea')"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    data-testid="input-chat-message"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Queries & Help */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Queries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3"
                    onClick={() => {
                      setInputValue(query);
                      console.log('Quick query selected:', query);
                    }}
                    data-testid={`button-quick-query-${index}`}
                  >
                    <span className="text-sm">{query}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Query Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Temperature</Badge>
                  <p className="text-xs text-muted-foreground">Ask about temperature profiles, thermal layers, and trends</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Location</Badge>
                  <p className="text-xs text-muted-foreground">Find floats by coordinates, regions, or proximity</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Salinity</Badge>
                  <p className="text-xs text-muted-foreground">Explore salinity measurements and water mass properties</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">Trends</Badge>
                  <p className="text-xs text-muted-foreground">Analyze temporal patterns and data comparisons</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}