import { requireApprovedStudent } from "@/lib/auth";
import { ChatLayout } from "@/components/chat/ChatLayout";

export default async function AppPage() {
  await requireApprovedStudent();
  return (
    <div className="h-screen">
      <ChatLayout />
    </div>
  );
}
