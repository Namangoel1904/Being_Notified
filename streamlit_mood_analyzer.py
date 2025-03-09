import streamlit as st
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def get_mood_state(compound_score):
    if compound_score >= 0.35:
        return "Very Positive"
    elif compound_score >= 0.05:
        return "Positive"
    elif compound_score <= -0.35:
        return "Very Negative"
    elif compound_score <= -0.05:
        return "Negative"
    else:
        return "Neutral"

def get_recommendation(compound_score):
    if compound_score >= 0.35:
        return "Recommendation: Great job! Keep maintaining these positive emotions and share your joy with others."
    elif compound_score >= 0.05:
        return "Recommendation: You're doing well! Consider engaging in activities that bring you joy to maintain this positive state."
    elif compound_score <= -0.35:
        return "Recommendation: Consider talking to a friend, family member, or professional. It's okay to seek support when needed."
    elif compound_score <= -0.05:
        return "Recommendation: Try some mood-lifting activities like exercise, meditation, or spending time in nature."
    else:
        return "Recommendation: Consider engaging in activities that you enjoy to boost your mood."

# Set up the Streamlit page
st.set_page_config(
    page_title="Mood Analyzer",
    page_icon="😊",
    layout="centered"
)

# Title and description
st.title("🌟 Mood Assessment Questionnaire")
st.markdown("""
This tool analyzes your responses to understand your current emotional state and provides personalized recommendations.
Please select the options that best describe how you're feeling.
""")

# Questions and their corresponding options
questions_and_options = {
    "How would you describe your day so far?": [
        "Fantastic! Everything is going great",
        "Pretty good, no major complaints",
        "Just an ordinary day",
        "Not great, facing some challenges",
        "Really struggling today"
    ],
    "What's your current state of mind?": [
        "Very peaceful and content",
        "Generally positive",
        "Neutral/Mixed feelings",
        "Somewhat worried or anxious",
        "Overwhelmed or stressed"
    ],
    "How are you feeling about your work/studies?": [
        "Very motivated and productive",
        "Making steady progress",
        "Getting by, but could be better",
        "Finding it difficult to focus",
        "Feeling stuck or overwhelmed"
    ],
    "How would you rate your energy levels today?": [
        "Full of energy and vitality",
        "Fairly energetic",
        "Moderate energy levels",
        "Somewhat tired",
        "Completely exhausted"
    ],
    "How are your social connections feeling?": [
        "Very connected and supported",
        "Generally good relationships",
        "Normal/Average interactions",
        "Feeling somewhat isolated",
        "Very disconnected"
    ]
}

# Create select boxes for responses
responses = []
for question, options in questions_and_options.items():
    st.subheader(question)
    response = st.selectbox(
        label="Select your response",
        options=options,
        key=question
    )
    responses.append(response)

# Add an analyze button
if st.button("Analyze Mood", type="primary"):
    # Initialize the analyzer
    analyzer = SentimentIntensityAnalyzer()
    
    # Analyze each response and calculate total
    total_compound = 0
    all_responses = ""
    
    for response in responses:
        all_responses += response + " "
        scores = analyzer.polarity_scores(response)
        total_compound += scores['compound']
    
    # Calculate average compound score
    avg_compound = total_compound / len(questions_and_options)
    
    # Get overall sentiment
    overall_scores = analyzer.polarity_scores(all_responses)
    mood_state = get_mood_state(avg_compound)
    
    # Display results in a nice format
    st.markdown("---")
    st.markdown("## 📊 Mood Analysis Results")
    
    # Display mood state with appropriate emoji
    mood_emojis = {
        "Very Positive": "🌟",
        "Positive": "😊",
        "Neutral": "😐",
        "Negative": "😔",
        "Very Negative": "😢"
    }
    
    st.markdown(f"### Overall Mood State: {mood_emojis.get(mood_state, '')} {mood_state}")
    
    # Create three columns for the scores
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Positive", f"{overall_scores['pos']:.1%}")
    with col2:
        st.metric("Neutral", f"{overall_scores['neu']:.1%}")
    with col3:
        st.metric("Negative", f"{overall_scores['neg']:.1%}")
    
    # Display average sentiment score with a progress bar
    st.markdown("### Average Sentiment Score")
    # Convert score from [-1,1] to [0,1] for progress bar
    progress_value = (avg_compound + 1) / 2
    st.progress(progress_value)
    st.write(f"Score: {avg_compound:.2f} (-1 to +1 scale)")
    
    # Display recommendation
    st.markdown("### 💡 Recommendation")
    st.info(get_recommendation(avg_compound)) 