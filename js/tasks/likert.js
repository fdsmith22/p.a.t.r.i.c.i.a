/**
 * Likert Task - Traditional Likert scale questions
 * Maintains backward compatibility with existing assessment
 */

import { BaseTask } from './base-task.js';

export class LikertTask extends BaseTask {
    constructor(taskData) {
        super(taskData);
        
        this.type = 'likert';
        this.scale = taskData.scale || 5;
        this.labels = taskData.labels || this.getDefaultLabels();
        this.selectedValue = null;
    }
    
    /**
     * Get default Likert labels based on scale
     */
    getDefaultLabels() {
        if (this.scale === 5) {
            return [
                'Strongly Disagree',
                'Disagree', 
                'Neutral',
                'Agree',
                'Strongly Agree'
            ];
        } else if (this.scale === 7) {
            return [
                'Strongly Disagree',
                'Disagree',
                'Somewhat Disagree',
                'Neutral',
                'Somewhat Agree',
                'Agree',
                'Strongly Agree'
            ];
        }
        return Array.from({length: this.scale}, (_, i) => `${i + 1}`);
    }
    
    /**
     * Render the Likert scale UI
     */
    async render() {
        const container = this.createContainer();
        
        // Create Likert scale
        const likertContainer = document.createElement('div');
        likertContainer.className = 'likert-scale';
        
        for (let i = 0; i < this.scale; i++) {
            const option = document.createElement('button');
            option.className = 'likert-option';
            option.dataset.value = i + 1;
            
            option.innerHTML = `
                <span class="likert-value">${i + 1}</span>
                <span class="likert-label">${this.labels[i]}</span>
            `;
            
            option.addEventListener('click', () => this.selectOption(i + 1, option));
            
            likertContainer.appendChild(option);
            
            // Animate in with delay
            setTimeout(() => {
                this.animateIn(option);
            }, i * 50);
        }
        
        container.appendChild(likertContainer);
        
        return container;
    }
    
    /**
     * Handle option selection
     */
    selectOption(value, element) {
        // Remove previous selection
        document.querySelectorAll('.likert-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection
        element.classList.add('selected');
        this.selectedValue = value;
        
        // Log event
        this.logEvent('option_selected', {
            value: value,
            label: this.labels[value - 1]
        });
        
        // Store response
        this.response = {
            value: value,
            label: this.labels[value - 1]
        };
        
        // Enable next button if integrated with main app
        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.disabled = false;
        }
    }
    
    /**
     * Get task results
     */
    async getResults() {
        const results = await super.getResults();
        
        return {
            ...results,
            scale: this.scale,
            selectedValue: this.selectedValue,
            selectedLabel: this.selectedValue ? this.labels[this.selectedValue - 1] : null
        };
    }
}

export default LikertTask;