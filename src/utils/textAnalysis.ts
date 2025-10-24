export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  averageWordsPerSentence: number;
}

export function analyzeText(text: string): TextStats {
  if (!text) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: 0,
      paragraphs: 0,
      sentences: 0,
      averageWordsPerSentence: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const wordArray = text.trim().split(/\s+/).filter(word => word.length > 0);
  const words = wordArray.length;
  const lines = text.split('\n').length;
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter(para => para.trim().length > 0).length;
  const sentenceArray = text
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0);
  const sentences = sentenceArray.length;
  const averageWordsPerSentence = sentences > 0 
    ? Math.round((words / sentences) * 10) / 10 
    : 0;

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    sentences,
    averageWordsPerSentence,
  };
}
