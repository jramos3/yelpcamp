// $(document).ready(() => {
//   setTimeout(() => {
//     $(".alert").alert("close");
//   }, 5000);
// });

document.querySelectorAll(".deleteBtn").forEach(deleteBtn => {
  deleteBtn.addEventListener("click", event => {
    if (!confirm("Are you sure you want to delete this?")) {
      event.preventDefault();
    }
  });
});
