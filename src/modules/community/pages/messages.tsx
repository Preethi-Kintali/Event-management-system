import { PageHeader } from "@/components/ds/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";

export function MessagesPage() {
  const threads = [
    {
      id: 1,
      name: "Rhea Kapoor",
      msg: "Are we still on for the hackathon?",
      time: "10:42 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "David Miller",
      msg: "I've sent over the API specs.",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Project X Team",
      msg: "Lina: We need to finalize the design.",
      time: "Monday",
      unread: 0,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <PageHeader
        title="Direct Messages"
        description="Private conversations and team chats."
        crumbs={[
          { label: "Engagement" },
          { label: "Community", to: "/community" },
          { label: "Messages" },
        ]}
      />

      <div className="flex-1 grid grid-cols-[300px_1fr] rounded-lg border border-border bg-surface overflow-hidden mt-4">
        <div className="border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search messages..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((t) => (
              <div
                key={t.id}
                className={`flex items-start gap-3 p-4 border-b border-border/50 cursor-pointer hover:bg-muted/50 ${t.unread > 0 ? "bg-muted/20" : ""}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} />
                  <AvatarFallback>{t.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <p
                      className={`text-sm truncate ${t.unread > 0 ? "font-semibold" : "font-medium"}`}
                    >
                      {t.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p
                    className={`text-xs truncate ${t.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {t.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-muted/10">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=Rhea Kapoor`} />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">Rhea Kapoor</p>
                <p className="text-[10px] text-emerald-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-center">
              <span className="text-[10px] bg-muted px-2 py-1 rounded-full text-muted-foreground">
                Today
              </span>
            </div>

            <div className="flex items-end gap-2 max-w-[80%]">
              <Avatar className="w-6 h-6">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm text-sm">
                Hey! I just saw we were matched as potential teammates.
              </div>
            </div>
            <div className="flex items-end gap-2 max-w-[80%]">
              <Avatar className="w-6 h-6 opacity-0">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-sm text-sm">
                Are we still on for the hackathon?
              </div>
            </div>

            <div className="flex items-end gap-2 max-w-[80%] ml-auto justify-end">
              <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-br-sm text-sm">
                Hi Rhea! Yes, absolutely. I'm reviewing the problem statements right now.
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border bg-surface">
            <div className="flex items-center gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
