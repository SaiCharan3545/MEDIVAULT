import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export interface AISearchResult {
  relevanceScore: number;
  matchedTerms: string[];
  semanticSimilarity: boolean;
}

export class AISearchService {
  static async analyzeSearchRelevance(
    searchQuery: string,
    patientCondition: string
  ): Promise<AISearchResult> {
    try {
      const prompt = `
        Analyze the medical search relevance between a search query and patient condition.
        
        Search Query: "${searchQuery}"
        Patient Condition: "${patientCondition}"
        
        Provide analysis in JSON format with:
        - relevanceScore: number (0-100, where 100 is exact match)
        - matchedTerms: array of matched medical terms
        - semanticSimilarity: boolean (true if semantically related even without exact terms)
        
        Consider medical synonyms, related conditions, and semantic relationships.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant specializing in condition matching and relevance analysis. Respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        relevanceScore: Math.max(0, Math.min(100, result.relevanceScore || 0)),
        matchedTerms: Array.isArray(result.matchedTerms) ? result.matchedTerms : [],
        semanticSimilarity: Boolean(result.semanticSimilarity)
      };
    } catch (error) {
      console.error("AI search analysis failed:", error);
      // Fallback to basic text matching
      return this.basicTextMatch(searchQuery, patientCondition);
    }
  }

  static async enhanceSearchQuery(query: string): Promise<string[]> {
    try {
      const prompt = `
        Enhance this medical search query with related terms and synonyms:
        "${query}"
        
        Provide a JSON array of related medical terms, conditions, and synonyms that would help find relevant patient records.
        Include common abbreviations and alternative spellings.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a medical terminology expert. Respond only with a valid JSON array of related medical terms."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 200
      });

      const result = JSON.parse(response.choices[0].message.content || "[]");
      return Array.isArray(result.terms) ? result.terms : [query];
    } catch (error) {
      console.error("Query enhancement failed:", error);
      return [query];
    }
  }

  private static basicTextMatch(searchQuery: string, patientCondition: string): AISearchResult {
    const queryTerms = searchQuery.toLowerCase().split(/\s+/);
    const conditionText = patientCondition.toLowerCase();
    
    const matchedTerms = queryTerms.filter(term => 
      conditionText.includes(term) && term.length > 2
    );
    
    const relevanceScore = (matchedTerms.length / queryTerms.length) * 100;
    
    return {
      relevanceScore: Math.round(relevanceScore),
      matchedTerms,
      semanticSimilarity: matchedTerms.length > 0
    };
  }
}
