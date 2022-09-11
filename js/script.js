"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);

  async function formSend(event) {
    event.preventDefault();

    let error = formValidate(form);
  }

  function formValidate(form) {
    let error = 0;
    let formRequired = document.querySelectorAll("._req");

    for (let index = 0; index < formRequired.length; index++) {
      const input = formRequired[index];
      formRemoveError(input);

      if (input.classList.contains("_email")) {
        if (!emailVerification(input)) {
          formAddError(input);
          error++;
        }
      } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
        formAddError(input);
        error++;
      } else {
        if (input.value === "") {
          formAddError(input);
          error++;
        }
      }
      console.log(error);
    }
  }

  function formAddError(input) {
    input.parentElement.classList.add("_error");
    input.classList.add("_error");
  }
  function formRemoveError(input) {
    input.parentElement.classList.remove("_error");
    input.classList.remove("_error");
  }
  function emailVerification(input) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
});
