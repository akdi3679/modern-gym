class ScheduleManager {
            constructor() {
                this.dayHeaders = document.querySelectorAll('.day-header');
                this.dayColumns = document.querySelectorAll('.day-column');
                this.activeDays = new Set(['monday']); // Start with Monday active
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.handleResize();
                window.addEventListener('resize', () => this.handleResize());
            }

            setupEventListeners() {
                this.dayHeaders.forEach(header => {
                    header.addEventListener('click', (e) => {
                        const day = e.target.dataset.day;
                        this.toggleDay(day);
                    });
                });
            }

            handleResize() {
                const width = window.innerWidth;
                let maxActiveDays;

                // Calculate how many days can fit based on screen width
                if (width <= 480) {
                    maxActiveDays = 1;
                } else if (width <= 768) {
                    maxActiveDays = 2;
                } else if (width <= 1024) {
                    maxActiveDays = 3;
                } else if (width <= 1280) {
                    maxActiveDays = 4;
                } else if (width <= 1536) {
                    maxActiveDays = 5;
                } else if (width <= 1920) {
                    maxActiveDays = 6;
                } else {
                    maxActiveDays = 7; // Show all days on very large screens
                }

                // Automatically show more days when screen gets bigger
                this.autoShowDays(maxActiveDays);
                this.updateDisplay();
            }

            autoShowDays(maxActiveDays) {
                const currentActiveCount = this.activeDays.size;
                
                // If we can show more days than currently active, add more days
                if (currentActiveCount < maxActiveDays) {
                    const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                    const currentActiveDays = Array.from(this.activeDays);
                    
                    // Find the next days to activate
                    for (let day of allDays) {
                        if (!this.activeDays.has(day) && this.activeDays.size < maxActiveDays) {
                            this.activeDays.add(day);
                        }
                    }
                }
                // If we have too many active days, remove some
                else if (currentActiveCount > maxActiveDays) {
                    const activeDaysArray = Array.from(this.activeDays);
                    this.activeDays = new Set(activeDaysArray.slice(0, maxActiveDays));
                }
            }

            toggleDay(clickedDay) {
                const width = window.innerWidth;
                let maxActiveDays;

                if (width <= 480) {
                    maxActiveDays = 1;
                } else if (width <= 768) {
                    maxActiveDays = 2;
                } else if (width <= 1024) {
                    maxActiveDays = 3;
                } else if (width <= 1280) {
                    maxActiveDays = 4;
                } else if (width <= 1536) {
                    maxActiveDays = 5;
                } else if (width <= 1920) {
                    maxActiveDays = 6;
                } else {
                    maxActiveDays = 7;
                }

                // If we can show all days, just toggle the clicked day
                if (maxActiveDays >= 7) {
                    if (this.activeDays.has(clickedDay)) {
                        if (this.activeDays.size > 1) {
                            this.activeDays.delete(clickedDay);
                        }
                    } else {
                        this.activeDays.add(clickedDay);
                    }
                } else {
                    // Original logic for smaller screens
                    if (this.activeDays.has(clickedDay)) {
                        if (this.activeDays.size > 1) {
                            this.activeDays.delete(clickedDay);
                        }
                    } else {
                        if (this.activeDays.size >= maxActiveDays) {
                            const firstActive = Array.from(this.activeDays)[0];
                            this.activeDays.delete(firstActive);
                        }
                        this.activeDays.add(clickedDay);
                    }
                }

                this.updateDisplay();
            }

            updateDisplay() {
                const width = window.innerWidth;
                
                this.dayHeaders.forEach(header => {
                    const day = header.dataset.day;
                    const isActive = this.activeDays.has(day);
                    
                    header.classList.toggle('active', isActive);
                    header.classList.toggle('hidden', !isActive);
                    
                    // Update text based on screen size and active state
                    if (isActive) {
                        header.textContent = this.getFullDayName(day);
                    } else {
                        header.textContent = width <= 768 ? this.getShortDayName(day) : this.getFullDayName(day);
                    }
                });

                this.dayColumns.forEach(column => {
                    const day = column.dataset.day;
                    const isActive = this.activeDays.has(day);
                    
                    column.classList.toggle('hidden', !isActive);
                    
                    // Animate events
                    const events = column.querySelectorAll('.event');
                    events.forEach(event => {
                        if (isActive) {
                            event.style.animation = 'none';
                            event.offsetHeight; // Trigger reflow
                            event.style.animation = 'fadeIn 0.3s ease forwards';
                        }
                    });
                });
            }

            getFullDayName(day) {
                const dayNames = {
                    'monday': 'Monday',
                    'tuesday': 'Tuesday',
                    'wednesday': 'Wednesday',
                    'thursday': 'Thursday',
                    'friday': 'Friday',
                    'saturday': 'Saturday',
                    'sunday': 'Sunday'
                };
                return dayNames[day];
            }

            getShortDayName(day) {
                const shortNames = {
                    'monday': 'Mon',
                    'tuesday': 'Tue',
                    'wednesday': 'Wed',
                    'thursday': 'Thu',
                    'friday': 'Fri',
                    'saturday': 'Sat',
                    'sunday': 'Sun'
                };
                return shortNames[day];
            }
        }

        // Initialize the schedule manager when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new ScheduleManager();
        });