document.addEventListener("DOMContentLoaded", function () {
  const addBlogBtn = document.getElementById("addBlogBtn");
  const blogModal = document.getElementById("blogModal");
  const viewModal = document.getElementById("viewModal");
  const closeBtns = document.querySelectorAll(".close, .close-view");
  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  const removeImageBtn = document.getElementById("removeImageBtn");
  const submitBtn = document.getElementById("submitBlogBtn");

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

  function populateCategoryDropdown(selectedCategoryId = "") {
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Select category";
    categorySelect.appendChild(defaultOption);

    fetch("https://my-style-mag-backend.onrender.com/api/v1/category", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          data.data.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
          });
          if (selectedCategoryId) {
            const foundOption = [...categorySelect.options].find(
              (opt) => opt.value === selectedCategoryId
            );
            if (foundOption) categorySelect.value = selectedCategoryId;
          }
        } else {
          alert("Failed to load categories: " + data.message);
        }
      });
  }

  function formatDate(date) {
    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    const day = date.getDate();
    return `${day}${suffix(day)} ${date.toLocaleString("default", { month: "long" })}, ${date.getFullYear()}`;
  }

  function updateBlogCount() {
    const count = document.querySelectorAll(".blogs-table tbody tr").length;
    document.getElementById("blogCount").textContent = `(${count})`;
  }

  function loadAdminBlogs() {
    fetch("https://my-style-mag-backend.onrender.com/api/v1/blog/admin", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const tableBody = document.querySelector(".blogs-table tbody");
          tableBody.innerHTML = "";
          data.data.forEach((blog) => addBlogToTable(blog));
          updateBlogCount();
        } else {
          alert("Failed to load blogs: " + data.message);
        }
      });
  }

  function addBlogToTable(blog) {
    const table = document.querySelector(".blogs-table tbody");
    const newRow = table.insertRow();
    newRow.innerHTML = `
      <td><input type="checkbox" /></td>
      <td class="title-cell">
        ${blog.imageUrl ? `<img src="${blog.imageUrl}" alt="Blog Image" style="width:40px;height:40px;object-fit:cover;margin-right:8px;border-radius:50%;">` : ""}
        <span class="blog-title">${blog.title}</span>
      </td>
      <td>${blog.category?.name || 'Uncategorized'}</td>
      <td>${blog.status}</td>
      <td>${formatDate(new Date(blog.updatedAt))}</td>
      <td>${formatDate(new Date(blog.createdAt))}</td>
      <td>${blog.views || 0}</td>
      <td>
        <i class="ri-more-fill action-menu" style="cursor:pointer;" data-id="${blog.id}"></i>
      </td>
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
   // ✅ Add click listener to the entire row (excluding the action-menu cell)
    newRow.addEventListener("click", (e) => {
      // prevent conflict when clicking the action menu button
      if (e.target.closest(".action-menu") || e.target.tagName === "INPUT") return;

      document.getElementById("viewTitle").innerText = blog.title;
      document.getElementById("viewCategory").innerText = `Category: ${blog.category?.name || 'Uncategorized'}`;
      document.getElementById("viewContent").innerText = blog.content;
      document.getElementById("viewStatus").innerText = `Status: ${blog.status}`;
      document.getElementById("viewModified").innerText = `Modified: ${formatDate(new Date(blog.updatedAt))}`;
      document.getElementById("viewViews").innerText = `Views: ${blog.views || 0}`;

      // ✅ Image preview logic
      const viewImage = document.getElementById("viewImage");
      const viewImageContainer = document.getElementById("viewImageContainer");

      if (blog.imageUrl) {
        viewImage.src = blog.imageUrl;
        viewImage.style.display = "block";
        viewImageContainer.style.display = "block";
      } else {
        viewImage.src = "";
        viewImage.style.display = "none";
        viewImageContainer.style.display = "none";
      }

      viewModal.classList.add("show");
    });
  }



  addBlogBtn.onclick = () => {
    document.getElementById("modalTitle").innerText = "Add New Blog";
    submitBtn.textContent = "Save Blog";
    document.getElementById("blogForm").reset();
    document.getElementById("blogId").value = "";
    imagePreview.style.display = "none";
    removeImageBtn.style.display = "none";
    populateCategoryDropdown();
    blogModal.classList.add("show");
  };

  closeBtns.forEach(
    (btn) => (btn.onclick = () => {
      blogModal.classList.remove("show");
      viewModal.classList.remove("show");
    })
  );

  window.onclick = (e) => {
    if (e.target === blogModal) blogModal.classList.remove("show");
    if (e.target === viewModal) viewModal.classList.remove("show");
  };

  document.getElementById("blogForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const blogId = document.getElementById("blogId").value;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;
    const status = document.getElementById("status").value;
    const views = document.getElementById("views").value;
    const imageFile = imageInput.files[0];

    if (!category) {
      alert("Please select a category.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categoryId", category);
    formData.append("content", content);
    formData.append("status", status);
    formData.append("views", views);
    if (imageFile) formData.append("image", imageFile);

    submitBtn.disabled = true;
    submitBtn.textContent = blogId ? "Updating Blog..." : "Saving Blog...";

    const method = blogId ? "PUT" : "POST";
    const url = blogId
      ? `https://my-style-mag-backend.onrender.com/api/v1/blog/${blogId}`
      : "https://my-style-mag-backend.onrender.com/api/v1/blog";

    fetch(url, {
      method: method,
      credentials: "include",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          loadAdminBlogs();
          this.reset();
          imagePreview.style.display = "none";
          removeImageBtn.style.display = "none";
          blogModal.classList.remove("show");
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((err) => alert("Error occurred: " + err))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = blogId ? "Update Blog" : "Save Blog";
      });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("action-menu")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => menu.remove());
    }
    if (e.target.classList.contains("action-menu")) {
      document.querySelectorAll(".dropdown-menu").forEach((menu) => menu.remove());
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown-menu";
      dropdown.innerHTML = `<button class="edit-btn">Edit</button><button class="delete-btn">Delete</button>`;
      const rect = e.target.getBoundingClientRect();
      dropdown.style.position = "fixed";
      dropdown.style.top = `${rect.bottom + 5}px`;
      dropdown.style.left = `${rect.left - 80}px`;
      document.body.appendChild(dropdown);

      dropdown.querySelector(".delete-btn").onclick = () => {
        const blogId = e.target.getAttribute("data-id");
        fetch(`https://my-style-mag-backend.onrender.com/api/v1/blog/${blogId}`, {
          method: "DELETE",
          credentials: "include"
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status) {
              e.target.closest("tr").remove();
              updateBlogCount();
              dropdown.remove();
            } else alert("Delete failed: " + data.message);
          });
      };

      dropdown.querySelector(".edit-btn").onclick = () => {
        const blogId = e.target.getAttribute("data-id");
        fetch(`https://my-style-mag-backend.onrender.com/api/v1/blog/${blogId}`, {
          method: "GET",
          credentials: "include"
        })
          .then(res => {
            if (!res.ok) {
              return res.text().then(text => {
                console.error("Non-200 response:", text);
                throw new Error(`HTTP ${res.status}: ${text}`);
              });
            }
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              return res.json();
            } else {
              return res.text().then(text => {
                console.error("Unexpected response type. Raw response:", text);
                throw new Error("Expected JSON but received something else.");
              });
            }
          })
          .then(data => {
            if (data.status) {
              const blog = data.data;
              document.getElementById("modalTitle").innerText = "Edit Blog";
              submitBtn.textContent = "Update Blog";
              document.getElementById("blogId").value = blog.id;
              document.getElementById("title").value = blog.title;
              document.getElementById("content").value = blog.content;
              document.getElementById("status").value = blog.status;
              document.getElementById("views").value = blog.views;
              const selectedCategoryId = blog.category?.id || "";
              populateCategoryDropdown(selectedCategoryId);

              if (blog.imageUrl) {
                imagePreview.src = blog.imageUrl;
                imagePreview.style.display = "block";
                removeImageBtn.style.display = "block";
              } else {
                imagePreview.style.display = "none";
                removeImageBtn.style.display = "none";
              }

              blogModal.classList.add("show");
              dropdown.remove();
            } else {
              alert("Failed to fetch blog details: " + data.message);
            }
          })
          .catch(err => {
            console.error("Error fetching blog:", err);
            alert(err.message);
          });
      };
    }
  })
  loadAdminBlogs();
  populateCategoryDropdown();
});
