import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
  dangerouslyAllowBrowser: true // Note: Be careful with this in production if used on client-side
});
