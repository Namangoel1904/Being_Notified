# Mood Analyzer

A Streamlit-based web application that analyzes your mood based on responses to a questionnaire using VADER sentiment analysis.

## Features

- Interactive questionnaire with predefined options
- Real-time sentiment analysis
- Visual representation of mood scores
- Personalized recommendations based on mood state
- Easy-to-use web interface

## Setup Instructions

1. Clone this repository or download the files
2. Make sure you have Python installed (Python 3.7 or higher recommended)
3. Install the required packages using pip:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

1. Open a terminal/command prompt
2. Navigate to the project directory
3. Run the following command:
   ```
   streamlit run streamlit_mood_analyzer.py
   ```
4. Your default web browser should automatically open to `http://localhost:8501`

## How to Use

1. Answer each question by selecting the option that best describes your current state
2. Click the "Analyze Mood" button to see your results
3. Review your mood analysis, including:
   - Overall mood state
   - Detailed sentiment scores
   - Personalized recommendations

## Technical Details

- Built with Streamlit for the web interface
- Uses VADER (Valence Aware Dictionary and sEntiment Reasoner) for sentiment analysis
- Provides both numerical scores and qualitative feedback 