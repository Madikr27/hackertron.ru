document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('session-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Загружаем сеансы на сегодня при загрузке страницы
    loadSessions(today);

    // Обработчик изменения даты
    dateInput.addEventListener('change', function() {
        loadSessions(this.value);
    });

    function loadSessions(date) {
        fetch('get_sessions.php?date=' + date)
            .then(response => response.json())
            .then(data => {
                const sessionList = document.getElementById('session-list');
                sessionList.innerHTML = '';
                const confirmBtn = document.querySelector('.BtnConfirm');
                confirmBtn.disabled = true;

                if (data.length === 0) {
                    sessionList.innerHTML = '<div class="no-sessions">Нет свободных сеансов на выбранную дату</div>';
                } else {
                    data.forEach(session => {
                        const sessionItem = document.createElement('div');
                        sessionItem.className = 'session-item';
                        sessionItem.innerHTML = `
                            <div class="col-fio">${session.surname} ${session.name} ${session.patronymic}</div>
                            <div class="col-time">${session.timeEvent}</div>
                            <div class="col-status">${session.statusName}</div>
                            <div class="col-select">
                                <label class="radio-container">
                                    <input type="radio" name="selected-session" value="${session.code}" required>
                                    <span class="radio-custom"></span>
                                </label>
                            </div>
                        `;
                        sessionList.appendChild(sessionItem);
                    });

                    // Настройка обработчиков для радиокнопок
                    setupRadioHandlers();
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function setupRadioHandlers() {
        document.querySelectorAll('input[name="selected-session"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelector('.BtnConfirm').disabled = false;
                // Удаляем выделение со всех строк
                document.querySelectorAll('.session-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // Добавляем выделение к выбранной строке
                this.closest('.session-item').classList.add('selected');
            });
        });
    }
});