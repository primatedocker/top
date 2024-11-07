document.querySelectorAll('a').forEach(link => {
    link.href = link.href.replace('https:///.', 'https:///.');
});
