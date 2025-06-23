// Search Functionality for any visible table with class 'search-bar'
document.querySelector('.search-bar').addEventListener('input', function () {
  const searchValue = this.value.toLowerCase();
  const allTableRows = document.querySelectorAll('tbody tr');

  allTableRows.forEach(row => {
    const titleCell = row.querySelector('td');
    const titleText = titleCell?.textContent?.toLowerCase() || '';

    if (titleText.includes(searchValue)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// load admin details
function loadAdminDetails() {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  if (adminInfo) {
      document.getElementById("adminEmail").textContent = adminInfo.email;
  } else {
       window.location.href = "../index.html"
    }
  }

// Total Blogs Count
document.addEventListener("DOMContentLoaded", function () {
  const totalBlogsEl = document.getElementById("totalBlogs");

  

  fetch("https://my-style-mag-backend.onrender.com/api/v1/blog/admin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        totalBlogsEl.textContent = data.data.length;
      } else {
        totalBlogsEl.textContent = "0";
      }
    })
    .catch(error => {
      console.error("Error fetching blog count:", error);
      totalBlogsEl.textContent = "Error";
    });
});

// Total Styles Count
document.addEventListener("DOMContentLoaded", function () {
  const totalStylesEl = document.getElementById("totalStyles");

  fetch("https://my-style-mag-backend.onrender.com/api/v1/outfits", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        totalStylesEl.textContent = data.data.length;
      } else {
        totalStylesEl.textContent = "0";
      }
    })
    .catch(error => {
      console.error("Error fetching style count:", error);
      totalStylesEl.textContent = "Error";
    });
});

// Unpublished Blogs Count
document.addEventListener("DOMContentLoaded", function () {
  const unpublishedBlogsEl = document.getElementById("unpublishedBlogs");

  fetch("https://my-style-mag-backend.onrender.com/api/v1/blog/admin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        const unpublishedCount = data.data.filter(blog => blog.status !== "Published").length;
        unpublishedBlogsEl.textContent = unpublishedCount;
      } else {
        unpublishedBlogsEl.textContent = "0";
      }
    })
    .catch(error => {
      console.error("Error fetching unpublished blogs:", error);
      unpublishedBlogsEl.textContent = "Error";
    });
});

// Recent Published Blogs Table (First 5)
document.addEventListener("DOMContentLoaded", function () {
  const recentBlogsTableBody = document.querySelector(".recent-blogs-table tbody");
  if (!recentBlogsTableBody) return;

  fetch("https://my-style-mag-backend.onrender.com/api/v1/blog/admin", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        const publishedBlogs = data.data
          .filter(blog => blog.status === "Published")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .reverse();

        const recentBlogs = publishedBlogs.slice(0, 5);

        recentBlogsTableBody.innerHTML = "";

        recentBlogs.forEach(blog => {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td style="display:flex; align-items:center; gap:8px;">
              ${
                blog.imageUrl
                  ? `<img src="${blog.imageUrl}" alt="thumb" style="width:35px; height:35px; object-fit:cover; border-radius:50%;">`
                  : `<div style="width:35px; height:35px; background:#ccc; border-radius:50%;"></div>`
              }
              <span>${blog.title}</span>
            </td>
            <td>${blog.category?.name || 'Uncategorized'}</td>
            <td>${blog.status}</td>
            <td>${new Date(blog.createdAt).toLocaleDateString()}</td>
          `;
          recentBlogsTableBody.appendChild(newRow);
        });

        if (recentBlogs.length === 0) {
          const noDataRow = document.createElement("tr");
          noDataRow.innerHTML = `<td colspan="4" style="text-align:center;">No published blogs available</td>`;
          recentBlogsTableBody.appendChild(noDataRow);
        }
      }
    })
    .catch(error => {
      console.error("Error fetching recent published blogs:", error);
      const errorRow = document.createElement("tr");
      errorRow.innerHTML = `<td colspan="4" style="text-align:center;">Error loading blogs</td>`;
      recentBlogsTableBody.appendChild(errorRow);
    });
});


document.addEventListener("DOMContentLoaded", function () {
  const recentStylesTableBody = document.querySelector(".recent-styles-table tbody");
  if (!recentStylesTableBody) return;

  fetch("https://my-style-mag-backend.onrender.com/api/v1/outfits", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        const sortedStyles = data.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const recentStyles = sortedStyles.slice(0, 5);

        recentStylesTableBody.innerHTML = "";

        recentStyles.forEach(style => {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td style="display:flex; align-items:center; gap:8px;">
              ${
                style.imageUrls && style.imageUrls.length > 0
                  ? `<img src="${style.imageUrls[0]}" alt="thumb" style="width:35px; height:35px; object-fit:cover; border-radius:50%;">`
                  : `<div style="width:35px; height:35px; background:#ccc; border-radius:50%;"></div>`
              }
              <span>${style.title}</span>
            </td>
            <td>${style.category?.name || 'Uncategorized'}</td>
            <td>${new Date(style.createdAt).toLocaleDateString()}</td>
          `;
          recentStylesTableBody.appendChild(newRow);
        });

        if (recentStyles.length === 0) {
          const noDataRow = document.createElement("tr");
          noDataRow.innerHTML = `<td colspan="3" style="text-align:center;">No styles available</td>`;
          recentStylesTableBody.appendChild(noDataRow);
        }
      }
    })
    .catch(error => {
      console.error("Error fetching recent styles:", error);
      const errorRow = document.createElement("tr");
      errorRow.innerHTML = `<td colspan="3" style="text-align:center;">Error loading styles</td>`;
      recentStylesTableBody.appendChild(errorRow);
    });
});


document.addEventListener("DOMContentLoaded", function () {
  const totalUsersEl = document.getElementById("totalUsers");

  fetch("https://my-style-mag-backend.onrender.com/api/v1/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        totalUsersEl.textContent = data.total;
      } else {
        totalUsersEl.textContent = "0";
      }
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      totalUsersEl.textContent = "Error";
    });
});

window.addEventListener("load", () => {
  // Existing card animations
  document.querySelector(".blog-card").style.animation = "slideInTop 1.3s ease-out forwards";
  document.querySelector(".unpublished-card").style.animation = "slideInBottom 1.3s ease-out 0.2s forwards";
  document.querySelector(".style-card").style.animation = "slideInTop 1.3s ease-out 0.4s forwards";
  document.querySelector(".user-card").style.animation = "slideInBottom 1.3s ease-out 0.6s forwards";
});

window.addEventListener("DOMContentLoaded", loadAdminDetails())


