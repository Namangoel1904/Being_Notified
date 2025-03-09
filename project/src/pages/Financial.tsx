import React, { useState } from 'react';
import { DollarSign, PieChart, TrendingUp, Book, ExternalLink, Award, CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const Financial = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'resources' | 'tracking' | 'articles'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is compound interest?",
      options: [
        "Interest earned only on the initial deposit",
        "Interest earned on both the initial deposit and previously earned interest",
        "A fixed interest rate that never changes",
        "Interest paid only at the end of a loan term"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is typically the safest form of investment?",
      options: [
        "Cryptocurrency",
        "Individual stocks",
        "Government bonds",
        "Penny stocks"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a credit score primarily used for?",
      options: [
        "To determine your salary",
        "To evaluate your creditworthiness for loans and credit cards",
        "To calculate your tax returns",
        "To determine your insurance premiums"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the 50/30/20 budgeting rule?",
      options: [
        "Save 50%, spend 30% on needs, 20% on wants",
        "50% on needs, 30% on wants, 20% on savings",
        "50% on wants, 30% on needs, 20% on savings",
        "50% on savings, 30% on needs, 20% on wants"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these should you do first when starting to manage your finances?",
      options: [
        "Invest in stocks",
        "Create an emergency fund",
        "Apply for multiple credit cards",
        "Take out a personal loan"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let newScore = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
    setSelectedAnswers([]);
  };

  const resourceLinks = {
    tracking: [
      {
        title: "Mint",
        description: "Free personal finance app for budgeting and expense tracking",
        url: "https://mint.intuit.com/"
      },
      {
        title: "YNAB (You Need A Budget)",
        description: "Popular budgeting app with a proven methodology",
        url: "https://www.ynab.com/"
      },
      {
        title: "Personal Capital",
        description: "Investment and wealth management platform",
        url: "https://www.personalcapital.com/"
      }
    ],
    learning: [
      {
        title: "Khan Academy - Personal Finance",
        description: "Free courses on personal finance basics",
        url: "https://www.khanacademy.org/college-careers-more/personal-finance"
      },
      {
        title: "Investopedia",
        description: "Comprehensive financial education resource",
        url: "https://www.investopedia.com/"
      },
      {
        title: "NerdWallet",
        description: "Financial product reviews and advice",
        url: "https://www.nerdwallet.com/"
      }
    ]
  };

  const articles = [
    {
      title: "Building Your Emergency Fund: A Step-by-Step Guide",
      source: "NerdWallet",
      url: "https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters"
    },
    {
      title: "Understanding Credit Scores for Young Adults",
      source: "Investopedia",
      url: "https://www.investopedia.com/articles/personal-finance/081514/understanding-credit-scores.asp"
    },
    {
      title: "Investing Basics for College Students",
      source: "The Balance",
      url: "https://www.thebalancemoney.com/investing-basics-college-students-357511"
    },
    {
      title: "How to Create a Budget in College",
      source: "Forbes",
      url: "https://www.forbes.com/advisor/banking/budgeting/how-to-budget-in-college/"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Financial Planning</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        {[
          { id: 'quiz', label: 'Financial Quiz', icon: Award },
          { id: 'resources', label: 'Resources', icon: Book },
          { id: 'tracking', label: 'Track & Save', icon: PieChart },
          { id: 'articles', label: 'Learn More', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quiz Section */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {!showResults ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Financial Awareness Quiz</h2>
                  <span className="text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800">{quizQuestions[currentQuestion].question}</h3>
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    selectedAnswers[currentQuestion] === undefined
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quiz Results</h2>
              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {score}/{quizQuestions.length}
              </div>
              <p className="text-gray-600 mb-6">
                {score === quizQuestions.length
                  ? "Perfect score! You're a financial wizard! 🎉"
                  : score >= quizQuestions.length / 2
                  ? "Good job! Keep learning about personal finance! 👍"
                  : "Keep studying! Financial literacy is an important skill! 📚"}
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resources Section */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Financial Tools & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourceLinks.tracking.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-600 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-indigo-600">
                      {resource.title}
                    </h3>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                  <p className="text-gray-600">{resource.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Section */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Track Your Finances</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resourceLinks.learning.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-600 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-800 group-hover:text-indigo-600">
                      {resource.title}
                    </h3>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                  <p className="text-gray-600">{resource.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Articles Section */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Financial Education Articles</h2>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-600 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 group-hover:text-indigo-600">
                        {article.title}
                      </h3>
                      <p className="text-gray-600">Source: {article.source}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;