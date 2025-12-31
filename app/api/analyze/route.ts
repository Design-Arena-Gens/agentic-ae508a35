import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/ai-engine';
import { database } from '@/lib/database';
import { Client, Interaction } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { clientUsername, message, interactionType } = await request.json();

    if (!clientUsername || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create client
    let client = database.getClientByUsername(clientUsername);
    const interactionHistory = client
      ? database.getClientInteractions(client.id).map((i) => i.content)
      : [];

    // Analyze personality
    const personality = aiEngine.analyzePersonality(message, interactionHistory);

    // Generate response
    const generatedResponse = await aiEngine.generateResponse(
      message,
      personality,
      interactionHistory,
      client?.stage || 'awareness'
    );

    // Create or update client
    if (!client) {
      const newClient: Client = {
        id: Date.now().toString(),
        username: clientUsername,
        personality,
        stage: 'awareness',
        interests: [],
        lastInteraction: new Date(),
        totalInteractions: 1,
        linkClicks: 0,
        responseRate: 1.0,
        conversionProbability: 0.3,
        createdAt: new Date(),
      };
      database.saveClient(newClient);
      client = newClient;
    } else {
      // Update personality if it changed
      if (client.personality !== personality) {
        database.updateClient(client.id, { personality });
      }
    }

    // Calculate conversion probability
    const conversionProbability = aiEngine.calculateConversionProbability(
      personality,
      client.stage,
      client.totalInteractions,
      client.linkClicks
    );

    database.updateClient(client.id, { conversionProbability });

    // Save interaction
    const interaction: Interaction = {
      id: Date.now().toString(),
      clientId: client.id,
      type: interactionType || 'dm',
      content: message,
      response: generatedResponse.message,
      timestamp: new Date(),
      linkSent: generatedResponse.followUpAction?.includes('send_link'),
    };

    database.saveInteraction(interaction);

    // Check rate limits
    const recentInteractions = database
      .getAllInteractions()
      .filter((i) => i.timestamp > new Date(Date.now() - 60 * 60 * 1000));

    const riskAssessment = aiEngine.assessRiskLevel(recentInteractions.length, 1);

    return NextResponse.json({
      success: true,
      response: generatedResponse,
      client: {
        id: client.id,
        username: client.username,
        personality,
        conversionProbability,
      },
      riskAssessment,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze message' },
      { status: 500 }
    );
  }
}
