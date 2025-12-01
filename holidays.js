// Система автоматических праздничных обновлений

class HolidayManager {
    constructor() {
        this.today = new Date();
        this.currentHoliday = null;
        this.holidays = this.getHolidaySchedule();
    }
    
    getHolidaySchedule() {
        return [
            {
                name: 'newyear',
                start: { month: 12, day: 25 },
                end: { month: 1, day: 10 },
                theme: 'theme-newyear',
                effects: ['snow'],
                message: '🎆 С Новым Годом!'
            },
            {
                name: 'christmas',
                start: { month: 12, day: 20 },
                end: { month: 12, day: 27 },
                theme: 'theme-christmas',
                effects: ['sparkle'],
                message: '🎄 С Рождеством!'
            },
            {
                name: 'halloween',
                start: { month: 10, day: 28 },
                end: { month: 11, day: 2 },
                theme: 'theme-halloween',
                effects: ['bats'],
                message: '🎃 Счастливого Хэллоуина!'
            },
            {
                name: 'valentine',
                start: { month: 2, day: 12 },
                end: { month: 2, day: 16 },
                theme: 'theme-valentine',
                effects: ['hearts'],
                message: '💖 С Днем Святого Валентина!'
            },
            {
                name: 'programmer',
                start: { month: 9, day: 13 }, // 256-й день года
                end: { month: 9, day: 14 },
                theme: 'theme-programmer',
                effects: ['binary'],
                message: '💻 С Днем Программиста!'
            },
            {
                name: 'birthday',
                start: { month: 10, day: 15 }, // Замените на свой день рождения
                end: { month: 10, day: 16 },
                theme: '',
                effects: ['confetti'],
                message: '🎂 С Днем Рождения!'
            }
        ];
    }
    
    isDateInRange(start, end) {
        const currentMonth = this.today.getMonth() + 1;
        const currentDay = this.today.getDate();
        
        // Если праздник переходит через год (Новый Год)
        if (start.month > end.month) {
            return (currentMonth === 12 && currentDay >= start.day) ||
                   (currentMonth === 1 && currentDay <= end.day);
        }
        
        // Обычный случай
        return (currentMonth === start.month && currentDay >= start.day) ||
               (currentMonth === end.month && currentDay <= end.day);
    }
    
    checkCurrentHoliday() {
        for (const holiday of this.holidays) {
            if (this.isDateInRange(holiday.start, holiday.end)) {
                return holiday;
            }
        }
        return null;
    }
    
    applyHolidayTheme() {
        const holiday = this.checkCurrentHoliday();
        
        // Удаляем предыдущие праздничные классы
        document.body.classList.remove(
            'theme-newyear',
            'theme-christmas',
            'theme-halloween',
            'theme-valentine',
            'theme-programmer'
        );
        
        // Останавливаем предыдущие эффекты
        this.stopEffects();
        
        // Если сегодня праздник
        if (holiday) {
            this.currentHoliday = holiday;
            
            // Применяем тему
            if (holiday.theme) {
                document.body.classList.add(holiday.theme);
                
                // Сохраняем в localStorage, но с меткой, что это праздник
                localStorage.setItem('holidayTheme', holiday.theme);
                localStorage.setItem('holidayApplied', new Date().toDateString());
            }
            
            // Запускаем эффекты
            holiday.effects.forEach(effect => {
                this.startEffect(effect);
            });
            
            // Показываем сообщение
            this.showHolidayMessage(holiday.message);
            
            // Добавляем праздничный класс для дополнительных стилей
            document.body.classList.add('holiday-active');
        } else {
            // Если не праздник, очищаем
            const lastHoliday = localStorage.getItem('holidayApplied');
            const todayString = new Date().toDateString();
            
            if (lastHoliday !== todayString) {
                localStorage.removeItem('holidayTheme');
                localStorage.removeItem('holidayApplied');
                document.body.classList.remove('holiday-active');
            }
        }
    }
    
    startEffect(effectName) {
        switch(effectName) {
            case 'snow':
                this.createSnowEffect();
                break;
            case 'sparkle':
                this.createSparkleEffect();
                break;
            case 'bats':
                this.createBatEffect();
                break;
            case 'hearts':
                this.createHeartEffect();
                break;
            case 'binary':
                this.createBinaryEffect();
                break;
            case 'confetti':
                this.createConfettiEffect();
                break;
        }
    }
    
    stopEffects() {
        // Удаляем все эффекты
        const effectContainers = document.querySelectorAll('.effect-container');
        effectContainers.forEach(container => container.remove());
    }
    
    createSnowEffect() {
        const snowContainer = document.getElementById('snowflakes');
        if (!snowContainer) return;
        
        snowContainer.style.display = 'block';
        snowContainer.innerHTML = '';
        
        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.cssText = `
                width: ${Math.random() * 5 + 3}px;
                height: ${Math.random() * 5 + 3}px;
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: fall ${Math.random() * 5 + 5}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            // Добавляем ключевые кадры для анимации падения
            if (!document.querySelector('#snow-animation')) {
                const style = document.createElement('style');
                style.id = 'snow-animation';
                style.textContent = `
                    @keyframes fall {
                        to {
                            transform: translateY(100vh) rotate(360deg);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            snowContainer.appendChild(snowflake);
        }
    }
    
    createSparkleEffect() {
        const style = document.createElement('style');
        style.textContent = `
            .sparkle {
                position: fixed;
                width: 3px;
                height: 3px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: sparkle 1s ease-out forwards;
            }
            
            @keyframes sparkle {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Создаем случайные искры
        setInterval(() => {
            if (Math.random() > 0.7) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1000);
            }
        }, 300);
    }
    
    createHeartEffect() {
        // Аналогично можно реализовать для других эффектов
        console.log('Heart effect activated');
    }
    
    showHolidayMessage(message) {
        // Показываем сообщение только один раз в день
        const lastMessage = localStorage.getItem('lastHolidayMessage');
        const today = new Date().toDateString();
        
        if (lastMessage !== today) {
            const messageEl = document.createElement('div');
            messageEl.className = 'holiday-message';
            messageEl.textContent = message;
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--accent-primary);
                color: var(--bg-primary);
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10000;
                animation: slideDown 0.5s ease;
                font-weight: bold;
            `;
            
            document.body.appendChild(messageEl);
            
            setTimeout(() => {
                messageEl.style.animation = 'slideUp 0.5s ease';
                setTimeout(() => messageEl.remove(), 500);
            }, 5000);
            
            localStorage.setItem('lastHolidayMessage', today);
        }
    }
    
    // Добавляем CSS для анимаций сообщений
    addMessageStyles() {
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const holidayManager = new HolidayManager();
    holidayManager.addMessageStyles();
    holidayManager.applyHolidayTheme();
    
    // Обновляем каждый час на случай, если пользователь оставит страницу открытой
    setInterval(() => {
        holidayManager.applyHolidayTheme();
    }, 60 * 60 * 1000);
});

// Экспортируем для использования в script.js
window.HolidayManager = HolidayManager;