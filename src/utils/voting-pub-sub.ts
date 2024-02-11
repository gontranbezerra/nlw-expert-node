// Pattern Pub/Sub -> Publish / Subscribers

export type Message = { pollOptionId: string; votes: number };
type Subscriber = (message: Message) => void;

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {};

  subscribe(pollId: string, subscriber: Subscriber) {
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }

    this.channels[pollId].push(subscriber);
  }

  publish(pollId: string, mensagens: Message) {
    console.log(this.channels)
    console.log(mensagens)
    if (!this.channels[pollId]) {
      return;
    }

    for (const subscriber of this.channels[pollId]) {
      subscriber(mensagens);
    }
  }
}

export const voting = new VotingPubSub();
