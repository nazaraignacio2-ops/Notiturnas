let videos = [];
let canal = 0;

let osdTimer = 0;
let volumenTimer = 0;

let volumen = 0;

let nombresVideos = [
  "ssalud.mp4",
  "ttrabajo.mp4",
];

let autoTimer = 300; // 5 segundos a 60 FPS

let fuente;

function preload() {
  fuente = loadFont("vcrmono.ttf")
}

function setup() {

  // Canvas del tamaño de la ventana 1280x960 quedo ese el mejor (wndws) //
  createCanvas(windowWidth, windowHeight);

  // Evitar márgenes y el coso de scroll //
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden";

  background(0);
  textFont(fuente);


  // Crear los videos //
  for (let i = 0; i < nombresVideos.length; i++) {

    let v = createVideo(nombresVideos[i]);

    v.hide();
    v.volume(volumen);
    v.pause();

    videos.push(v);
  }


  // Arranca el primer canal //
  videos[canal].loop();

  osdTimer = 120;
}


function draw() {

  background(0);


  // Mostrar video actual //
  if (videos.length > 0) {
    image(videos[canal], 0, 0, width, height);
  }


  // Cartel del canal //
  if (osdTimer > 0) {
    dibujarCanal();
    osdTimer--;
  }


  // Barra de volumen //
  if (volumenTimer > 0) {
    dibujarVolumen();
    volumenTimer--;
  }


  // Cooldown //

  if (autoTimer > 0) {
    autoTimer--;
  }

  
  // Barra de Cooldown //

  if (autoTimer > 0) {

    fill(0, 0, 0, 170);
    noStroke();

    rect(
      20,
      height - 20,
      220,
      10,
      4
    );


    fill(255);

    rect(
      20,
      height - 20,
      map(autoTimer, 0, 300, 0, 220),
      10,
      4
    );
  }
}


// Teclado // aHOla

function keyPressed() {


  // ARRIBA = canal anterior //
  // Solo funciona cuando termina el cooldown //

  if (keyCode === UP_ARROW) {

    if (autoTimer <= 0) {
      cambiarCanal(-1);
    }
  }


  // ABAJO = canal siguiente //
  // Solo funciona cuando termina el cooldown //

  if (keyCode === DOWN_ARROW) {

    if (autoTimer <= 0) {
      cambiarCanal(1);
    }
  }


  // DERECHA = subir volumen //

  if (keyCode === RIGHT_ARROW) {

    volumen = min(volumen + 0.1, 1);

    actualizarVolumen();

    volumenTimer = 120;
  }


  // IZQUIERDA = bajar volumen //

  if (keyCode === LEFT_ARROW) {

    volumen = max(volumen - 0.1, 0);

    actualizarVolumen();

    volumenTimer = 120;
  }
}


// Cambiar canal //

function cambiarCanal(direccion) {


  // Pausar el video actual //

  if (videos[canal]) {
    videos[canal].pause();
  }


  // Cambiar de canal //

  canal += direccion;


  // Si baja de 0
  // pasa al último canal //

  if (canal < 0) {
    canal = videos.length - 1;
  }


  // Si supera el último 
  // vuelve al primero //

  if (canal >= videos.length) {
    canal = 0;
  }


  // Aplicar volumen
  // y reproducir nuevo canal //

  videos[canal].volume(volumen);

  videos[canal].loop();


  // Mostrar cartel del canal //

  osdTimer = 120;


  // Reiniciar cooldown
  // 300 frames = 5 segundos //

  autoTimer = 300;
}


// Actualiz. vOlumen //

function actualizarVolumen() {

  if (videos[canal]) {
    videos[canal].volume(volumen);
  }
}


// Cartel de canal //

function dibujarCanal() {

  fill(0, 0, 0, 170);

  noStroke();

  rect(
    20,
    20,
    210,
    65,
    8
  );


  fill(255);

  textSize(30);

  textAlign(LEFT, TOP);

  text(
    "Canal " + (canal + 1),
    35,
    35
  );
}


// Barra de volumrn //

function dibujarVolumen() {

  fill(0, 0, 0, 171);

  noStroke();

  rect(
    450,
    height - 75,
    270,
    55,
    8
  );


  fill(255);

  textSize(16);

  textAlign(LEFT, TOP);

  text(
    "Volumen " + int(volumen * 100),
    650,
    height - 65
  );


  // Fondo de barra //

  fill(80);

  rect(
    475,
    height - 38,
    220,
    16,
    4
  );


  // Nivel de volumen relleno //

  fill(255);

  rect(
    475,
    height - 38,
    volumen * 220,
    16
  );
}


// tamaño ventana //

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}
