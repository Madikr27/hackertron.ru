document.addEventListener('DOMContentLoaded', function() {
    // Инициализация меню и обработчиков событий
    initMenu();
    setupEventHandlers();
    initSchedule();

    // Автоматическое переключение на карту пациента при загрузке
    if (window.location.search.includes('patient_id')) {
        showPatientCardPage();
    }

    // Функция инициализации меню
    function initMenu() {
        const defaultPage = document.querySelector('.menu-item[data-page="stats"]');
        if (defaultPage) {
            defaultPage.classList.add('active');
            document.getElementById('stats-page').classList.add('active');
        }
        
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                switchPage(this.getAttribute('data-page'));
            });
        });
    }

    // Переключение между страницами
    function switchPage(pageId) {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        const menuItem = document.querySelector(`.menu-item[data-page="${pageId}"]`);
        if (menuItem) menuItem.classList.add('active');
        
        const page = document.getElementById(`${pageId}-page`);
        if (page) page.classList.add('active');
    }

    // Показать страницу карты пациента
    function showPatientCardPage() {
        switchPage('cardPatient');
    }

    // Настройка обработчиков событий
// Настройка обработчиков событий
function setupEventHandlers() {
    // Обработчики для кнопок карточек пациентов
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('card-btn')) {
            const patientId = e.target.getAttribute('data-id');
            showPatientCard(patientId);
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const patientId = e.target.getAttribute('data-id');
            blockPatient(patientId);
        }
        
        // Добавьте этот обработчик для кнопок оплаты
        if (e.target.classList.contains('cash-payment-btn')) {
            const form = e.target.closest('.cash-payment-form');
            if (form) {
                processPayment(form);
            }
        }
    });


        // Обработчик форм оплаты
        document.querySelectorAll('form[data-payment-form]').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                processPayment(this);
            });
        });

        // Обработчик формы добавления сеанса
        const addSessionForm = document.getElementById('add-session-form');
        if (addSessionForm) {
            addSessionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addNewSession(this);
            });
        }
    }

    // Инициализация расписания
    function initSchedule() {
        const datePicker = document.getElementById('session-date');
        if (datePicker) {
            const hourSelect = document.getElementById('hour');
            const minuteSelect = document.getElementById('minute');
            const selectedDateInput = document.getElementById('selected-date');
            const selectedTimeInput = document.getElementById('selected-time');

            function updateSessionDateTime() {
                if (datePicker.value) {
                    selectedDateInput.value = datePicker.value;
                    selectedTimeInput.value = `${hourSelect.value}:${minuteSelect.value}`;
                }
            }

            datePicker.addEventListener('change', updateSessionDateTime);
            hourSelect.addEventListener('change', updateSessionDateTime);
            minuteSelect.addEventListener('change', updateSessionDateTime);
            datePicker.valueAsDate = new Date();
            updateSessionDateTime();
        }
    }

    // Функция показа карточки пациента
    async function showPatientCard(patientId) {
        try {
            const response = await fetch('get_patient_card.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patient_id: patientId })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            if (!data.success) throw new Error('Не удалось загрузить данные пациента');
            
            // Заполнение данных пациента
            fillPatientData(data.patient);
            fillPatientSessions(data.sessions);
            fillPatientReviews(data.reviews);
            
            showPatientCardPage();

        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при загрузке данных пациента: ' + error.message);
        }
    }

    // Заполнение данных пациента
    function fillPatientData(patient) {
        const setTextContent = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value || '—';
        };

        setTextContent('patient-fullname', `${patient.surname} ${patient.name} ${patient.patronymic}`);
        setTextContent('patient-birthdate', patient.dateOfBirth);
        setTextContent('patient-phone', patient.phoneNumber);
        setTextContent('patient-email', patient.email);
    }

    // Заполнение сеансов пациента
    function fillPatientSessions(sessions) {
        const sessionsBody = document.getElementById('session-history-body');
        if (!sessionsBody) return;

        sessionsBody.innerHTML = sessions.length > 0 
            ? sessions.map(session => `
                <tr>
                    <td>${session.dataEvent || '—'}</td>
                    <td>${session.timeEvent || '—'}</td>
                    <td>${session.statusName || '—'}</td>
                    <td>3500 ₽</td>
                    <td>${session.paid_amount || '0'} ₽</td>
                    <td>
                        ${session.codeStatus === 5 ? `
                            <form method="POST" data-payment-form style="display:inline;">
                                <input type="hidden" name="session_id" value="${session.code}">
                                <input type="hidden" name="amount" value="${3500 - (session.paid_amount || 0)}">
                                <input type="hidden" name="cash_payment" value="1">
                                <button type="submit" class="cash-payment-btn">
                                    ${session.paid_amount ? 'Доплатить' : 'Оплатить'} наличными
                                </button>
                            </form>
                        ` : ''}
                    </td>
                </tr>
            `).join('')
            : '<tr><td colspan="6">Нет данных о сеансах</td></tr>';
    }

    // Заполнение отзывов пациента
    function fillPatientReviews(reviews) {
        const reviewsContainer = document.getElementById('patient-reviews-container');
        if (!reviewsContainer) return;

        reviewsContainer.innerHTML = reviews.length > 0 
            ? reviews.map(review => `
                <div class="review-item">
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    <div class="review-comment">${review.comment || 'Без комментария'}</div>
                </div>
            `).join('')
            : '<p class="no-reviews">Нет отзывов</p>';
    }


// Функция обработки платежа
async function processPayment(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Обработка...';
        
        // Собираем данные формы
        const formData = new FormData(form);
        
        // Отправляем запрос на сервер
        const response = await fetch('process_payment.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Успех, перезагружаем страницу, чтобы обновить данные
            location.reload();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обработке платежа: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}
    // Функция блокировки пациента
async function blockPatient(patientId) {
    if (!confirm('Вы уверены, что хотите удалить этого пациента?')) return;
    
    try {
        const response = await fetch('delete_patient.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Явно указываем, что ожидаем JSON
            },
            body: JSON.stringify({ patient_id: patientId })
        });
        
        // Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Парсим JSON только если ответ успешный
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        if (result.success) {
            alert('Пациент успешно удален');
            location.reload();
        } else {
            throw new Error('Не удалось удалить пациента');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при удалении пациента: ' + error.message);
    }
}

    // Функция добавления нового сеанса
    async function addNewSession(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Добавление...';
            
            const response = await fetch(form.action || '', {
                method: 'POST',
                body: new FormData(form)
            });
            
            const text = await response.text();
            
            if (text.includes('Сеанс добавлен успешно')) {
                location.reload();
            } else {
                const errorMatch = text.match(/alert\('([^']+)/);
                alert(errorMatch ? errorMatch[1] : 'Ошибка при добавлении сеанса');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при добавлении сеанса: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
});