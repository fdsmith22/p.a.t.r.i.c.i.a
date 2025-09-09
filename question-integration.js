// Question Integration for P.A.T.R.I.C.I.A
// Transforms boring questions into engaging interactions

// Transform validated questions into enhanced format
function transformValidatedQuestions() {
    const transformedQuestions = [];
    
    // === EXTRAVERSION QUESTIONS ===
    transformedQuestions.push({
        id: 'ext_scenario_party',
        type: 'scenario',
        category: 'extraversion',
        facet: 'sociability',
        prompt: "You're at a party where you only know the host. What do you do?",
        options: [
            { text: "Find a quiet corner and observe", value: 1, emoji: "🌙" },
            { text: "Chat with the host when they're free", value: 2, emoji: "💬" },
            { text: "Join a small group conversation", value: 3, emoji: "👥" },
            { text: "Introduce yourself to several people", value: 4, emoji: "🤝" },
            { text: "Become the life of the party", value: 5, emoji: "🎉" }
        ],
        instrument: 'BFI-2',
        responseType: 'cards'
    });
    
    transformedQuestions.push({
        id: 'ext_spectrum_energy',
        type: 'spectrum',
        category: 'extraversion',
        facet: 'energy_level',
        leftLabel: "Need alone time to recharge",
        rightLabel: "Get energy from being around others",
        prompt: "After a long day, what restores your energy?",
        instrument: 'BFI-2',
        responseType: 'slider'
    });
    
    transformedQuestions.push({
        id: 'ext_would_rather',
        type: 'wouldYouRather',
        category: 'extraversion',
        facet: 'assertiveness',
        optionA: { text: "Lead a team meeting", emoji: "📊" },
        optionB: { text: "Work independently on a project", emoji: "💻" },
        instrument: 'BFI-2'
    });
    
    // === AGREEABLENESS QUESTIONS ===
    transformedQuestions.push({
        id: 'agr_scenario_credit',
        type: 'scenario',
        category: 'agreeableness',
        facet: 'trust',
        prompt: "A coworker takes credit for your idea in a meeting. You:",
        options: [
            { text: "Publicly correct them immediately", value: 1, emoji: "⚡" },
            { text: "Confront them privately after", value: 2, emoji: "💭" },
            { text: "Mention it to your manager later", value: 3, emoji: "📝" },
            { text: "Let it go but remember for next time", value: 4, emoji: "🤔" },
            { text: "Assume they forgot it was your idea", value: 5, emoji: "💚" }
        ],
        instrument: 'BFI-2',
        responseType: 'cards'
    });
    
    transformedQuestions.push({
        id: 'agr_word_choice',
        type: 'wordChoice',
        category: 'agreeableness',
        facet: 'compassion',
        prompt: "Which words resonate with how you handle conflict?",
        words: ["Compromise", "Assert", "Avoid", "Mediate", "Win", "Understand", "Defend", "Peace", "Justice", "Harmony"],
        maxSelections: 3,
        instrument: 'BFI-2'
    });
    
    // === CONSCIENTIOUSNESS QUESTIONS ===
    transformedQuestions.push({
        id: 'con_metaphor_workspace',
        type: 'metaphor',
        category: 'conscientiousness',
        facet: 'organization',
        prompt: "Which workspace matches your style?",
        options: [
            { emoji: "🗂️", label: "Everything labeled and filed", value: 5 },
            { emoji: "📚", label: "Organized chaos", value: 3 },
            { emoji: "🎨", label: "Creative mess", value: 2 },
            { emoji: "🏢", label: "Minimalist and clean", value: 4 },
            { emoji: "🌪️", label: "Controlled tornado", value: 1 }
        ],
        instrument: 'BFI-2'
    });
    
    transformedQuestions.push({
        id: 'con_rank_project',
        type: 'rankOrder',
        category: 'conscientiousness',
        facet: 'productiveness',
        prompt: "How do you prefer to tackle a big project? (Drag to order from most to least preferred)",
        items: [
            "Create a detailed plan first",
            "Jump in and figure it out as I go",
            "Set major milestones only",
            "Work in bursts of inspiration",
            "Follow a strict schedule"
        ],
        instrument: 'BFI-2'
    });
    
    // === NEGATIVE EMOTIONALITY QUESTIONS ===
    transformedQuestions.push({
        id: 'neu_emoji_worry',
        type: 'emojiScale',
        category: 'neuroticism',
        facet: 'anxiety',
        prompt: "How often do you worry about things beyond your control?",
        context: "General anxiety levels",
        emojis: ['😌', '🙂', '😐', '😟', '😰'],
        instrument: 'BFI-2'
    });
    
    transformedQuestions.push({
        id: 'neu_scenario_mistake',
        type: 'scenario',
        category: 'neuroticism',
        facet: 'emotional_volatility',
        prompt: "You made a minor mistake at work. How long does it bother you?",
        options: [
            { text: "I forget about it within minutes", value: 1, emoji: "✨" },
            { text: "It crosses my mind a few times that day", value: 2, emoji: "💭" },
            { text: "I think about it for a day or two", value: 3, emoji: "🌙" },
            { text: "It bothers me for about a week", value: 4, emoji: "📅" },
            { text: "I replay it in my mind for weeks", value: 5, emoji: "🔄" }
        ],
        instrument: 'BFI-2',
        responseType: 'cards'
    });
    
    // === OPEN-MINDEDNESS QUESTIONS ===
    transformedQuestions.push({
        id: 'ope_scenario_vacation',
        type: 'scenario',
        category: 'openness',
        facet: 'adventurousness',
        prompt: "You're choosing a vacation. Which appeals most?",
        options: [
            { text: "Same beloved beach resort as always", value: 1, emoji: "🏖️" },
            { text: "Similar destination, different hotel", value: 2, emoji: "🏨" },
            { text: "New city in a familiar country", value: 3, emoji: "🌆" },
            { text: "Completely different culture", value: 4, emoji: "🗺️" },
            { text: "Backpacking somewhere off the map", value: 5, emoji: "🎒" }
        ],
        instrument: 'BFI-2',
        responseType: 'cards'
    });
    
    transformedQuestions.push({
        id: 'ope_allocation_time',
        type: 'allocation',
        category: 'openness',
        facet: 'intellectual_curiosity',
        prompt: "How do you prefer to spend your free time?",
        categories: ["Learning new skills", "Perfecting existing hobbies", "Exploring new places", "Relaxing with familiar activities"],
        totalPoints: 100,
        instrument: 'BFI-2'
    });
    
    return transformedQuestions;
}

// Transform experimental questions into enhanced format
function transformExperimentalQuestions() {
    const transformedQuestions = [];
    
    // === DIGITAL BEHAVIOR ===
    transformedQuestions.push({
        id: 'dig_scenario_phone',
        type: 'scenario',
        category: 'digital_behavior',
        prompt: "Your phone dies for 24 hours. Your primary feeling is:",
        options: [
            { text: "Relief - finally some peace!", value: 1, emoji: "😌" },
            { text: "Mild inconvenience", value: 2, emoji: "🤷" },
            { text: "Moderate anxiety about missing things", value: 3, emoji: "😟" },
            { text: "Significant stress and disconnection", value: 4, emoji: "😰" },
            { text: "Panic - I need to fix this immediately!", value: 5, emoji: "🆘" }
        ],
        responseType: 'cards'
    });
    
    transformedQuestions.push({
        id: 'dig_allocation_screen',
        type: 'allocation',
        category: 'digital_behavior',
        prompt: "How do you distribute your screen time?",
        categories: ["Social media", "Learning/Reading", "Entertainment", "Work/Productivity", "Communication"],
        totalPoints: 100
    });
    
    // === ATTACHMENT PATTERNS ===
    transformedQuestions.push({
        id: 'att_metaphor_relationship',
        type: 'metaphor',
        category: 'attachment',
        prompt: "In relationships, you're most like:",
        options: [
            { emoji: "🌊", label: "Ocean - deep and sometimes overwhelming", value: "anxious" },
            { emoji: "🏔️", label: "Mountain - steady and independent", value: "avoidant" },
            { emoji: "🌳", label: "Tree - rooted but flexible", value: "secure" },
            { emoji: "🌪️", label: "Storm - intense and unpredictable", value: "disorganized" }
        ]
    });
    
    // === HUMOR STYLES ===
    transformedQuestions.push({
        id: 'hum_scenario_trip',
        type: 'scenario',
        category: 'humor_style',
        prompt: "Your friend trips (they're okay). You:",
        options: [
            { text: "Help them up immediately with concern", value: "affiliative", emoji: "🤝" },
            { text: "Laugh with them once they laugh", value: "self-enhancing", emoji: "😊" },
            { text: "Make a joke about their clumsiness", value: "aggressive", emoji: "😏" },
            { text: "Share your own embarrassing story", value: "self-defeating", emoji: "🙈" }
        ],
        responseType: 'cards'
    });
    
    transformedQuestions.push({
        id: 'hum_word_choice',
        type: 'wordChoice',
        category: 'humor_style',
        prompt: "What makes you laugh most?",
        words: ["Puns", "Sarcasm", "Slapstick", "Wit", "Irony", "Absurdity", "Roasts", "Wholesome", "Dark", "Clever"],
        maxSelections: 3
    });
    
    // === UBUNTU PHILOSOPHY ===
    transformedQuestions.push({
        id: 'ubu_spectrum_success',
        type: 'spectrum',
        category: 'ubuntu',
        leftLabel: "Individual success",
        rightLabel: "Community thriving",
        prompt: "What matters more to you?"
    });
    
    // === NONATTACHMENT ===
    transformedQuestions.push({
        id: 'non_would_rather',
        type: 'wouldYouRather',
        category: 'nonattachment',
        optionA: { text: "Keep all your memories forever", emoji: "📚" },
        optionB: { text: "Experience each moment fully then let go", emoji: "🍃" }
    });
    
    // === CREATIVITY ===
    transformedQuestions.push({
        id: 'cre_metaphor_process',
        type: 'metaphor',
        category: 'creativity',
        prompt: "Your creative process is most like:",
        options: [
            { emoji: "⚡", label: "Lightning - sudden strikes", value: "spontaneous" },
            { emoji: "🌱", label: "Garden - cultivating over time", value: "incremental" },
            { emoji: "🧩", label: "Puzzle - connecting pieces", value: "combinatorial" },
            { emoji: "🔬", label: "Lab - systematic experimentation", value: "methodical" }
        ]
    });
    
    // === TIME PREFERENCES ===
    transformedQuestions.push({
        id: 'tim_clock_thinking',
        type: 'timeOfDay',
        category: 'chronotype',
        activity: "When do you do your deepest thinking?",
        trait: "cognitive_peak"
    });
    
    // === HINDU GUNAS ===
    transformedQuestions.push({
        id: 'gun_allocation_energy',
        type: 'allocation',
        category: 'gunas',
        prompt: "Your energy typically goes toward:",
        categories: ["Action and achievement", "Pleasure and enjoyment", "Peace and contemplation", "Service to others"],
        totalPoints: 100
    });
    
    return transformedQuestions;
}

// Enhanced question renderer
function renderEnhancedQuestion(question) {
    const container = document.createElement('div');
    container.className = 'enhanced-question-container question-enter';
    
    // Add prompt
    const prompt = document.createElement('div');
    prompt.className = 'enhanced-prompt';
    prompt.textContent = question.prompt || question.text;
    container.appendChild(prompt);
    
    // Render based on question type
    switch(question.type) {
        case 'scenario':
            renderScenarioQuestion(container, question);
            break;
        case 'spectrum':
            renderSpectrumQuestion(container, question);
            break;
        case 'wordChoice':
            renderWordChoiceQuestion(container, question);
            break;
        case 'metaphor':
            renderMetaphorQuestion(container, question);
            break;
        case 'emojiScale':
            renderEmojiScaleQuestion(container, question);
            break;
        case 'wouldYouRather':
            renderWouldYouRatherQuestion(container, question);
            break;
        case 'rankOrder':
            renderRankOrderQuestion(container, question);
            break;
        case 'allocation':
            renderAllocationQuestion(container, question);
            break;
        case 'timeOfDay':
            renderTimeOfDayQuestion(container, question);
            break;
        default:
            // Fallback to traditional likert
            renderTraditionalLikert(container, question);
    }
    
    return container;
}

// Individual question type renderers
function renderScenarioQuestion(container, question) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'scenario-container';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'scenario-option';
        optionDiv.dataset.value = option.value;
        
        const emoji = document.createElement('span');
        emoji.className = 'option-emoji';
        emoji.textContent = option.emoji || '';
        
        const text = document.createElement('span');
        text.className = 'option-text';
        text.textContent = option.text;
        
        optionDiv.appendChild(emoji);
        optionDiv.appendChild(text);
        
        optionDiv.addEventListener('click', function() {
            document.querySelectorAll('.scenario-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            window.currentResponse = option.value;
        });
        
        optionsDiv.appendChild(optionDiv);
    });
    
    container.appendChild(optionsDiv);
}

function renderSpectrumQuestion(container, question) {
    const spectrumDiv = document.createElement('div');
    spectrumDiv.className = 'spectrum-container';
    
    const labels = document.createElement('div');
    labels.className = 'spectrum-labels';
    
    const leftLabel = document.createElement('span');
    leftLabel.className = 'spectrum-left';
    leftLabel.textContent = question.leftLabel;
    
    const rightLabel = document.createElement('span');
    rightLabel.className = 'spectrum-right';
    rightLabel.textContent = question.rightLabel;
    
    labels.appendChild(leftLabel);
    labels.appendChild(rightLabel);
    spectrumDiv.appendChild(labels);
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'spectrum-slider';
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    
    const feedback = document.createElement('div');
    feedback.className = 'spectrum-feedback';
    feedback.textContent = '😐';
    
    slider.addEventListener('input', function() {
        const emojis = ['😰', '😟', '😐', '😊', '🤗'];
        const index = Math.floor((this.value / 100) * 4);
        feedback.textContent = emojis[index];
        window.currentResponse = Math.floor((this.value / 100) * 5) + 1;
    });
    
    spectrumDiv.appendChild(slider);
    spectrumDiv.appendChild(feedback);
    container.appendChild(spectrumDiv);
}

function renderWordChoiceQuestion(container, question) {
    const wordsDiv = document.createElement('div');
    wordsDiv.className = 'word-choice-container';
    
    const selectedWords = new Set();
    
    question.words.forEach(word => {
        const wordBubble = document.createElement('div');
        wordBubble.className = 'word-bubble';
        wordBubble.textContent = word;
        
        wordBubble.addEventListener('click', function() {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedWords.delete(word);
            } else if (selectedWords.size < question.maxSelections) {
                this.classList.add('selected');
                selectedWords.add(word);
            }
            window.currentResponse = Array.from(selectedWords);
        });
        
        wordsDiv.appendChild(wordBubble);
    });
    
    container.appendChild(wordsDiv);
}

function renderMetaphorQuestion(container, question) {
    const metaphorDiv = document.createElement('div');
    metaphorDiv.className = 'metaphor-container';
    
    question.options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'metaphor-option';
        optionDiv.dataset.value = option.value;
        
        const image = document.createElement('div');
        image.className = 'metaphor-image';
        image.textContent = option.emoji;
        
        const label = document.createElement('div');
        label.className = 'metaphor-label';
        label.textContent = option.label;
        
        optionDiv.appendChild(image);
        optionDiv.appendChild(label);
        
        optionDiv.addEventListener('click', function() {
            document.querySelectorAll('.metaphor-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            window.currentResponse = option.value;
        });
        
        metaphorDiv.appendChild(optionDiv);
    });
    
    container.appendChild(metaphorDiv);
}

function renderEmojiScaleQuestion(container, question) {
    const emojiDiv = document.createElement('div');
    emojiDiv.className = 'emoji-scale-container';
    
    question.emojis.forEach((emoji, index) => {
        const emojiOption = document.createElement('span');
        emojiOption.className = 'emoji-scale-option';
        emojiOption.textContent = emoji;
        emojiOption.dataset.value = index + 1;
        
        emojiOption.addEventListener('click', function() {
            document.querySelectorAll('.emoji-scale-option').forEach(e => e.classList.remove('selected'));
            this.classList.add('selected');
            window.currentResponse = index + 1;
        });
        
        emojiDiv.appendChild(emojiOption);
    });
    
    container.appendChild(emojiDiv);
}

function renderWouldYouRatherQuestion(container, question) {
    const ratherDiv = document.createElement('div');
    ratherDiv.className = 'would-rather-container';
    
    const optionA = document.createElement('div');
    optionA.className = 'rather-option';
    optionA.innerHTML = `
        <div class="rather-emoji">${question.optionA.emoji || ''}</div>
        <div class="rather-text">${question.optionA.text}</div>
    `;
    optionA.addEventListener('click', function() {
        document.querySelectorAll('.rather-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        window.currentResponse = 'A';
    });
    
    const orDiv = document.createElement('div');
    orDiv.className = 'rather-or';
    orDiv.textContent = 'OR';
    
    const optionB = document.createElement('div');
    optionB.className = 'rather-option';
    optionB.innerHTML = `
        <div class="rather-emoji">${question.optionB.emoji || ''}</div>
        <div class="rather-text">${question.optionB.text}</div>
    `;
    optionB.addEventListener('click', function() {
        document.querySelectorAll('.rather-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        window.currentResponse = 'B';
    });
    
    ratherDiv.appendChild(optionA);
    ratherDiv.appendChild(orDiv);
    ratherDiv.appendChild(optionB);
    
    container.appendChild(ratherDiv);
}

function renderRankOrderQuestion(container, question) {
    const rankDiv = document.createElement('div');
    rankDiv.className = 'rank-container';
    
    question.items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'rank-item';
        itemDiv.draggable = true;
        itemDiv.textContent = item;
        itemDiv.dataset.index = index;
        
        itemDiv.addEventListener('dragstart', handleDragStart);
        itemDiv.addEventListener('dragover', handleDragOver);
        itemDiv.addEventListener('drop', handleDrop);
        itemDiv.addEventListener('dragend', handleDragEnd);
        
        rankDiv.appendChild(itemDiv);
    });
    
    container.appendChild(rankDiv);
    
    // Update response on drag end
    rankDiv.addEventListener('dragend', () => {
        const items = rankDiv.querySelectorAll('.rank-item');
        window.currentResponse = Array.from(items).map(item => item.textContent);
    });
}

function renderAllocationQuestion(container, question) {
    const allocDiv = document.createElement('div');
    allocDiv.className = 'point-allocator';
    
    const remaining = document.createElement('div');
    remaining.className = 'points-remaining';
    remaining.textContent = `Points remaining: ${question.totalPoints}`;
    allocDiv.appendChild(remaining);
    
    const allocations = {};
    
    question.categories.forEach(cat => {
        const row = document.createElement('div');
        row.className = 'allocation-row';
        
        const label = document.createElement('span');
        label.textContent = cat;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = question.totalPoints;
        slider.value = Math.floor(question.totalPoints / question.categories.length);
        allocations[cat] = slider.value;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        valueDisplay.textContent = slider.value;
        
        slider.addEventListener('input', function() {
            const oldValue = allocations[cat];
            const newValue = parseInt(this.value);
            const diff = newValue - oldValue;
            
            const total = Object.values(allocations).reduce((sum, val) => sum + val, 0) + diff;
            
            if (total <= question.totalPoints) {
                allocations[cat] = newValue;
                valueDisplay.textContent = newValue;
                remaining.textContent = `Points remaining: ${question.totalPoints - total}`;
                window.currentResponse = allocations;
            } else {
                this.value = oldValue;
            }
        });
        
        row.appendChild(label);
        row.appendChild(slider);
        row.appendChild(valueDisplay);
        allocDiv.appendChild(row);
    });
    
    container.appendChild(allocDiv);
}

function renderTimeOfDayQuestion(container, question) {
    const clockDiv = document.createElement('div');
    clockDiv.className = 'clock-container';
    
    const clock = document.createElement('div');
    clock.className = 'clock-picker';
    
    for (let hour = 0; hour < 24; hour++) {
        const segment = document.createElement('div');
        segment.className = 'hour-segment';
        segment.dataset.hour = hour;
        segment.style.transform = `rotate(${hour * 15}deg)`;
        
        const label = document.createElement('span');
        label.textContent = hour;
        segment.appendChild(label);
        
        segment.addEventListener('click', function() {
            document.querySelectorAll('.hour-segment').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            window.currentResponse = hour;
        });
        
        clock.appendChild(segment);
    }
    
    clockDiv.appendChild(clock);
    container.appendChild(clockDiv);
}

// Export functions
window.questionIntegration = {
    transformValidated: transformValidatedQuestions,
    transformExperimental: transformExperimentalQuestions,
    renderEnhanced: renderEnhancedQuestion
};