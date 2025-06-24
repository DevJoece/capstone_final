

document.addEventListener("DOMContentLoaded", function () {

 

  const addStyleBtn = document.getElementById("addStyleBtn");
  const styleModal = document.getElementById("styleModal");
  const viewModal = document.getElementById("viewModal");
  const closeBtns = document.querySelectorAll(".close, .close-view");
  const removeImageBtn = document.getElementById("removeImageBtn");
  const imagePreview = document.getElementById("imagePreview");
  const imageInput = document.getElementById("image")
  

  const allowedTypes = ["image/jpeg", "image/png"];
  const maxSize = 2 * 1024 * 1024;

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG images are allowed.");
        this.value = "";
        return;
      }
      if (file.size > maxSize) {
        alert("Image size should not exceed 2MB.");
        this.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
        removeImageBtn.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  removeImageBtn.addEventListener("click", function () {
    imageInput.value = "";
    imagePreview.src = "";
    imagePreview.style.display = "none";
    removeImageBtn.style.display = "none";
  });
  // Categories list with IDs and names
  //  const categories = {
  //    "851e8c8b-ecdd-458a-b8af-870fc908f318": "Traditional",
  //    "5778cda8-dca8-4ca9-812a-02888bc4df8e": "Office",
  //    "894ad7bc-5180-4e49-9c2f-bdb876bf1740":"Wedding"
  //  }
    
  
 
  
   //Populate category dropdown
  //  function populateCategoryDropdown() {
  //    const categorySelect = document.getElementById("category");
  //    categorySelect.innerHTML =
  //     '<option value="" disabled selected>Select category</option>';
  //    categories.forEach((category) => {
  //     const option = document.createElement("option");
  //      option.value = category.id;
  //      option.textContent = category.name;
  //      categorySelect.appendChild(option);
  //    });
  //   }
  let categoryMap = {}
  function loadCategories(){
    fetch("https://my-style-mag-backend.onrender.com/api/v1/category",{
      method: "GET",
      credentials: "include"
    })
    .then(res => {
      console.log("Status:", res.status)
      if(!res.ok) throw new Error("Network response was not okay")
      return res.json()
    })
    .then(data => {
      
      // if (!data.status || ! Array.isArray(data.data)){
      //   throw new Error("Could not fetch categories")
      // }
      // const categories = data.data || []
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = `<option value="" disabled selected>Select category</option>`;

      categoryMap = {}
      data.data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        categoryMap[category.id] = category.name
      })
      
      
  
     
    })
    .catch(err => {
      console.error("Failed to load categories:" ,err.message)
      alert("Failed to load category list")
    })
  }
  // Format date
  function formatDate(date) {
    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const day = date.getDate();
    return `${day}${suffix(day)} ${date.toLocaleString("default", {
      month: "long",
    })}, ${date.getFullYear()}`;
  }

  function updateStyleCount() {
    const count = document.querySelectorAll(".styles-table tbody tr").length;
    document.getElementById("styleCount").textContent = `(${count})`;
  }
  // load admin details
  function loadAdminDetails() {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    if (adminInfo) {
      document.getElementById("adminEmail").textContent = adminInfo.email;
      document.getElementById("adminThumbnail").textContent = adminInfo.avatarLetter;
    } else {
       window.location.href = "../index.html"
    }
  }
  // Load styles from API
  function loadOutfit() {
    fetch("https://my-style-mag-backend.onrender.com/api/v1/outfits", {
      method: "GET",
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
        const styles = data.data || data.outfits || []
        console.log("Fetched styles:",styles)
        styles.forEach(style => {
          console.log("Style from backend:", style)
          addStyleToTable(style);
          
        })
        updateStyleCount();
        
      })
    .catch((err) => console.error("Error loading styles:", err));
  }

  // Add style to table
  function addStyleToTable(style) {
    const table = document.querySelector(".styles-table tbody");
    if(!table) {
      console.error("No <tbody> element found in the document")
      return;
    }

    const categoryName = categoryMap[style.categoryId || "Unknown"];
    // const imageUrl = style.imageurls?.[0] || "https://via.placeholder.com/50"


   
    const newRow = table.insertRow();
    newRow.id = style.id
    console.log(newRow.id)

    newRow.innerHTML = `
       <td><input type="checkbox" /></td>
       <td class="title-cell">
       <img src="${style.imageUrls}" alt="${style.title}" class="thumb-img" />
       <span class="blog-title" style="cursor:pointer;">${style.title}</span>
       </td>
       <td class ="description">${style.description}</td>
       <td>${categoryName}</td>
       <td>${formatDate(new Date(style.createdAt))}</td>
       <td><i class="ri-more-fill action-menu" style="cursor:pointer;" data-id="${style.id}"></i></td>
      `;
    let searchInput = document.querySelector('.table-search')
    let rows = document.querySelectorAll('tbody tr')

    searchInput.addEventListener('keyup', (e) => {
      let value = e.target.value.toLowerCase();
      rows.forEach(row => {
          let title = row.querySelector('.title-cell').textContent.toLowerCase();
        if (title.includes(value)){
            row.style.display = 'table-row'
        } else {
            row.style.display = 'none'
        }
      })
    })
    // View modal
      //   
      // function openModal(image, title, description, category) {
      // document.getElementById("viewImage").src = image;
      // document.getElementById("viewTitle").textContent = title;
      // document.getElementById("viewDescription").textContent = description;
      // document.getElementById("viewCategory").textContent = "Category: " + category;
      // document.getElementById("view-modal").style.display = "block";
      // }

      // function closeModal() {
      //   document.getElementById("view-modal").style.display = "none";
      // }

    newRow.querySelector(".title-cell").addEventListener("click", () => {
      document.getElementById("viewImage").src = style.imageUrls;
      document.getElementById("viewTitle").innerText = style.title;
      document.getElementById("viewDescription").innerText = style.description;
      document.getElementById("viewCategory").innerText = `category:${categoryName}`;
      viewModal.classList.add("show");
    })
  }
  // Open modal
  addStyleBtn.onclick = () => {
    // populateCategoryDropdown();
    styleModal.classList.add("show");
  };

  // Close modals
  closeBtns.forEach(
    (btn) =>
      (btn.onclick = () => {
        styleModal.classList.remove("show");
        viewModal.classList.remove("show");
      })
  );

  window.onclick = function (event) {
    if (event.target === styleModal) styleModal.classList.remove("show");
    if (event.target === viewModal) viewModal.classList.remove("show");
  };

  // Create new blog
  document.getElementById("styleForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const categoryId = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image").files;

    if (imageFile.length === 0) {
      alert("Please upload an image.");
      return;

    }
    if (!title) {
      alert("Please fill in the title.");
      return;
    }
    
    console.log("selected category ID",categoryId)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    for(let i=0; i<imageFile.length; i++){
      formData.append("image", imageFile[i])
    }

    // console.log("added style row to table",style.title)

    

    fetch("https://my-style-mag-backend.onrender.com/api/v1/outfits", {
      method: "POST",
      credentials: "include",
      body: formData
    })
      .then(async res => {
          if(!res.ok){
            const err = await res.json();
            throw new Error(err.message || "Server error");
          }
          return res.json();
            
      })
      .then(result => {
          console.log("Response from backend:", result)
          const style = result.data?.[0] || result.data
          if(!style || !style.title) {
            console.warn("Backend response didn't include full style:",result)
            alert("style was saved but could not be shown automatically")
            return;
          }
          addStyleToTable(style);
          updateStyleCount();
          this.reset();
          styleModal.classList.remove("show");
          alert("Style added successfully!");
      })
      .catch((err) => {
        console.error("Error saving style:", err);
        alert("Failed to add style.");
      });
  });
  // function openModal(image,title,description,category){
   
  // }
  // function addStyleToTable(data) {
  //   const tableBody = document.getElementById("tableBody");
  //   const newRow = document.createElement("tr");
  // }
  // Action menu (edit / delete)
  document.addEventListener("click", function (e) {
    if (!e.target.classList.contains("action-menu")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => menu.remove());
    }

    if (e.target.classList.contains("action-menu")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => menu.remove());

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown-menu";
      dropdown.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      `;

      const rect = e.target.getBoundingClientRect();
      dropdown.style.position = "fixed";
      dropdown.style.top = `${rect.bottom + 5}px`;
      dropdown.style.left = `${rect.left - 80}px`;
      document.body.appendChild(dropdown);

      // Delete blog
      // dropdown.querySelector(".delete-btn").addEventListener('click',function () {
      //   const row = this.closest("tr")
      //   const styleId = row?.id
      //   // const styleId = e.currentTarget.dataset.styleId
      //   console.log("Deleting style ID:", styleId)
      // function deleteStyle(styleId){
      //   if(!styleId || styleId.length <20){
      //       console.error("Invalid style ID:",styleId)
      //       alert("invalid ID.Deletion arboted")
      //       return
      //   }

      //   fetch(`https://my-style-mag-backend.onrender.com/api/v1/outfits/${styleId}`, {
      //     method: "DELETE",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     credentials: "include",
      //   })
      //     .then(res => {
      //       if(!res.ok) {
      //         return response.json().then(err => {
      //            throw new Error(err.message || "Failed to delete style")
      //         })
           
      //       } 
      //        return response.json()
      //     })
      //     .then(result => {
      //       console.log("Delete success:", result)
      //       const row = document.getElementById(styleId);
      //       if (row) row.remove()
      //       updateStyleCount()
      //       alert("Style deleted successfully!")
      //     })
          
        
      //     .catch((err) => {
      //       console.error("Delete error:", err);
      //       alert("An error occurred while deleting.");
      //     });
      // }
      // dropdown.querySelector(".delete-btn").addEventListener('click',function () {
      //   const row = this.closest("tr")
      //   const styleId = row?.id
        
      //   console.log("Deleting style ID:", styleId)
      //   deleteStyle(styleId)
      // })
      
      dropdown.querySelector(".delete-btn").onclick = () => {
        const styleId = e.target.getAttribute("data-id");
        fetch(`https://my-style-mag-backend.onrender.com/api/v1/outfits/${styleId}`, {
          method: "DELETE",
          credentials: "include"
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              e.target.closest("tr").remove();
              updateStyleCount();
              dropdown.remove();
            } else alert("Delete failed: " + data.message);
          });
      };

      // Edit (placeholder)
      dropdown.querySelector(".edit-btn").onclick = () => {
        alert("Edit functionality coming soon!");
        dropdown.remove();
      };
    }
  })

  // Initial outfit load
 
  // populateCategoryDropdown();






loadAdminDetails()
loadCategories()
loadOutfit();
  
})



