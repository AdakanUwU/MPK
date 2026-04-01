function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('show');
}

function toggleDropdown(event) {
    event.stopPropagation();
    document.getElementById('dropdownMenu').classList.toggle('open');
}

document.addEventListener('click', function() {
    document.getElementById('dropdownMenu')?.classList.remove('open');
});