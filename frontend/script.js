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

    // Create the payload to send to the Lambda via API Gateway
    const payload = {
        feedback: text,
        category: cat,
        priority: prio,
    };

    try {
        // Send POST request to API Gateway
        const response = await fetch('https://<api-id>.execute-api.<region>.amazonaws.com/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        // Display results
        displayResults(result);

        // Save to history
        saveToHistory(result);

        // Hide loading state
        setLoadingState(false);

        // Show results section
        resultsSection.classList.add('show');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error during request:', error);
        setLoadingState(false);
        alert('There was an error submitting the feedback. Please try again later.');
    }
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
