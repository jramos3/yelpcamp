// $(document).ready(() => {
//   setTimeout(() => {
//     $(".alert").alert("close");
//   }, 5000);
// });

const formatToCurrency = event => {
  let val = event.target.value;

  if (val) {
    val = Math.round(val * 100) / 100;
    event.target.value = val.toFixed(2);
  }
};

const trimLeadingTrailingSpaces = event => {
  let val = event.target.value;

  val = val.trim();
  event.target.value = val;
};

const displayStarRating = () => {
  document.querySelectorAll(".stars-inner").forEach(innerStar => {
    const starPercentage = innerStar.getAttribute("data-starPercentage");
    innerStar.style.width = starPercentage;
  });

  // const innerStar = document.querySelector(".stars-inner");
  // const starPercentage = document
  //   .querySelector(".stars-inner")
  //   .getAttribute("data-starPercentage");

  // innerStar.style.width = starPercentage;
};

document.querySelectorAll(".deleteBtn").forEach(deleteBtn => {
  deleteBtn.addEventListener("click", event => {
    if (!confirm("Are you sure you want to delete this?")) {
      event.preventDefault();
    }
  });
});

document.querySelectorAll(".priceControl").forEach(priceCtrl => {
  priceCtrl.addEventListener("blur", formatToCurrency);
});

document.querySelectorAll(".priceControl").forEach(priceCtrl => {
  priceCtrl.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      formatToCurrency(event);
    }
  });
});

document.querySelectorAll("form input[type=text]").forEach(ctrl => {
  ctrl.addEventListener("blur", trimLeadingTrailingSpaces);
});

document.querySelectorAll("form input[type=text]").forEach(ctrl => {
  ctrl.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      trimLeadingTrailingSpaces(event);
    }
  });
});

document.addEventListener("DOMContentLoaded", displayStarRating);
