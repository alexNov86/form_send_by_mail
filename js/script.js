"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", formSend);

  async function formSend(event) {
    event.preventDefault();

    let error = formValidate(form);
    let formData = new FormData(form);
    formData.append("image", formImage.files[0]);

    if (error === 0) {
      form.classList.add("_sending");
      let response = await fetch("sendmail.php", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        let result = await response.json();
        console.log(result.message);
        formPreview.innerHTML = "";
        form.reset();
        form.classList.remove("_sending");
      } else {
        alert("Ошибка");
        form.classList.remove("_sending");
      }
    } else {
      alert("Заполните обязательные поля");
    }
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
    }
    return error;
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

  const formImage = document.getElementById("formImage");
  const formPreview = document.getElementById("formPreview");

  formImage.addEventListener("change", () => {
    fileVerification(formImage.files[0]);
    uploadFile(formImage.files[0]);
  });

  function fileVerification(file) {
    //проверка типа файла
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      alert("Разрешены только изображения.");
      formImage.value = "";
      return;
    }
    //проверка размера файла (<2 Мб)
    if (file.size > 2 * 1024 * 1024) {
      alert("Файл должен быть менее 2 Мб.");
      return;
    }
  }

  function uploadFile(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      formPreview.innerHTML = `<img src='${event.target.result}' alt='Фото'>`;
    };
    reader.onerror = function (event) {
      alert("Ошибка загруженного изображения");
    };
    reader.readAsDataURL(file);
  }
});
