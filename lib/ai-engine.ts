import { ClientPersonality, GeneratedResponse, ResponseStrategy } from './types';

const responseStrategies: Record<ClientPersonality, ResponseStrategy> = {
  curious: {
    personality: 'curious',
    triggers: ['FOMO', 'Curiosity Gap', 'Exclusive Info'],
    tone: 'Engaging, question-based, spark interest',
    approach: 'Ask open-ended questions, tease valuable information, create mystery',
    examples: [
      "That's a great question! Before I answer, what's your biggest challenge with [topic]?",
      "I love your curiosity! There's something powerful I discovered that changed everything - want to know what it is?",
      "Interesting you ask that... most people don't realize the real secret is [tease]. Let me explain more in DM!",
    ],
  },
  hesitant: {
    personality: 'hesitant',
    triggers: ['Social Proof', 'Authority', 'Risk Reversal'],
    tone: 'Reassuring, data-driven, testimonial-heavy',
    approach: 'Provide concrete proof, share success stories, address concerns directly',
    examples: [
      "I totally understand your hesitation. That's why 847+ students have already seen results - here's what they say...",
      "It's smart to be thoughtful. Let me share exactly what you get and how others in your position transformed their results.",
      "I get it - investing in yourself is a big decision. What specific concerns can I address for you?",
    ],
  },
  'quick-tempered': {
    personality: 'quick-tempered',
    triggers: ['Respect', 'Brevity', 'Value'],
    tone: 'Direct, concise, respectful',
    approach: 'Acknowledge frustration, get to the point quickly, show value immediately',
    examples: [
      "I hear you. Bottom line: [specific benefit] in [timeframe]. No fluff. Want the details?",
      "Fair point. Here's the deal - [concrete value proposition]. That's it. Interested?",
      "Understood. Quick version: [problem] → [solution] → [result]. Should I send more info?",
    ],
  },
  skeptical: {
    personality: 'skeptical',
    triggers: ['Transparency', 'Evidence', 'Logic'],
    tone: 'Honest, detailed, fact-based',
    approach: 'Welcome skepticism, provide verifiable evidence, be transparent about limitations',
    examples: [
      "I appreciate the healthy skepticism. Here are the actual numbers and verifiable results...",
      "Great question - there's a lot of noise out there. Let me show you the proof: [specific evidence]",
      "I'd be skeptical too. That's why I can share case studies, testimonials, and our exact methodology. What would convince you?",
    ],
  },
  'highly-engaged': {
    personality: 'highly-engaged',
    triggers: ['Urgency', 'Exclusivity', 'FOMO'],
    tone: 'Energetic, action-oriented, urgent',
    approach: 'Match their energy, create urgency, fast-track to conversion',
    examples: [
      "Yes! I love your energy 🔥 Let's get you started right now - only 12 spots left at this price!",
      "Perfect timing! You're clearly ready for this. Sending you exclusive early access right now!",
      "Amazing! I can tell you're serious about this. Let me get you the special link before these spots fill up!",
    ],
  },
};

export class AIEngine {
  private strategies = responseStrategies;

  analyzePersonality(content: string, interactionHistory: string[]): ClientPersonality {
    const lowerContent = content.toLowerCase();

    // Quick-tempered indicators
    if (
      lowerContent.includes('waste') ||
      lowerContent.includes('busy') ||
      lowerContent.includes('no time') ||
      lowerContent.includes('annoying') ||
      lowerContent.length < 30
    ) {
      return 'quick-tempered';
    }

    // Skeptical indicators
    if (
      lowerContent.includes('scam') ||
      lowerContent.includes('proof') ||
      lowerContent.includes('trust') ||
      lowerContent.includes('legit') ||
      lowerContent.includes('real') ||
      lowerContent.includes('fake')
    ) {
      return 'skeptical';
    }

    // Hesitant indicators
    if (
      lowerContent.includes('not sure') ||
      lowerContent.includes('maybe') ||
      lowerContent.includes('hesitant') ||
      lowerContent.includes('thinking about') ||
      lowerContent.includes('concern')
    ) {
      return 'hesitant';
    }

    // Highly engaged indicators
    if (
      lowerContent.includes('yes') ||
      lowerContent.includes('link') ||
      lowerContent.includes('sign up') ||
      lowerContent.includes('interested') ||
      lowerContent.includes('ready') ||
      lowerContent.includes('!!') ||
      lowerContent.includes('🔥') ||
      (interactionHistory.length > 5 && content.length > 50)
    ) {
      return 'highly-engaged';
    }

    // Default to curious
    return 'curious';
  }

  async generateResponse(
    clientMessage: string,
    personality: ClientPersonality,
    interactionHistory: string[],
    stage: string
  ): Promise<GeneratedResponse> {
    const strategy = this.strategies[personality];
    const isReadyForLink = this.shouldSendLink(clientMessage, interactionHistory, personality);

    // Build context-aware response
    let message = '';
    let followUpAction = '';
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Check for forbidden patterns
    if (this.containsRiskyContent(clientMessage)) {
      riskLevel = 'high';
    }

    // Generate personality-specific response
    switch (personality) {
      case 'curious':
        if (isReadyForLink) {
          message =
            "I love your curiosity! I've prepared something special that answers all your questions in detail. Let me send you exclusive access via DM - you're going to love this! 💫";
          followUpAction = 'send_link_dm';
        } else if (
          clientMessage.toLowerCase().includes('how') ||
          clientMessage.toLowerCase().includes('what')
        ) {
          message =
            "Great question! The magic happens when you combine [specific strategy] with [unique approach]. But here's the thing most people miss... What's your biggest challenge with [their interest] right now?";
        } else {
          message =
            "I can tell you're thinking deeply about this! There's a powerful insight I discovered that changed everything. Before I share it, what draws you to [topic]?";
        }
        break;

      case 'hesitant':
        if (isReadyForLink) {
          message =
            "I totally understand wanting to make the right decision. That's exactly why 847+ people have trusted this system and seen real results. I've prepared a detailed breakdown with testimonials and guarantees - let me send it to your DM so you can see everything clearly.";
          followUpAction = 'send_link_dm';
        } else {
          message =
            "I completely get your hesitation - it's smart to be thoughtful. Here's what's different: we have verified results from real students, a complete satisfaction guarantee, and a proven step-by-step system. What specific concerns can I address for you?";
        }
        break;

      case 'quick-tempered':
        if (isReadyForLink) {
          message =
            "Got it. Bottom line: proven system, real results, 847+ success stories. Link coming to your DM now. 2 minutes to review.";
          followUpAction = 'send_link_dm';
        } else {
          message =
            "Understood. Quick version: [Problem solved] → [Specific results] → [Timeframe]. No fluff. Want proof?";
        }
        break;

      case 'skeptical':
        if (isReadyForLink) {
          message =
            "I appreciate your due diligence - that's smart. I've compiled verified testimonials, case studies with real numbers, and our complete methodology for you. Let me send this detailed proof package to your DM so you can review everything.";
          followUpAction = 'send_link_dm';
        } else {
          message =
            "Healthy skepticism is good - there's a lot of noise out there. Here's the transparency you deserve: verifiable results from 847+ students, concrete metrics, and our exact process. What specific evidence would help you feel confident?";
        }
        break;

      case 'highly-engaged':
        message =
          "Yes! I absolutely love your energy 🔥 You're clearly ready for this. I'm sending you exclusive early access right now via DM. Just a heads up - only 12 spots left at this investment level, and they're filling fast. Check your messages!";
        followUpAction = 'send_link_dm_urgent';
        break;
    }

    return {
      message,
      strategy: strategy.approach,
      triggers: strategy.triggers,
      followUpAction,
      riskLevel,
    };
  }

  private shouldSendLink(
    message: string,
    history: string[],
    personality: ClientPersonality
  ): boolean {
    const lowerMessage = message.toLowerCase();

    // Direct link requests
    if (
      lowerMessage.includes('link') ||
      lowerMessage.includes('send me') ||
      lowerMessage.includes('where can i') ||
      lowerMessage.includes('how do i buy') ||
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost')
    ) {
      return true;
    }

    // Highly engaged - send link faster
    if (personality === 'highly-engaged' && history.length >= 1) {
      return true;
    }

    // Others - after meaningful engagement
    if (history.length >= 2 && lowerMessage.includes('?')) {
      return true;
    }

    return false;
  }

  private containsRiskyContent(message: string): boolean {
    const riskyPatterns = [
      'guarantee money',
      'get rich',
      'make millions',
      'investment opportunity',
      'crypto',
      'forex',
      'pyramid',
      'mlm',
    ];

    const lowerMessage = message.toLowerCase();
    return riskyPatterns.some((pattern) => lowerMessage.includes(pattern));
  }

  calculateConversionProbability(
    personality: ClientPersonality,
    stage: string,
    interactions: number,
    linkClicks: number
  ): number {
    let baseScore = 0;

    // Personality weights
    const personalityScores: Record<ClientPersonality, number> = {
      'highly-engaged': 0.85,
      curious: 0.65,
      hesitant: 0.45,
      skeptical: 0.35,
      'quick-tempered': 0.4,
    };

    baseScore = personalityScores[personality];

    // Stage multiplier
    const stageMultipliers: Record<string, number> = {
      awareness: 0.3,
      interest: 0.6,
      consideration: 0.75,
      intent: 0.9,
      purchase: 1.0,
    };

    baseScore *= stageMultipliers[stage] || 0.5;

    // Interaction bonus
    if (interactions > 5) baseScore += 0.1;
    if (interactions > 10) baseScore += 0.1;

    // Link click bonus
    if (linkClicks > 0) baseScore += 0.15;
    if (linkClicks > 2) baseScore += 0.1;

    return Math.min(baseScore, 0.95);
  }

  assessRiskLevel(responseCount: number, timeWindow: number): {
    safe: boolean;
    message?: string;
  } {
    // Rate limiting rules
    const hourlyLimit = 30;
    const dailyLimit = 200;

    if (timeWindow === 1 && responseCount > hourlyLimit) {
      return {
        safe: false,
        message: `⚠️ RISK ALERT: Exceeded hourly limit (${responseCount}/${hourlyLimit}). Instagram may flag this as spam. Recommend pausing for 1 hour.`,
      };
    }

    if (timeWindow === 24 && responseCount > dailyLimit) {
      return {
        safe: false,
        message: `⚠️ RISK ALERT: Exceeded daily limit (${responseCount}/${dailyLimit}). High risk of account restriction. Recommend pausing until tomorrow.`,
      };
    }

    return { safe: true };
  }
}

export const aiEngine = new AIEngine();
