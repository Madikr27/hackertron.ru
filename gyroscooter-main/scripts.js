document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.m-menu');
    const menu = document.querySelector('.menu-item1');
    
    menuButton.addEventListener('click', function() {
        menu.classList.toggle('is-open');
    });
});