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




function checkScreenSize() {
  const overlay = document.getElementById("mobileOverlay");
  const mainContent = document.querySelector(".main-content");

  if (window.innerWidth < 1024) {
    overlay.style.display = "block";
    mainContent.classList.add("hide-content");
  } else {
    overlay.style.display = "none";
    mainContent.classList.remove("hide-content");
  }
}

// Run on initial load
document.addEventListener("DOMContentLoaded", checkScreenSize);

// Run on window resize
window.addEventListener("resize", checkScreenSize);