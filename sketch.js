let videos = [];
let canal = 0;

let osdTimer = 0;
let volumenTimer = 0;

let volumen = 0.5;

// MODO STANDBY
let modoStandby = true;
let standby;

let nombresVideos = [
  "transporte.mp4",
  "animales.mp4",
  "educacion.mp4",
  "salud.mp4",
  "trabajo.mp4",
  "cocina.mp4",
  "lectura.mp4",
  "tecnologia.mp4",
];

let autoTimer = 300; // 5 segundos a 60 FPS

let fuente;

function preload() {
  fuente = loadFont("vcrmono.ttf");
}

function setup() {

  // Canvas
  createCanvas(windowWidth, windowHeight);

  // Evitar márgenes y scroll
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";

  background(0);
  textFont(fuente);

  // Crear video standby
  standby = createVideo("standby.mp4");

  standby.hide();
  standby.volume(0);
  standby.loop();
  standby.play();

  // Crear los videos de los canales
  for (let i = 0; i < nombresVideos.length; i++) {

    let v = createVideo(nombresVideos[i]);

    v.hide();
    v.volume(volumen);

    // Los videos empiezan pausados
    v.pause();

    videos.push(v);
    configurarFinVideo(v);
  }

  // Los canales no arrancan hasta salir del standby
  osdTimer = 0;
}


function draw() {

  background(0);

  // MODO STANDBY
  if (modoStandby) {

    image(
      standby,
      0,
      0,
      width,
      height
    );

    return;
  }

  // Mostrar video actual
  if (videos.length > 0) {
    image(videos[canal], 0, 0, width, height);
  }

  // Cartel del canal
  if (osdTimer > 0) {
    dibujarCanal();
    osdTimer--;
  }

  // Barra de volumen
  if (volumenTimer > 0) {
    dibujarVolumen();
    volumenTimer--;
  }

  // Cooldown
  if (autoTimer > 0) {
    autoTimer--;
  }

  // Barra de cooldown
  if (autoTimer > 0) {

    fill(0, 0, 0, 170);
    noStroke();

    rect(
      490,
      height - 855,
      260,
      40,
      8
    );

    fill(0);
    noStroke();

    rect(
      505,
      height - 840,
      220,
      10,
      4
    );

    fill(255);

    rect(
      505,
      height - 840,
      map(autoTimer, 0, 300, 0, 220),
      10,
      4
    );
  }
}


// TECLADO
function keyPressed() {

  // SPACE: salir del standby y encender TV
  if (modoStandby && key === " ") {

    modoStandby = false;

    standby.pause();

    // Arrancar primer canal
    videos[canal].time(0);
    videos[canal].play();

    osdTimer = 240;

    return;
  }

  // Mientras está en standby ignorar controles
  if (modoStandby) {
    return;
  }

  // FLECHA DERECHA: canal siguiente
  if (keyCode === RIGHT_ARROW) {

    if (autoTimer <= 0) {
      cambiarCanal(1);
    }
  }

  // FLECHA IZQUIERDA: canal anterior
  if (keyCode === LEFT_ARROW) {

    if (autoTimer <= 0) {
      cambiarCanal(-1);
    }
  }

  // FLECHA ARRIBA: subir volumen
  if (keyCode === UP_ARROW) {

    volumen = min(volumen + 0.1, 1);

    actualizarVolumen();

    volumenTimer = 240;
  }

  // FLECHA ABAJO: bajar volumen
  if (keyCode === DOWN_ARROW) {

    volumen = max(volumen - 0.1, 0);

    actualizarVolumen();

    volumenTimer = 240;
  }
}


// CAMBIAR CANAL
function cambiarCanal(direccion) {

  // Pausar y resetear video actual
  if (videos[canal]) {
    videos[canal].pause();
    videos[canal].time(0);
  }

  // Cambiar canal
  canal += direccion;

  // Si baja de 0, pasa al último
  if (canal < 0) {
    canal = videos.length - 1;
  }

  // Si supera el último, vuelve al primero
  if (canal >= videos.length) {
    canal = 0;
  }

  // Aplicar volumen
  videos[canal].volume(volumen);

  // Empezar nuevo canal desde 0
  videos[canal].time(0);
  videos[canal].play();

  // Mostrar cartel
  osdTimer = 240;

  // Reiniciar cooldown
  autoTimer = 300;
}


// CAMBIO AUTOMÁTICO AL TERMINAR VIDEO
function videoTerminado() {

  // Resetear video anterior
  videos[canal].time(0);

  // Cambiar automáticamente al siguiente
  canal++;

  if (canal >= videos.length) {
    canal = 0;
  }

  // Aplicar volumen
  videos[canal].volume(volumen);

  // Empezar nuevo video
  videos[canal].time(0);
  videos[canal].play();

  // Mostrar cartel
  osdTimer = 240;

  // Reiniciar cooldown
  autoTimer = 300;
}


// DETECTAR FIN DE CADA MP4
function configurarFinVideo(video) {

  video.elt.addEventListener("ended", videoTerminado);
}


// ACTUALIZAR VOLUMEN
function actualizarVolumen() {

  if (videos[canal]) {
    videos[canal].volume(volumen);
  }
}


// CARTEL DE CANAL
function dibujarCanal() {

  fill(0, 0, 0, 170);
  noStroke();

  rect(
    110,
    90,
    210,
    65,
    8
  );

  fill(255);

  textSize(30);
  textAlign(LEFT, TOP);

  text(
    "Canal " + (canal + 1),
    135,
    105
  );
}


// BARRA DE VOLUMEN
function dibujarVolumen() {

  fill(0, 0, 0, 171);
  noStroke();

  rect(
    910,
    height - 870,
    270,
    65,
    8
  );

  fill(255);

  textSize(16);
  textAlign(LEFT, TOP);

  text(
    "Volumen " + int(volumen * 100),
    1000,
    height - 860
  );

  // Fondo de barra
  fill(80);

  rect(
    935,
    height - 830,
    220,
    16,
    4
  );

  // Nivel de volumen
  fill(255);

  rect(
    935,
    height - 830,
    volumen * 220,
    16
  );
}


// TAMAÑO DE VENTANA
function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}
