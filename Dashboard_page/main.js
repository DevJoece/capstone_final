document.querySelector('.search-bar').addEventListener('input', function(){
    const searchValue = this.value.toLowerCase()
    const allTableRows = document.querySelectorAll('tbody tr')

    allTableRows.forEach(row => {
        const titleCell = row.querySelector('td')
        const titleText = titleCell?.textContent?.toLowerCase() || ''

        if(titleText.includes(searchValue)){
            row.style.display = ''
        }else{
            row.style.display = 'none'
        }
    })
})




