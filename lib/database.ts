import { Client, Interaction, AnalyticsData } from './types';

class InMemoryDatabase {
  private clients: Map<string, Client> = new Map();
  private interactions: Map<string, Interaction[]> = new Map();

  // Client operations
  saveClient(client: Client): void {
    this.clients.set(client.id, client);
  }

  getClient(id: string): Client | undefined {
    return this.clients.get(id);
  }

  getClientByUsername(username: string): Client | undefined {
    return Array.from(this.clients.values()).find(
      (client) => client.username === username
    );
  }

  getAllClients(): Client[] {
    return Array.from(this.clients.values());
  }

  updateClient(id: string, updates: Partial<Client>): void {
    const client = this.clients.get(id);
    if (client) {
      this.clients.set(id, { ...client, ...updates });
    }
  }

  // Interaction operations
  saveInteraction(interaction: Interaction): void {
    const clientInteractions = this.interactions.get(interaction.clientId) || [];
    clientInteractions.push(interaction);
    this.interactions.set(interaction.clientId, clientInteractions);

    // Update client stats
    const client = this.clients.get(interaction.clientId);
    if (client) {
      this.updateClient(interaction.clientId, {
        lastInteraction: interaction.timestamp,
        totalInteractions: client.totalInteractions + 1,
      });
    }
  }

  getClientInteractions(clientId: string): Interaction[] {
    return this.interactions.get(clientId) || [];
  }

  getAllInteractions(): Interaction[] {
    return Array.from(this.interactions.values()).flat();
  }

  // Analytics
  getAnalytics(): AnalyticsData {
    const clients = this.getAllClients();
    const interactions = this.getAllInteractions();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayInteractions = interactions.filter(
      (i) => i.timestamp >= today
    );

    const conversions = interactions.filter((i) => i.converted).length;
    const linkClicks = interactions.filter((i) => i.linkClicked).length;
    const linksSent = interactions.filter((i) => i.linkSent).length;

    return {
      totalClients: clients.length,
      activeConversations: clients.filter(
        (c) => c.lastInteraction >= new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      conversionRate: linksSent > 0 ? (conversions / linksSent) * 100 : 0,
      linkClickRate: linksSent > 0 ? (linkClicks / linksSent) * 100 : 0,
      averageResponseTime: 2.5,
      dailyInteractions: todayInteractions.length,
      revenueGenerated: conversions * 297, // Assuming $297 per course
    };
  }

  // Demo data
  seedDemoData(): void {
    const demoClients: Client[] = [
      {
        id: '1',
        username: '@sarah_marketing',
        name: 'Sarah Johnson',
        personality: 'curious',
        stage: 'interest',
        interests: ['digital marketing', 'social media', 'growth'],
        lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000),
        totalInteractions: 5,
        linkClicks: 1,
        responseRate: 0.8,
        conversionProbability: 0.65,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        username: '@mike_entrepreneur',
        name: 'Mike Chen',
        personality: 'hesitant',
        stage: 'consideration',
        interests: ['entrepreneurship', 'passive income', 'courses'],
        lastInteraction: new Date(Date.now() - 5 * 60 * 60 * 1000),
        totalInteractions: 8,
        linkClicks: 2,
        responseRate: 0.6,
        conversionProbability: 0.45,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        username: '@emily_creator',
        name: 'Emily Rodriguez',
        personality: 'highly-engaged',
        stage: 'intent',
        interests: ['content creation', 'monetization', 'Instagram growth'],
        lastInteraction: new Date(Date.now() - 30 * 60 * 1000),
        totalInteractions: 12,
        linkClicks: 3,
        responseRate: 0.9,
        conversionProbability: 0.85,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        username: '@alex_skeptic',
        name: 'Alex Thompson',
        personality: 'skeptical',
        stage: 'awareness',
        interests: ['business', 'online courses', 'reviews'],
        lastInteraction: new Date(Date.now() - 12 * 60 * 60 * 1000),
        totalInteractions: 3,
        linkClicks: 0,
        responseRate: 0.4,
        conversionProbability: 0.25,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        username: '@lisa_busy',
        name: 'Lisa Park',
        personality: 'quick-tempered',
        stage: 'interest',
        interests: ['time management', 'productivity', 'side hustles'],
        lastInteraction: new Date(Date.now() - 8 * 60 * 60 * 1000),
        totalInteractions: 4,
        linkClicks: 1,
        responseRate: 0.5,
        conversionProbability: 0.35,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ];

    const demoInteractions: Interaction[] = [
      {
        id: 'int1',
        clientId: '1',
        type: 'comment',
        content: 'This looks interesting! How does it work?',
        response:
          "Great question! I love your curiosity 😊 The system is designed to help you scale your Instagram presence authentically. I've got a detailed breakdown that'll answer everything - let me send it to your DM so we can chat more freely!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        linkSent: false,
      },
      {
        id: 'int2',
        clientId: '2',
        type: 'dm',
        content: "I'm not sure if this is right for me...",
        response:
          "I totally get that feeling! It's smart to be thoughtful about what you invest in. Here's what I can tell you - over 847 people have already transformed their Instagram game with this exact system. What specific concerns do you have? I'm happy to address them directly.",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        linkSent: false,
      },
      {
        id: 'int3',
        clientId: '3',
        type: 'dm',
        content: 'Can you send me the link? I want to check it out!',
        response:
          "Yes! I love your energy 🔥 I'm sending you a special access link right now. Just a heads up - we only have 12 spots left at this price point, and they're going fast. Check your DM for the link!",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        linkSent: true,
        linkClicked: true,
      },
      {
        id: 'int4',
        clientId: '4',
        type: 'comment',
        content: 'Is this another scam?',
        response:
          "I appreciate the healthy skepticism - there's a lot of noise out there. What makes this different is we have real, verifiable results. I can share case studies and testimonials from actual students if you'd like. What would help you feel confident about this?",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        linkSent: false,
      },
      {
        id: 'int5',
        clientId: '5',
        type: 'dm',
        content: "I don't have time for long courses",
        response:
          "I hear you - time is everything. That's exactly why this is structured for busy people. 15-minute daily modules you can do between meetings or during your commute. No fluff, just what works. Would a quick overview help you see if it fits your schedule?",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        linkSent: false,
      },
    ];

    demoClients.forEach((client) => this.saveClient(client));
    demoInteractions.forEach((interaction) => this.saveInteraction(interaction));
  }
}

export const database = new InMemoryDatabase();
database.seedDemoData();
