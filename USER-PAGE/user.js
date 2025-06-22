document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("usersTableBody");

  // Fetch users and populate the table
  fetch("https://my-style-mag-backend.onrender.com/api/v1/users", {
    method: "GET",
    credentials: "include"
  })
    .then(response => response.json())
    .then(responseData => {
      console.log("Fetched data:", responseData);

      if (responseData.status && Array.isArray(responseData.data) && responseData.data.length > 0) {
        // ✅ Update total users count here
        document.getElementById("totalUsers").innerText = `(${responseData.total})`;

        responseData.data.forEach(user => {
          const row = document.createElement("tr");

          const createdAt = new Date(user.createdAt).toLocaleString();
          const updatedAt = new Date(user.updatedAt).toLocaleString();

          row.innerHTML = `
            <td><input type="checkbox" /></td>
            <td class = "title-cell">
              <div class="user-info">
                <div class="avatar-placeholder">${user.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${user.name}</span>
              </div>
            </td>
            <td>${user.email}</td>
            <td>${updatedAt}</td>
            <td>${createdAt}</td>
            <td class="actions-cell">
              <button class="action-btn" data-id="${user.id}">⋮</button>
              <div class="action-menu" id="menu-${user.id}">
                <div class="action-item view-btn" data-id="${user.id}">View</div>
                <div class="action-item delete-btn" data-id="${user.id}">Delete</div>
              </div>
            </td>
          `;

          tableBody.appendChild(row);
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
        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="6">No users found.</td></tr>`;
        // ✅ Set total to 0 if no users
        document.getElementById("totalUsers").innerText = `(0)`;
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      tableBody.innerHTML = `<tr><td colspan="6">Failed to load users.</td></tr>`;
      // ✅ Set total to 0 on fetch error too
      document.getElementById("totalUsers").innerText = `(0)`;
    });

  // Event delegation for dropdown actions inside tableBody
  tableBody.addEventListener("click", function (e) {
    // View button click
    if (e.target.classList.contains("view-btn")) {
      const userId = e.target.getAttribute("data-id");
      showToast(`View functionality for user ${userId} coming soon!`);
    }

    // Delete button click (temporarily disabled)
    if (e.target.classList.contains("delete-btn")) {
      showToast("Delete functionality not available yet.");
    }

    // Open the action menu
    if (e.target.classList.contains("action-btn")) {
      const userId = e.target.getAttribute("data-id");
      const menu = document.getElementById(`menu-${userId}`);
      menu.classList.toggle("show");
      e.stopPropagation();
    }
  });

  // Close any open menus when clicking outside
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".action-menu").forEach(menu => {
      if (!menu.contains(e.target) && !e.target.classList.contains("action-btn")) {
        menu.classList.remove("show");
      }
    });
  });

  // Function to delete user (disabled for now)
  function deleteUser(userId, tableRow) {
    fetch(`https://my-style-mag-backend.onrender.com/api/v2/users/${userId}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then(response => {
        if (response.status === 204) {
          return { status: true };
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new Error("Non-JSON response received: " + response.status);
        }
      })
      .then(data => {
        if (data.status) {
          showToast("User deleted successfully.");
          tableRow.remove();
        } else {
          showToast("Failed to delete user: " + (data.message || "Unknown error."));
        }
      })
      .catch(error => {
        console.error("Delete error:", error);
        showToast("An error occurred while deleting the user.");
      });
  }

  // Function to show toast messages
  function showToast(message) {
    let toast = document.createElement("div");
    toast.className = "custom-toast";
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

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
});
