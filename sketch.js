let videos = [];
let canal = 0;

let osdTimer = 0;
let volumenTimer = 0;

let volumen = 0.5;

// modo standby HACER EL MP4 CARTEL //
let modoStandby = true;
let standby;

let nombresVideos = [
  "transporte.mp4",
  "animales.mp4",
  "eeducacionfinal.mp4",
  "ssalud.mp4",
  "trabajoo.mp4",
];

let autoTimer = 300; // 5 segundos a 60 FPS

let fuente;

function preload() {
  fuente = loadFont("vcrmono.ttf");
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


  // Crear video standby //

  standby = createVideo("standby.mp4");

  standby.hide();
  standby.volume(0);
  standby.loop();


  // Crear los videos //

  for (let i = 0; i < nombresVideos.length; i++) {

    let v = createVideo(nombresVideos[i]);

    v.hide();
    v.volume(volumen);

    // Los videos empiezan pausados y no se ponen en loop //
    v.pause();

    videos.push(v);
    configurarFinVideo(v);
  }

  
  // Los canales no arrancan porque la TV esta en standby //

  osdTimer = 0;
}


function draw() {

  background(0);


  // pa q no se vean los overlays //

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


// Teclado //

function keyPressed() {


  // encender tv en modosatandby espacio p arrancar modo canales //

  if (modoStandby && key === " ") {

    modoStandby = false;

    standby.pause();


    // el primer canal arranca desde 0 //
    videos[canal].time(0);

    videos[canal].play();

    osdTimer = 240;

    return;
  }


  // Mientras está en standby, ignorar las flechitas de volumen y canal//

  if (modoStandby) {
    return;
  }


  // ARRIBA = canal anterior //
  // Solo funciona cuando termina el cooldown //

  if (keyCode === RIGHT_ARROW) {

    if (autoTimer <= 0) {
      cambiarCanal(1);
    }
  }


  // ABAJO = canal siguiente //
  // Solo funciona cuando termina el cooldown //

  if (keyCode === LEFT_ARROW) {

    if (autoTimer <= 0) {
      cambiarCanal(-1);
    }
  }


  // DERECHA = subir volumen //

  if (keyCode === UP_ARROW) {

    volumen = min(volumen + 0.1, 1);

    actualizarVolumen();

    volumenTimer = 240;
  }


  // IZQUIERDA = bajar volumen //

  if (keyCode === DOWN_ARROW) {

    volumen = max(volumen - 0.1, 0);

    actualizarVolumen();

    volumenTimer = 240;
  }
}


// Cambiar canal //

function cambiarCanal(direccion) {


  // Pausar y resetear a 0 el video actual //

  if (videos[canal]) {
    videos[canal].pause();
    videos[canal].time(0);
  }


  // Cambiar de canal //

  canal += direccion;


  // Si baja de 0
  // pasa al último canal //

  if (canal < 0) {
    canal = videos.length - 1;
  }


  // Si supera el último
  // vuelve al primero el de mati//

  if (canal >= videos.length) {
    canal = 0;
  }


  // Aplicar volumen //

  videos[canal].volume(volumen);


  // El nuevo canal siempre empieza desde 0 //

  videos[canal].time(0);
  videos[canal].play();


  // Mostrar cartel del canal //

  osdTimer = 240;


  // Reiniciar cooldown
  // 300 frames = 5 segundos //

  autoTimer = 300;
}


// pasar automáticamente a la siguiente noticia cdo termina la actual //

function videoTerminado() {

  // Resetear el video que terminó a 0 //

  videos[canal].time(0);


  // Cambiar automáticamente al siguiente canal //

  canal++;

  if (canal >= videos.length) {
    canal = 0;
  }


  // Aplicar volumen al nuevo canal //

  videos[canal].volume(volumen);


  // Empezar el nuevo video desde 0 //

  videos[canal].time(0);
  videos[canal].play();


  // Mostrar cartel del nuevo canal //

  osdTimer = 240;


  // Reiniciar cooldown //

  autoTimer = 300;
}


// detectar cuándo termina cada MP4 //

function configurarFinVideo(video) {

  video.elt.addEventListener("ended", videoTerminado);
}


// Actualiz. volumen //

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


// Barra de volumen //

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
    height - 860,
  );


  // Fondo de barra //

  fill(80);

  rect(
    935,
    height - 830,
    220,
    16,
    4
  );


  // Nivel de volumen relleno //

  fill(255);

  rect(
    935,
    height - 830,
    volumen * 220,
    16
  );
}


// Tamaño ventana //

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}
