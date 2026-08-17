let videos = [];
let canal = 0;

let osdTimer = 0;
let volumenTimer = 0;

let volumen = 0;

let nombresVideos = [
  "ssalud.mp4",
  "ttrabajo.mp4",
];
let autoTimer = 300; // 5 segundos a 60fps

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("monospace");

  // Crear los videos
  for (let i = 0; i < nombresVideos.length; i++) {
    let v = createVideo(nombresVideos[i]);

    v.hide();
    v.volume(volumen);
    v.pause();

    videos.push(v);
  }

  // Arranca el primer canal
  videos[canal].loop();
  osdTimer = 120;
}

function draw() {
  background(0);

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

  // Temporizador de cambio automático
if (autoTimer <= 0) {
  autoTimer--;// El cambio automático reinicia el timer adentro de la función
  }

  // Barra de progreso del temporizador automático
if (autoTimer > 0) {
  fill(0, 0, 0, 170);
  noStroke();
  rect(20, height - 20, 220, 10, 4);

  fill(255);
  rect(20, height - 20, map(autoTimer, 0, 300, 0, 220), 10, 4);
}
function keyPressed() {

  // ARRIBA = canal anterior
  if (keyCode === UP_ARROW) {
    if (autoTimer <= 0) {
      cambiarCanal(-1);
    }
  }

  // ABAJO = canal siguiente
  if (keyCode === DOWN_ARROW) {
    if (autoTimer <= 0) {
      cambiarCanal(1);
    }
  }

  // DERECHA = subir volumen
  if (keyCode === RIGHT_ARROW) {
    volumen = min(volumen + 0.1, 1);
    actualizarVolumen();
    volumenTimer = 120;
  }

  // IZQUIERDA = bajar volumen
  if (keyCode === LEFT_ARROW) {
    volumen = max(volumen - 0.1, 0);
    actualizarVolumen();
    volumenTimer = 120;
  }
}

function cambiarCanal(direccion) {
  // Pausar el video actual
  if (videos[canal]) {
    videos[canal].pause();
  }

  // Cambiar de canal
  canal += direccion;

  if (canal < 0) {
    canal = videos.length - 1;
  }

  if (canal >= videos.length) {
    canal = 0;
  }

  // Aplicar volumen y reproducir el nuevo canal
  videos[canal].volume(volumen);
  videos[canal].loop();

  osdTimer = 120;
  
  // SOLUCIÓN: El temporizador se reinicia SIEMPRE aquí, 
  // asegurando los 5 segundos completos cada vez que cambia el canal.
  autoTimer = 300; 
}

function actualizarVolumen() {
  if (videos[canal]) {
    videos[canal].volume(volumen);
  }
}

function dibujarCanal() {
  fill(0, 0, 0, 170);
  noStroke();
  rect(20, 20, 210, 65, 8);

  fill(255);
  textSize(30);
  textAlign(LEFT, TOP);
  text("Canal " + (canal + 1), 35, 35);
}

function dibujarVolumen() {
  fill(0, 0, 60, 170);
  noStroke();
  rect(650, height - 75, 270, 55, 8);

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Volumen " + int(volumen * 100), 750, height - 65);

  fill(80);
  rect(675, height - 38, 220, 16, 4);

  fill(255);
  rect(675, height - 38, volumen * 220, 16, 4);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
