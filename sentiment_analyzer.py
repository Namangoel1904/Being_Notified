from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def analyze_sentiment(text):
    # Initialize the VADER sentiment analyzer
    analyzer = SentimentIntensityAnalyzer()
    
    # Get the sentiment scores
    sentiment_scores = analyzer.polarity_scores(text)
    
    # Determine the sentiment based on the compound score
    compound_score = sentiment_scores['compound']
    if compound_score >= 0.05:
        sentiment = 'Positive'
    elif compound_score <= -0.05:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'
    
    return {
        'sentiment': sentiment,
        'scores': sentiment_scores
    }

# Example usage
if __name__ == "__main__":
    # Test sentences
    test_sentences = [
        "I love this product! It's amazing!",
        "This is the worst experience ever.",
        "The weather is okay today."
    ]
    
    for sentence in test_sentences:
        result = analyze_sentiment(sentence)
        print(f"\nText: {sentence}")
        print(f"Sentiment: {result['sentiment']}")
        print(f"Scores: {result['scores']}") 