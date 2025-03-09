import tkinter as tk
from tkinter import ttk, messagebox
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class MoodAnalyzerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Mood Analyzer")
        self.root.geometry("600x700")
        self.root.configure(bg='#f0f0f0')
        
        # Initialize VADER sentiment analyzer
        self.analyzer = SentimentIntensityAnalyzer()
        
        # Questions about mood
        self.questions = [
            "How would you describe your day so far?",
            "What's on your mind right now?",
            "How are you feeling about your work/studies?",
            "Describe your energy levels and physical well-being:",
            "How are your relationships with friends and family going?"
        ]
        
        self.create_widgets()
        
    def create_widgets(self):
        # Title
        title = tk.Label(
            self.root,
            text="Mood Assessment Questionnaire",
            font=("Helvetica", 16, "bold"),
            bg='#f0f0f0',
            pady=20
        )
        title.pack()
        
        # Create frame for questions
        self.frame = ttk.Frame(self.root)
        self.frame.pack(padx=20, pady=10, fill='both', expand=True)
        
        # Store text widgets
        self.answers = []
        
        # Create questions and text boxes
        for i, question in enumerate(self.questions):
            # Question label
            q_label = ttk.Label(
                self.frame,
                text=f"{i+1}. {question}",
                wraplength=550,
                font=("Helvetica", 10, "bold")
            )
            q_label.pack(pady=(10,5), anchor='w')
            
            # Text box for answer
            text_box = tk.Text(
                self.frame,
                height=2,
                width=50,
                font=("Helvetica", 10),
                wrap=tk.WORD
            )
            text_box.pack(pady=(0,10))
            self.answers.append(text_box)
        
        # Analyze button
        analyze_btn = ttk.Button(
            self.root,
            text="Analyze Mood",
            command=self.analyze_mood,
            style='Accent.TButton'
        )
        analyze_btn.pack(pady=20)
        
        # Result label
        self.result_label = ttk.Label(
            self.root,
            text="",
            wraplength=550,
            font=("Helvetica", 11)
        )
        self.result_label.pack(pady=10)
        
    def analyze_mood(self):
        total_compound = 0
        all_responses = ""
        
        # Collect all responses
        for text_box in self.answers:
            response = text_box.get("1.0", "end-1c").strip()
            if response:
                all_responses += response + " "
                scores = self.analyzer.polarity_scores(response)
                total_compound += scores['compound']
        
        if not all_responses:
            messagebox.showwarning("Warning", "Please answer at least one question!")
            return
        
        # Calculate average compound score
        avg_compound = total_compound / len(self.questions)
        
        # Get overall sentiment of all responses combined
        overall_scores = self.analyzer.polarity_scores(all_responses)
        
        # Determine mood state
        mood_state = self.get_mood_state(avg_compound)
        
        # Create detailed result message
        result_message = f"""
Mood Analysis Results:

Overall Mood State: {mood_state}

Sentiment Scores:
- Positive: {overall_scores['pos']:.2%}
- Neutral: {overall_scores['neu']:.2%}
- Negative: {overall_scores['neg']:.2%}

Average Sentiment Score: {avg_compound:.2f} (-1 to +1 scale)

{self.get_recommendation(avg_compound)}
"""
        self.result_label.configure(text=result_message)
        
    def get_mood_state(self, compound_score):
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
            
    def get_recommendation(self, compound_score):
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

if __name__ == "__main__":
    root = tk.Tk()
    app = MoodAnalyzerApp(root)
    root.mainloop() 