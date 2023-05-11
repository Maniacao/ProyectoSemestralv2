
//Registro de usuario guarda en json los datos

const form = document.querySelector('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

function registerUser(username, password) {
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      showAlert(data.message, data.status);
    });
}

// Inicio de sesion con usuario especifico user1 y pass1

function login() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === 'user1' && password === 'pass1') {
    showAlert('Sesión iniciada', 'success');
  } else {
    showAlert('Hubo un error al iniciar sesión', 'error');
  }
}

// Alerta de inicio de sesion

function showAlert(message, status) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${status} mt-3`;
  alert.textContent = message;
  form.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

form.addEventListener('submit', event => {
  event.preventDefault();

  if (event.submitter.textContent === 'Registrarse') {
    const username = usernameInput.value;
    const password = passwordInput.value;
    registerUser(username, password);
  } else if (event.submitter.textContent === 'Iniciar sesión') {
    login();
  }
});

// Seleccion de producto con imagen y descripcion

const productSelect = document.getElementById("product-select");
const productImage = document.querySelector(".product-image");
const productDescription = document.querySelector(".product-description");

productSelect.addEventListener("change", () => {

  const selectedValue = productSelect.value;

  switch (selectedValue) {
    case "producto-1":
      productImage.src = "img/jugete.jpg";
      productDescription.textContent = "Kong para perros: 10000CLP";
      break;
    case "producto-2":
      productImage.src = "img/jugete2.jpg";
      productDescription.textContent = "Hueso de plastico: 5000CLP";
      break;
    case "producto-3":
      productImage.src = "img/jugete3.jpg";
      productDescription.textContent = "Peluche de hongo: 5000CLP";
      break;
    case "producto-4":
      productImage.src = "img/jugete4.jpg";
      productDescription.textContent = "Mini tunel: 5000CLP";
      break;
    case "producto-5":
      productImage.src = "img/jugete5.png";
      productDescription.textContent = "Varita loro: 5000CLP";
      break;
    case "producto-6":
      productImage.src = "img/jugete6.jpg";
      productDescription.textContent = "Torre de pelotas: 5000CLP";
      break;
    case "producto-7":
      productImage.src = "img/jugete7.jpg";
      productDescription.textContent = "Mancuerna plastica: 5000CLP";
      break;
    case "producto-8":
      productImage.src = "img/jugete8.jpg";
      productDescription.textContent = "Pelota de plastico: 5000CLP";
      break;
    default:
      productImage.src = "";
      productDescription.textContent = "";
      break;
  }
});

// API Menu regiones para envio de productos

$.ajax({
  url: "https://apis.digital.gob.cl/dpa/regiones",
  type: "GET",
  crossDomain: true,
  dataType: "jsonp",
  success: function (data) {
    $.each(data, function (i, item) {
      $("#cboRegiones").append(
        "<option value='" + item.codigo + "'>" + item.nombre + "</option>"
      );
    });
  },
  error: function (xhr, status, error) {
    console.log("Error al obtener las regiones: " + error);
  },
});

$("#cboRegiones").change(function () {
  var idRegion = $("#cboRegiones").val();
  $("#cboProvincias").attr("disabled", false);
  $("#cboComunas").attr("disabled", true);
  $("#cboProvincias").empty();
  $("#cboProvincias").append("<option hidden disable>Seleccione una opcion</option>");
  $("#cboComunas").empty();
  $("#cboComunas").append("<option hidden disable>Seleccione una opcion</option>");
  $.ajax({
    url: "https://apis.digital.gob.cl/dpa/regiones/" + idRegion + "/provincias",
    type: "GET",
    crossDomain: true,
    dataType: "jsonp",
    success: function (data) {
      $.each(data, function (i, item) {
        $("#cboProvincias").append(
          "<option value='" + item.codigo + "'>" + item.nombre + "</option>"
        );
      });
    },
    error: function (xhr, status, error) {
      console.log("Error al obtener las provincias: " + error);
    },
  });
});

$("#cboProvincias").change(function () {
  var idRegion = $("#cboRegiones").val();
  var idProvincia = $("#cboProvincias").val();
  $("#cboComunas").attr("disabled", false);
  $("#cboComunas").empty();
  $("#cboComunas").append("<option hidden disable>Seleccione una opcion</option>");
  $.ajax({
    url: "https://apis.digital.gob.cl/dpa/regiones/" + idRegion + "/provincias/" + idProvincia + "/comunas",
    type: "GET",
    crossDomain: true,
    dataType: "jsonp",
    success: function (data) {
      $.each(data, function (i, item) {
        $("#cboComunas").append(
          "<option value='" + item.codigo + "'>" + item.nombre + "</option>"
        );
      });
    },
    error: function (xhr, status, error) {
      console.log("Error al obtener las comunas: " + error);
    },
  });
});


// Boton comprar con resumen de compra

const comprarBtn = document.getElementById('comprar-btn');
const resumenCompra = document.getElementById('resumen-compra');

comprarBtn.addEventListener('click', (event) => {
  event.preventDefault();


  const select = document.getElementById('product-select');
  if (select.selectedIndex === -1 || select.value === 'nons') {
    alert("Por favor, elige una opción en el campo 'producto'.");
    return;
  }
  const selectedOption = select.options[select.selectedIndex];
  const producto = selectedOption.text;

  const direccion = document.getElementById('direccion').value;

  if (direccion.length === 0) {
  alert("El campo 'direccion' no puede estar vacío.");
  return;
  }

  // Seleccion especifica para nombres

  const region = document.getElementById('cboRegiones').options[document.getElementById('cboRegiones').selectedIndex].text;
  const provincia = document.getElementById('cboProvincias').options[document.getElementById('cboProvincias').selectedIndex].text;
  const comuna = document.getElementById('cboComunas').options[document.getElementById('cboComunas').selectedIndex].text;

  const resumen = `Has comprado el producto ${producto} y será enviado a la dirección ${direccion} en la comuna de ${comuna}, provincia de ${provincia}, región de ${region}.`;

  resumenCompra.textContent = resumen;
});

// Api de imagenes de perros aleatorias

function getDogImage() {
  fetch('https://dog.ceo/api/breeds/image/random')
  .then(response => response.json())
  .then(data => {
    document.getElementById('dog-image').innerHTML = `<img src="${data.message}" alt="Imagen de perro">`;
  });
}

// Funcion contacto que guarda en un json los datos

function enviarFormulario() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var subject = document.getElementById("subject").value;
  var message = document.getElementById("message").value;

  if (name == "" || email == "" || subject == "" || message == "") {
    alert("Por favor, complete todos los campos");
    return false;
  }

  var data = {
    name: name,
    email: email,
    subject: subject,
    message: message
  };

  console.log(data);
}
