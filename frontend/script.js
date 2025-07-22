// DOM Elements
const feedbackForm = document.getElementById('feedbackForm');
const feedbackText = document.getElementById('feedbackText');
const category = document.getElementById('category');
const priority = document.getElementById('priority');
const submitBtn = document.getElementById('submitBtn');
const resultsSection = document.getElementById('resultsSection');
const analysisCard = document.getElementById('analysisCard');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const exportBtn = document.getElementById('exportBtn');

// Result elements
const sentimentScore = document.getElementById('sentimentScore');
const scoreCircle = document.getElementById('scoreCircle');
const scoreValue = document.getElementById('scoreValue');
const sentimentLabel = document.getElementById('sentimentLabel');
const insightsList = document.getElementById('insightsList');
const recommendationsList = document.getElementById('recommendationsList');
const confidence = document.getElementById('confidence');
const processingTime = document.getElementById('processingTime');
const wordCount = document.getElementById('wordCount');
const detectedLanguage = document.getElementById('detectedLanguage');

// Data storage
let feedbackHistory = JSON.parse(localStorage.getItem('feedbackHistory')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    feedbackForm.addEventListener('submit', handleFormSubmit);
    clearHistoryBtn.addEventListener('click', clearHistory);
    exportBtn.addEventListener('click', exportResults);
    
    // Real-time word count
    feedbackText.addEventListener('input', updateWordCount);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const text = feedbackText.value.trim();
    const cat = category.value;
    const prio = priority.value;
    
    if (!text || !cat || !prio) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate AI processing delay
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    const endTime = Date.now();
    
    // Process feedback
    const result = await processFeedback(text, cat, prio, endTime - startTime);
    
    // Display results
    displayResults(result);
    
    // Save to history
    saveToHistory(result);
    
    // Hide loading state
    setLoadingState(false);
    
    // Show results section
    resultsSection.classList.add('show');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Simulate AI feedback processing
async function processFeedback(text, category, priority, processingTime) {
    const words = text.split(/\s+/).length;
    
    // Simulate sentiment analysis
    const sentiment = analyzeSentiment(text);
    
    // Generate insights
    const insights = generateInsights(text, category, sentiment);
    
    // Generate recommendations
    const recommendations = generateRecommendations(sentiment, category, priority);
    
    return {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        originalText: text,
        category: category,
        priority: priority,
        sentiment: sentiment,
        insights: insights,
        recommendations: recommendations,
        metadata: {
            confidence: Math.round(85 + Math.random() * 10),
            processingTime: processingTime,
            wordCount: words,
            detectedLanguage: 'English'
        }
    };
}

// Analyze sentiment (simplified simulation)
function analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful', 'fantastic', 'awesome', 'satisfied', 'happy', 'pleased'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointed', 'frustrated', 'angry', 'poor', 'useless', 'broken'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
        if (lowerText.includes(word)) negativeCount++;
    });
    
    let score = 50; // neutral baseline
    score += (positiveCount * 15) - (negativeCount * 15);
    score = Math.max(0, Math.min(100, score)); // clamp between 0-100
    
    let label = 'neutral';
    if (score >= 70) label = 'positive';
    else if (score <= 30) label = 'negative';
    
    return { score, label };
}

// Generate insights based on text analysis
function generateInsights(text, category, sentiment) {
    const insights = [];
    const textLength = text.length;
    const wordCount = text.split(/\s+/).length;
    
    // Length-based insights
    if (textLength > 500) {
        insights.push('Detailed feedback provided with comprehensive information');
    } else if (textLength < 100) {
        insights.push('Brief feedback - consider requesting more specific details');
    }
    
    // Sentiment-based insights
    if (sentiment.label === 'positive') {
        insights.push('Customer expresses satisfaction and positive experience');
        insights.push('Opportunity to leverage positive feedback for testimonials');
    } else if (sentiment.label === 'negative') {
        insights.push('Customer concerns identified - immediate attention recommended');
        insights.push('Potential for service recovery and relationship improvement');
    } else {
        insights.push('Neutral feedback indicates room for improvement');
    }
    
    // Category-specific insights
    switch (category) {
        case 'product':
            insights.push('Product-related feedback affects core offering quality');
            break;
        case 'service':
            insights.push('Service feedback impacts customer experience directly');
            break;
        case 'support':
            insights.push('Support feedback indicates team performance levels');
            break;
        case 'general':
            insights.push('General feedback provides overall business insights');
            break;
    }
    
    // Word count insights
    if (wordCount > 100) {
        insights.push('Extensive feedback suggests high customer engagement');
    }
    
    return insights;
}

// Generate AI recommendations
function generateRecommendations(sentiment, category, priority) {
    const recommendations = [];
    
    // Priority-based recommendations
    if (priority === 'urgent') {
        recommendations.push({
            type: 'immediate',
            text: 'Immediate response required - escalate to senior management within 2 hours'
        });
    } else if (priority === 'high') {
        recommendations.push({
            type: 'priority',
            text: 'High priority issue - respond within 24 hours with action plan'
        });
    }
    
    // Sentiment-based recommendations
    if (sentiment.label === 'negative') {
        recommendations.push({
            type: 'recovery',
            text: 'Implement service recovery protocol - personal follow-up recommended'
        });
        recommendations.push({
            type: 'analysis',
            text: 'Analyze root cause to prevent similar issues in the future'
        });
    } else if (sentiment.label === 'positive') {
        recommendations.push({
            type: 'leverage',
            text: 'Request customer testimonial or review for marketing purposes'
        });
        recommendations.push({
            type: 'maintain',
            text: 'Maintain current service standards that generated positive feedback'
        });
    }
    
    // Category-specific recommendations
    switch (category) {
        case 'product':
            recommendations.push({
                type: 'product',
                text: 'Share feedback with product development team for future improvements'
            });
            break;
        case 'service':
            recommendations.push({
                type: 'training',
                text: 'Consider staff training if service issues are identified'
            });
            break;
        case 'support':
            recommendations.push({
                type: 'process',
                text: 'Review support processes and knowledge base effectiveness'
            });
            break;
    }
    
    // General recommendations
    recommendations.push({
        type: 'follow-up',
        text: 'Schedule follow-up communication to ensure customer satisfaction'
    });
    
    return recommendations;
}

// Display analysis results
function displayResults(result) {
    // Update sentiment display
    scoreValue.textContent = result.sentiment.score;
    sentimentLabel.textContent = result.sentiment.label;
    
    // Update score circle styling
    scoreCircle.className = `score-circle ${result.sentiment.label}`;
    
    // Update insights
    insightsList.innerHTML = '';
    result.insights.forEach(insight => {
        const li = document.createElement('li');
        li.textContent = insight;
        insightsList.appendChild(li);
    });
    
    // Update recommendations
    recommendationsList.innerHTML = '';
    result.recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recommendation-item';
        div.innerHTML = `
            <strong>${rec.type.toUpperCase()}:</strong> ${rec.text}
        `;
        recommendationsList.appendChild(div);
    });
    
    // Update metadata
    confidence.textContent = `${result.metadata.confidence}%`;
    processingTime.textContent = `${result.metadata.processingTime}ms`;
    wordCount.textContent = result.metadata.wordCount;
    detectedLanguage.textContent = result.metadata.detectedLanguage;
}

// Save result to history
function saveToHistory(result) {
    feedbackHistory.unshift(result);
    
    // Keep only last 10 items
    if (feedbackHistory.length > 10) {
        feedbackHistory = feedbackHistory.slice(0, 10);
    }
    
    localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory));
    loadHistory();
}

// Load and display history
function loadHistory() {
    if (feedbackHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No feedback processed yet</p>';
        return;
    }
    
    historyList.innerHTML = '';
    feedbackHistory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const date = new Date(item.timestamp).toLocaleString();
        const truncatedText = item.originalText.length > 100 
            ? item.originalText.substring(0, 100) + '...'
            : item.originalText;
        
        div.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-date">${date}</span>
                <span class="history-item-sentiment ${item.sentiment.label}">
                    ${item.sentiment.label} (${item.sentiment.score})
                </span>
            </div>
            <div class="history-item-text">${truncatedText}</div>
        `;
        
        historyList.appendChild(div);
    });
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all feedback history?')) {
        feedbackHistory = [];
        localStorage.removeItem('feedbackHistory');
        loadHistory();
    }
}

// Export results
function exportResults() {
    if (feedbackHistory.length === 0) {
        alert('No data to export');
        return;
    }
    
    const exportData = {
        exportDate: new Date().toISOString(),
        totalFeedback: feedbackHistory.length,
        data: feedbackHistory
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `feedback-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Set loading state
function setLoadingState(loading) {
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Update word count in real-time
function updateWordCount() {
    const text = feedbackText.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    
    // You could add a word counter display here if needed
    // For now, it's just used internally
}