// backend/src/pusher.config.ts
import Pusher from "pusher";

export const pusher = new Pusher({
  appId: "2048957",
  key: "8afefd0184a77fa87da8",
  secret: "3071a924cd3241c57cc7",
  cluster: "mt1",
  useTLS: true,
});
