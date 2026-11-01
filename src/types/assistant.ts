import { Product } from "./product";
import { SkincareRoutine } from "./routine";

export type MessageRole = "user" | "assistant" | "system";

export interface ActionCardData {
  type: "routine_proposal" | "product_compare" | "budget_delta";
  title: string;
  description: string;
  proposedRoutine?: Partial<SkincareRoutine>;
  comparedProducts?: Product[];
  priceDifferenceINR?: number;
  newTotalINR?: number;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  toolInvoked?: string;
  actionCard?: ActionCardData;
}
