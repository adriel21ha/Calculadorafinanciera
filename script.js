// ===== LOGIN =====
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const fijos = [
        { email: "admin@gmail.com", password: "0000" },
        { email: "adrielrafaelhernandez@gmail.com", password: "0000" }
    ];

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const todos = [...fijos, ...usuarios];
    const valido = todos.find(u => u.email === email && u.password === password);

    if (valido) {
        localStorage.setItem("usuario", email);
        window.location.href = "dashboard.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});

// ===== REGISTRO =====
document.getElementById("registroForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let telefono = document.getElementById("telefono").value;

    if (password.length < 4) {
        alert("La contraseña debe tener al menos 4 caracteres");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        alert("Este correo ya está registrado");
        return;
    }

    usuarios.push({ nombre, email, password, telefono });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert(`¡Cuenta creada exitosamente! Bienvenido, ${nombre}`);
    window.location.href = "index.html";
});

// ===== HELPERS =====
function getUsuarioActual() {
    return localStorage.getItem("usuario");
}

function getKeyIngresos() {
    return `ingresos_${getUsuarioActual()}`;
}

// ===== NAVEGACIÓN =====
function irCalcular() {
    window.location.href = "ingresos.html";
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    history.pushState(null, null, "index.html");
    window.location.replace("index.html");
}

// ===== MÓDULO INGRESOS =====
const ingresoForm = document.getElementById("ingresoForm");

if (ingresoForm) {
    mostrarIngresos();
    actualizarTotalIngresos();

    ingresoForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let concepto = document.getElementById("concepto").value;
        let monto = document.getElementById("monto").value;
        let tipo = document.getElementById("tipo").value;

        let ingresos = JSON.parse(localStorage.getItem(getKeyIngresos())) || [];
        ingresos.push({ concepto, monto, tipo });
        localStorage.setItem(getKeyIngresos(), JSON.stringify(ingresos));

        ingresoForm.reset();
        mostrarIngresos();
        actualizarTotalIngresos();
    });
}

// ===== MOSTRAR INGRESOS =====
function mostrarIngresos() {
    let lista = document.getElementById("listaIngresos");
    if (!lista) return;

    lista.innerHTML = "";

    let ingresos = JSON.parse(localStorage.getItem(getKeyIngresos())) || [];

    ingresos.forEach((ing, index) => {
        let li = document.createElement("li");
        let esGasto = ing.tipo === "gasto";
        li.style.color = esGasto ? "red" : "green";
        li.innerHTML = `
            ${esGasto ? "[-]" : "[+]"} ${ing.concepto} - $${ing.monto}
            <button onclick="eliminarIngreso(${index})">❌</button>
        `;
        lista.appendChild(li);
    });
}

// ===== ELIMINAR CON CONFIRMACIÓN =====
function eliminarIngreso(index) {
    const confirmado = confirm("¿Seguro que quieres eliminar este registro?");
    if (!confirmado) return;

    let ingresos = JSON.parse(localStorage.getItem(getKeyIngresos())) || [];
    ingresos.splice(index, 1);
    localStorage.setItem(getKeyIngresos(), JSON.stringify(ingresos));

    mostrarIngresos();
    actualizarTotalIngresos();
}

// ===== TOTAL (ingresos - gastos) =====
function actualizarTotalIngresos() {
    const ingresos = JSON.parse(localStorage.getItem(getKeyIngresos())) || [];
    let total = ingresos.reduce((sum, ing) => {
        let monto = Number(ing.monto) || 0;
        return ing.tipo === "gasto" ? sum - monto : sum + monto;
    }, 0);

    const el = document.getElementById("totalIngresos");
    if (el) {
        el.textContent = `$${total}`;
        el.style.color = total < 0 ? "red" : "green";
    }
}

actualizarTotalIngresos();

// ===== SALUDO =====
const usuario = localStorage.getItem("usuario");
const saludo = document.getElementById("saludo");
if (saludo) {
    saludo.textContent = usuario ? `Bienvenido, ${usuario}` : "";
}