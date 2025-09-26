document.addEventListener('DOMContentLoaded', function() {
    // Обработчик изменения даты
    document.getElementById('session-date').addEventListener('change', function() {
        const selectedDate = this.value;

        fetch('get_sessions.php?date=' + selectedDate)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched sessions:", data); // Отладочный вывод
                const sessionList = document.getElementById('session-list');
                sessionList.innerHTML = '';

                if (data.length === 0) {
                    sessionList.innerHTML = '<div class="no-sessions">Нет доступных сеансов на эту дату</div>';
                } else {
                    data.forEach(session => {
                        const sessionItem = document.createElement('div');
                        sessionItem.className = 'session-item';
                        sessionItem.innerHTML = `
                            <div class="col-fio">${session.surname} ${session.name} ${session.patronymic}</div>
                            <div class="col-data">${session.dataEvent}</div>
                            <div class="col-time">${session.timeEvent}</div>
                            <div class="col-status">${session.statusName}</div>
                            <div class="col-select">
                            </div>
                        `;
                        sessionList.appendChild(sessionItem);
                    });

                }
            })
            .catch(error => console.error('Error:', error));
    });


});
