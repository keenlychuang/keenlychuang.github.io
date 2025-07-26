class HabitTracker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.today = new Date();
        this.currentYear = this.today.getFullYear();
        this.habitStartDate = new Date(2025, 6, 21); // July 21st, 2025
        this.hoveredDay = null;
        this.tooltip = null;
        
        this.generateHabitData();
        this.render();
        this.setupEventListeners();
    }

    generateHabitData() {
        this.habitData = [];
        const startDate = new Date(this.currentYear, 0, 1);
        let currentDate = new Date(startDate);
        
        while (currentDate <= this.today) {
            const dayOfWeek = currentDate.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            let completionType;
            if (currentDate < this.habitStartDate) {
                completionType = 'miss';
            } else {
                const missRate = isWeekend ? 0.3 : 0.15;
                const random = Math.random();
                
                if (random < missRate) {
                    completionType = 'miss';
                } else {
                    const timeRandom = Math.random();
                    if (timeRandom < 0.33) completionType = 'early';
                    else if (timeRandom < 0.66) completionType = 'midday';
                    else completionType = 'evening';
                }
            }
            
            this.habitData.push({
                date: currentDate.toISOString().split('T')[0],
                completion: completionType,
                month: currentDate.getMonth(),
                dayOfMonth: currentDate.getDate()
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    render() {
        const weeks = this.organizeIntoWeeks();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Track which week each month starts at
        const monthStartWeeks = this.getMonthStartWeeks(weeks);
        
        this.container.innerHTML = `
            <h3 style="font-family: Georgia, serif; margin-bottom: 1rem; color: var(--text-primary);">Baseline Conditioning</h3>
            <div class="habit-grid-container">
                <div class="habit-grid-wrapper">
                    <!-- Month labels -->
                    <div class="habit-months">
                        ${Object.entries(monthStartWeeks).map(([monthIndex, weekIndex]) => `
                            <div class="habit-month-label" style="left: ${weekIndex * 16}px;">
                                ${monthNames[parseInt(monthIndex)]}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="habit-grid">
                        ${weeks.map((week, weekIndex) => `
                            <div class="habit-week" style="margin-top: ${weekIndex % 2 === 1 && weekIndex > 0 ? '-6px' : '0px'}">
                                ${week.map((day, dayIndex) => {
                                    if (day.empty) return '<div class="habit-day habit-empty"></div>';
                                    
                                    const isPreTracking = new Date(day.date) < this.habitStartDate;
                                    const className = isPreTracking ? 'pre-tracking' : day.completion;
                                    
                                    return `<div class="habit-day habit-${className}" data-date="${day.date}" data-completion="${day.completion}"></div>`;
                                }).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="habit-stats">
                    ${this.generateStats()}
                </div>
            </div>
        `;
        
        this.createTooltip();
    }

    getMonthStartWeeks(weeks) {
        const monthStartWeeks = {};
        
        weeks.forEach((week, weekIndex) => {
            week.forEach(day => {
                if (!day.empty && day.dayOfMonth === 1) {
                    monthStartWeeks[day.month] = weekIndex;
                }
            });
        });
        
        return monthStartWeeks;
    }

    organizeIntoWeeks() {
        const weeks = [];
        let currentWeek = [];
        
        if (this.habitData.length > 0) {
            const firstDate = new Date(this.habitData[0].date);
            const firstDayOfWeek = firstDate.getDay();
            
            for (let i = 0; i < firstDayOfWeek; i++) {
                currentWeek.push({ empty: true });
            }
        }
        
        this.habitData.forEach((day, index) => {
            const date = new Date(day.date);
            const dayOfWeek = date.getDay();
            
            if (dayOfWeek === 0 && currentWeek.length > 0) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
            
            currentWeek.push(day);
            
            if (index === this.habitData.length - 1) {
                weeks.push(currentWeek);
            }
        });
        
        return weeks;
    }

    generateStats() {
        const completed = this.habitData.filter(day => day.completion !== 'miss').length;
        const total = this.habitData.length;
        const percentage = Math.round((completed / total) * 100);
        
        return `
            <div style="font-size: 0.875rem; color: var(--gray-500);">
                ${completed} days completed out of ${total} days tracked (${percentage}% completion rate)
            </div>
        `;
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'habit-tooltip';
        document.body.appendChild(this.tooltip);
    }

    setupEventListeners() {
        this.container.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('habit-day') && !e.target.classList.contains('habit-empty')) {
                this.showTooltip(e);
            }
        }, true);

        this.container.addEventListener('mousemove', (e) => {
            if (this.tooltip.style.display === 'block') {
                this.tooltip.style.left = e.pageX + 10 + 'px';
                this.tooltip.style.top = e.pageY - 60 + 'px';
            }
        });

        this.container.addEventListener('mouseleave', () => {
            this.tooltip.style.display = 'none';
        }, true);
    }

    showTooltip(e) {
        const date = e.target.dataset.date;
        const completion = e.target.dataset.completion;
        
        const formattedDate = new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        
        const completionText = new Date(date) < this.habitStartDate ? 
            'Not tracked yet' : 
            completion === 'miss' ? 'Missed' : `Completed ${completion}`;
        
        this.tooltip.innerHTML = `
            <div>${formattedDate}</div>
            <div style="font-size: 0.75rem; color: var(--gray-500);">${completionText}</div>
        `;
        
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = e.pageX + 10 + 'px';
        this.tooltip.style.top = e.pageY - 60 + 'px';
    }
}