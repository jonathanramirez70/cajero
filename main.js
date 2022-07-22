let cuentas = [
	{ nombre: "Mali", nip: 1234, saldo: 200 },
	{ nombre: "Gera", nip: 0000, saldo: 290 },
	{ nombre: "Maui", nip: 4321, saldo: 67 }
];

let user;

let movimiento;

const ABONO = 'abono';
const RETIRO = 'retiro';
const MAX = 990;
const MIN = 10;

const login = () => {
	const typedUser = document.getElementById('txtUser').value;
	const typedNip = document.getElementById('txtNip').value;
	user = cuentas.find(user => user.nombre.toLowerCase() === typedUser.toLowerCase() && user.nip == typedNip);
	if(!user) {
		alert("El usuario y/o el NIP proporcionados son incorrectos");
	} else {
		loadView('home');
	}
}

const loadView = (view) => {
	cleanView();
	loader();
	setTimeout(() => {
		cleanView();
		switch (view) {
			case 'home':
				loadHome();
				break;
			case 'movimiento':
				loadMovimiento();
				break;
			default:
				loadLogin();
				break;
		}
	}, 2000);
}

const cleanView = () => {
	mains = document.getElementsByTagName('main');
	Array.from(mains).forEach(el => el.classList.remove('visible'));
}

const loader = () => {
	let loadLogin = document.getElementById('loader');
	loadLogin.classList.add('visible');
}

const loadLogin = () => {
	if (user) return loadHome();
	let loginView = document.getElementById('login');
	loginView.classList.add('visible');
}

const loadHome = () => {
	if (!user) return loadLogin();
	document.getElementById('welcome').innerText = `Bienvenid@ ${user.nombre}`;
	document.getElementById('amount').innerText = formatter.format(user.saldo);
	let homeView = document.getElementById('home');
	homeView.classList.add('visible');
}

const loadMovimiento = () => {
	if (!user) return loadLogin();
	let mensaje;
	if(movimiento === ABONO){
		mensaje = 'Cantidad a abonar';
	} else {
		mensaje = 'Cantidad a retirar';
	}
	document.getElementById('tipo').innerText = mensaje;
	let movimientoView = document.getElementById('movimiento');
	movimientoView.classList.add('visible');
}

const realizarMovimiento = () => {
	let flag;
	if (movimiento === ABONO) {
		flag = abonar();
	} else {
		flag = retirar();
	}
	if (flag) {
		movimiento = null;
		loadView('home');
	}
}

const abonar = () => {
	let input = document.getElementById('txtCantidadMovimiento');
	newAmount = user.saldo + parseFloat(input.value);
	input.value = "";
	if (newAmount > MAX) {
		alert("No se puede tener más de $"+MAX+".00 de saldo en una cuenta");
		return false;
	}
	user.saldo = newAmount;
	return true;
}
const logout = () => {
	user = null;
	loadView('login');
}
const retirar = () => {
	let input = document.getElementById('txtCantidadMovimiento');
	newAmount = user.saldo - parseFloat(input.value);
	input.value = "";
	if (newAmount < MIN) {
		alert("No se puede tener menos de $"+MIN+".00 de saldo en una cuenta");
		return false;
	}
	user.saldo = newAmount;
	return true;
}
var formatter = new Intl.NumberFormat('es-MX', {
	style: 'currency',
	currency: 'MXN',
  });

window.addEventListener('load', () => {
	const btn = document.getElementById('btnLogin');	
	btn.addEventListener('click', login);
	loadView('login');
	var btnGroupMovimientos = document.getElementsByClassName('btn-movimiento');
	for (var i = 0; i < btnGroupMovimientos.length; i++) {
		btnGroupMovimientos[i].addEventListener('click', function(){
			movimiento = this.getAttribute('tipo');
			loadView('movimiento');
		}, false);
	}
	var btnGroupCantidades = document.getElementsByClassName('cantidades');
	for (var i = 0; i < btnGroupCantidades.length; i++) {
		btnGroupCantidades[i].addEventListener('click', function(){
			cantidad = this.getAttribute('amount');
			document.getElementById('txtCantidadMovimiento').value = cantidad;
		}, false);
	}
	document.getElementById('movimientoCancelar').addEventListener('click', () => {
		movimiento = null;
		loadView('home');
	})
	document.getElementById('movimientoAceptar').addEventListener('click', realizarMovimiento);
	document.getElementById('btnLogout').addEventListener('click', logout)
});

