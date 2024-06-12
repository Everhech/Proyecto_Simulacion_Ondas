let ropeNumPoints = 100;
let amplitudeIncident; // Amplitud de la onda
let frequency; // Frecuencia de la onda
let img;
let time = 0;
let redBall = 2;
let relatedPosY;
let relatedPosYL;
let currentScene;
let font;
let aumentar = false;
let banderaReflejada = false;
let amplitud = 0;
let bandera = false;

let R = 0,
  T = 0;

let frecuenciaFormula = 0,
  amplitudFormula = 0,
  Densidad1Formula = 0,
  Densidad2Formula = 0;

// Variables que son necesarias para el movimiento
// También00000 van la "amplitudeIncident" y "frecuency"
let Tension = 0.2,
  Densidad1,
  Densidad2,
  k1 = 0,
  k2 = 0,
  Ar = 0,
  At = 0;
let at;

/**
 * Variables para las graficas
 */
let pasoFreeEnd = 0,
  pasoFixedEnd = 0,
  pasoTwoRopes = 0,
  pausar = false,
  x = 0;

function changeScene(event) {
  currentScene = event.target.value;
  resetSimulationVariables();
  startSimulation();
}

function resetSimulationVariables() {
  // Reiniciar todas las variables necesarias para la simulación
  amplitudeIncidente = 2 * 100; // Amplitud de la onda
  frequency = 6.32 / 50; // Frecuencia de la onda
  // Fase de la onda
  time = 0;
  // Si tienes arrays u otras estructuras de datos, también reinicialízalas aquí
}

function resetSimulation() {
  location.reload();
}

function pauseSimulation() {
  if (pausar == false) {
    pausar = true;
  } else {
    pausar = false;
  }
}

function preload() {
  img = loadImage("rope-texture.jpg");
  font = loadFont("Roboto-Bold.ttf");
}

function draw() {
  clear();
  startSimulation();
}

function updateSliderValue(sliderId, displayId) {
  let slider = document.getElementById(sliderId);
  let display = document.getElementById(displayId);

  if (slider && display) {
    display.textContent = slider.value;
  }

  // Actualizar las variables según el slider
  switch (sliderId) {
    case "sliderW":
      frecuenciaFormula = parseFloat(slider.value);
      frequency = frecuenciaFormula / 40;
      break;
    case "sliderA":
      amplitudFormula = parseFloat(slider.value);
      amplitudeIncident = amplitudFormula * 100;
      break;
    case "sliderU1":
      Densidad1Formula = parseFloat(slider.value);
      Densidad1 = Densidad1Formula;
      break;
    case "sliderU2":
      Densidad2Formula = parseFloat(slider.value);
      Densidad2 = Densidad2Formula;
      break;
  }

  // Actualizar la simulación
  startSimulation();
}

function drawFixedEndScene() {
  push();
  fill("black");
  translate(300, 0);
  cylinder(3, 450);
  pop();
  if (!pausar) {
    ropeForFixed();
  }
  fill("black");

  push();
  translate(300, relatedPosY);
  rotateX(70);
  torus(20, 2);
  pop();

  push();
  stroke(9);
  strokeWeight(8);
  line(-360, relatedPosYL, -360, 230);
  pop();
}

function drawTwoRopesScene() {
  if (!pausar) {
    ropeForTwo();
  }
  fill("black");
  push();
  stroke(9);
  strokeWeight(8);
  line(-360, relatedPosYL, -360, 230);
  pop();

  push();
  fill("brown");
  translate(-42, 0);
  cylinder(5, 450);
  pop();
}

function drawFreeEndScene() {
  /** Cylinder of the rope */
  push();
  let c = color("dodgerblue");
  specularColor(c);

  // Add a white point light from the top-right.
  pointLight(255, 255, 255, 30, -20, 40);

  // Style the sphere.
  noStroke();

  // Add a white specular material.
  specularMaterial(255, 255, 255);
  translate(300, 0);
  cylinder(6, 400);
  pop();
  if (!pausar) {
    ropeForFreeEnd();
  }
  fill("black");

  /*Ring of the end on the rope*/
  push();
  let b = color("yellow");
  specularColor(b);

  // Add a white point light from the top-right.
  pointLight(255, 255, 255, 30, -20, 40);

  // Style the sphere.
  noStroke();

  // Add a white specular material.
  specularMaterial(255, 255, 255);

  translate(300, relatedPosY);
  rotateX(QUARTER_PI + 0.2);
  rotateY(QUARTER_PI - 1.2);
  torus(13, 2);
  pop();

  push();
  stroke(9);
  strokeWeight(8);
  line(-360, relatedPosYL, -360, 230);
  pop();
}

function setup() {
  let canvas = createCanvas(750, 550, WEBGL);
  canvas.parent("simulation-container");
  background(222);
  frameRate(60);
  noStroke();

  //Inicializar los sliders
  frequency = document.getElementById("sliderW").value / 40;
  amplitudeIncident = document.getElementById("sliderA").value * 100;
  Densidad1 = document.getElementById("sliderU1").value;
  Densidad2 = document.getElementById("sliderU2").value;
}

function startSimulation() {
  clear();
  if (currentScene === "twoRopes") {
    drawTwoRopesScene();
    calculateCoeficientesRyT();
  } else if (currentScene === "fixedEnd") {
    drawFixedEndScene();
    calculateCoeficientesRyT();
  } else if (currentScene === "freeEnd") {
    drawFreeEndScene();
  }
}

function ropeForFixed() {
  //Primero, realizamos los respectivos cálculos
  k1 = calculateK1();
  k2 = calculateK2();
  u1 = Densidad1;
  u2 = Densidad2;
  Ai = amplitudeIncident;
  //Calculamos las amplitudes:
  At = amplitudeIncident;
  Reductor = At / 80;

  numEllipses = 159;
  ellipseArray = [];

  ellipsePosition = -360;
  ellipsePositionR = -40;
  for (let i = 0; i <= numEllipses; i++) {
    let y = 0;
    ellipsePosition = ellipsePosition + 4;

    if (i > 79) {
      fill("green");
      y += incidentWaveEquation(i);
      ellipse(ellipsePosition, y / 2, 10);
      if (i == numEllipses) {
        relatedPosY = y / 2;
      }
      if (i == 0) {
        relatedPosYL = y / 2;
      }
    } else {
      fill("green");
      y += incidentWaveEquation(i);
      ellipse(ellipsePosition, y / 2, 10);
      if (i == 0) {
        relatedPosYL = y / 2;
      }
    }
    ellipseArray.push({
      x: ellipsePosition,
      y: y / 2,
    });
  }
  push();
  stroke("green");
  for (let i = 0; i < numEllipses; i++) {
    let current = ellipseArray[i];
    let next = ellipseArray[i + 1];
    if (next) {
      line(current.x - 1, current.y + 4, next.x - 1, next.y - 2);
    }
  }
  pop();

  if (pasoFixedEnd < 1) {
    graphForFixedEnd();
    if (pasoFreeEnd > 0) pasoFreeEnd -= 1;
    if (pasoTwoRopes > 0) pasoTwoRopes--;
  }
  pasoFixedEnd++;
}

function ropeForFreeEnd() {
  //Primero, realizamos los respectivos cálculos
  k1 = calculateK1();
  k2 = calculateK2();
  //Calculamos las amplitudes:
  At = amplitudeIncident;
  Reductor = At / 80;
  numEllipses = 159;
  ellipseArray = [];

  ellipsePosition = -360;
  ellipsePositionR = -40;

  for (let i = 0; i <= numEllipses; i++) {
    let y = 0;
    let yR = 0;
    ellipsePosition = ellipsePosition + 4;

    if (Densidad1 != 0) {
      if (i > 79) {
        fill("red");
        y += WaveEquationFreeEnd(i);
        ellipse(ellipsePosition, y / 2, 10);
        if (i == numEllipses) {
          relatedPosY = y / 2;
        }
        if (i == 0) {
          relatedPosYL = y / 2;
        }
      } else {
        fill("red");
        y += WaveEquationFreeEnd(i);
        ellipse(ellipsePosition, y / 2, 10);
        if (i == 0) {
          relatedPosYL = y / 2;
        }
      }

      if (i > 79) {
        fill("red");
        ellipsePositionR = ellipsePositionR - 4;
        yR += reflectWaveEquationForTwo(i);
      }
    }

    ellipseArray.push({
      x: ellipsePosition,
      y: y / 2,
    });
  }
  push();
  stroke("red");
  for (let i = 0; i < numEllipses; i++) {
    let current = ellipseArray[i];
    let next = ellipseArray[i + 1];
    if (next) {
      line(current.x - 1, current.y + 4, next.x - 1, next.y - 2);
    }
  }
  pop();
  if (pasoFreeEnd < 1) {
    graphForFreeEnd();
    if (pasoFixedEnd > 0) pasoFixedEnd -= 1;
    if (pasoTwoRopes > 0) pasoTwoRopes--;
  }
  pasoFreeEnd++;
}

function ropeForTwo() {
  //Primero, realizamos los respectivos cálculos
  k1 = calculateK1();
  k2 = calculateK2();

  //Calculamos las amplitudes:
  Ar =
    ((Math.sqrt(Densidad1) - Math.sqrt(Densidad2)) /
      (Math.sqrt(Densidad1) + Math.sqrt(Densidad2))) *
    amplitudeIncident;
  At =
    ((2 * Math.sqrt(Densidad1)) /
      (Math.sqrt(Densidad1) + Math.sqrt(Densidad2))) *
    amplitudeIncident;

  Reductor = At / 80;
  numEllipses = 159;
  ellipseArray = [];

  ellipsePosition = -360;
  ellipsePositionR = -40;

  for (let i = 0; i <= numEllipses; i++) {
    let y = 0;
    let yR = 0;
    let yResult = 0;
    ellipsePosition = ellipsePosition + 4;

    if (i > 79) {
      fill("purple");
      y += WaveEquationTwoRopes(i);
      ellipse(ellipsePosition, y / 2, 10);
      if (i == numEllipses) {
        relatedPosY = y / 2;
      }
      if (i == 0) {
        relatedPosYL = y / 2;
      }
    } else {
      fill("green");
      y += WaveEquationTwoRopes(i);
      ellipse(ellipsePosition, y / 2, 10);
      if (i == 0) {
        relatedPosYL = y / 2;
      }
    }

    if (i > 79) {
      fill("red");
      ellipsePositionR = ellipsePositionR - 4;
      if (Densidad1 != Densidad2) {
        yR += reflectWaveEquationForTwo(i);
        ellipse(ellipsePositionR, yR / 2, 10);
        fill("blue");
        yResult += y + yR;
        ellipse(ellipsePositionR, yResult / 2, 10);
      }
    }

    ellipseArray.push({
      x: ellipsePosition,
      y: y / 2,
    });

    if (pasoTwoRopes < 1) {
      graphTwoRopes();
      if (pasoFixedEnd > 0) pasoFixedEnd -= 1;
      if (pasoFreeEnd > 0) pasoFreeEnd--;
    }
    pasoTwoRopes++;
  }
  push();
  stroke("black");
  for (let i = 0; i < numEllipses; i++) {
    let current = ellipseArray[i];
    let next = ellipseArray[i + 1];
    if (next) {
      line(current.x - 1, current.y + 4, next.x - 1, next.y - 2);
    }
  }
  pop();
}

function WaveEquationFreeEnd(y) {
  time += 0.01;
  if (y > time) {
    return 0;
  }
  if (Densidad1 == 0) {
    return 3000;
  }

  if (y > 79) {
    At = At + Reductor;
    return At * Math.cos(frequency * time - y * k1);
  } else {
    return amplitudeIncident * Math.cos(frequency * time - y * k1);
  }
}

function WaveEquationTwoRopes(y) {
  time += 0.01;
  if (y > time) {
    return 0;
  }

  T =
    (2 * Math.sqrt(Densidad1)) / (Math.sqrt(Densidad1) + Math.sqrt(Densidad2));

  if (y > 79) {
    if (Densidad1 < Densidad2) {
      At = T * amplitudeIncident;
      return At * Math.cos(frequency * time - y * k1 + Math.PI);
    } else if (Densidad1 > Densidad2) {
      At = T * amplitudeIncident;
      return At * Math.cos(frequency * time - y * k2);
    } else {
      At = T * amplitudeIncident;
      return At * Math.cos(frequency * time - y * k2);
    }
  } else {
    return amplitudeIncident * Math.cos(frequency * time - y * k1);
  }
}

function incidentWaveEquation(y) {
  time += 0.01;
  if (y > time) {
    return 0;
  }
  if (y >= 159) {
    bandera = true;
  }

  if (bandera) {
    if (y >= 130) {
      At = At - Reductor;
      Ar = (At / amplitudeIncident) * 70;
      let a = At * Math.cos(frequency * time - y * k1);
      let b = Ar * Math.cos(frequency * time + y * k1);
      return a + b;
    }
  }
  if (y > 79) {
    At = At - Reductor;
    return At * Math.cos(frequency * time - y * k1);
  } else {
    return amplitudeIncident * Math.cos(frequency * time - y * k1);
  }
}

function reflectWaveEquationForTwo(y) {
  if (y > time) {
    return 3000;
  }
  R =
    (Math.sqrt(Densidad1) - Math.sqrt(Densidad2)) /
    (Math.sqrt(Densidad1) + Math.sqrt(Densidad2));
  if (y > 79) {
    Ar = R * amplitudeIncident;
    return Ar * Math.cos(frequency * time + y * k1);
  }
}

function calculateCoeficientesRyT() {
  R =
    (Math.sqrt(Densidad1) - Math.sqrt(Densidad2)) /
    (Math.sqrt(Densidad1) + Math.sqrt(Densidad2));
  T =
    (2 * Math.sqrt(Densidad1)) / (Math.sqrt(Densidad1) + Math.sqrt(Densidad2));
  textFont(font);
  textSize(16);
  fill("black");
  text("Coeficiente de Reflexión: " + R.toFixed(2), 10, 220);
  text("Coeficiente de Transmisión: " + T.toFixed(2), 10, 240);
}

function calculateK1() {
  let V = Math.sqrt(Tension / Densidad1);
  let K = frequency / V;
  return K;
}

function calculateK2() {
  let V = Math.sqrt(Tension / Densidad2);
  let K = frequency / V;
  return K;
}

function ring(y) {
  translate(0, y);
}

/**
 *Graphs section
 */

// Mode: Free End
function getDataIncidentFreeEnd() {
  let resultado = amplitudeIncident * 2;
  if (aumentar == false) {
    at = amplitudeIncident;
    aumentar = true;
  }
  if (at < resultado) {
    at = at + Reductor;
    amplitud = at;
  }
  if (amplitud > resultado) {
    at -= Reductor;
  }
  var xI = at * Math.cos(k1 * x - frequency * time);
  return xI;
}
function getDataReflectFreeEnd() {
  var xR = 0;
  return xR;
}
function getDataSpreatFreeEnd() {
  var xT = 0;
  return xT;
}

// Mode: Fixed End
function getDataIncidentFixedEnd() {
  var xI = amplitudeIncident * Math.cos(k1 * x - frequency * time);
  return xI;
}
function getDataReflectFixedEnd() {
  Ar = At / amplitudeIncident;
  var xR = Ar * Math.cos(k1 * x + frequency * time);
  return xR;
}
function getDataSpreatFixedEnd() {
  var xT = 0;
  return xT;
}

// Mode: Two Ropes
function getDataIncidentTwoRopes() {
  var xI = amplitudeIncident * Math.cos(k1 * x - frequency * time);
  return xI;
}
function getDataReflectTwoRopes() {
  Ar = R * amplitudeIncident;
  var xR = Ar * Math.cos(k1 * x + frequency * time);
  return xR;
}
function getDataSpreatTwoRopes() {
  At = T * amplitudeIncident;
  var xT = At * Math.cos(k2 * x - frequency * time);
  return xT;
}

function graphForFreeEnd() {
  if (!pausar) {
    var layout = {
      title: "Movimientos",
      autosize: true,
      height: 300,
      xaxis: { title: "Tiempo (s)", range: [0, 200] },
      yaxis: { title: "Amplitud (cm)" },
      legend: {
        x: 0,
        y: -1,
      },
    };

    let positionDataI = {
      y: [getDataIncidentFreeEnd()],
      type: "line",
      name: "Onda Incidente",
    };
    let positionDataR = {
      y: [getDataReflectFreeEnd()],
      type: "line",
      name: "Onda Reflejada",
    };
    let positionDataT = {
      y: [getDataSpreatFreeEnd()],
      type: "line",
      name: "Onda Transmitida",
    };

    Plotly.newPlot(
      "Movimientos",
      [positionDataI, positionDataR, positionDataT],
      layout
    );

    plotlyInterval = setInterval(function () {
      if (!pausar) {
        x += 0.01;
        Plotly.extendTraces(
          "Movimientos",
          { y: [[getDataIncidentFreeEnd()]] },
          [0]
        );
        Plotly.extendTraces("Movimientos", { y: [[getDataReflectFreeEnd()]] }, [
          1,
        ]);
        Plotly.extendTraces("Movimientos", { y: [[getDataSpreatFreeEnd()]] }, [
          2,
        ]);
      }
    }, 5);
  }
}

function graphForFixedEnd() {
  if (!pausar) {
    var layout = {
      title: "Movimientos",
      autosize: true,
      height: 300,
      xaxis: { title: "Tiempo (s)", range: [0, 200] },
      yaxis: { title: "Amplitud (cm)" },
      legend: {
        x: 0,
        y: -1,
      },
    };

    let positionDataI = {
      y: [getDataIncidentFixedEnd()],
      type: "line",
      name: "Onda Incidente",
    };
    let positionDataR = {
      y: [getDataReflectFixedEnd()],
      type: "line",
      name: "Onda Reflejada",
    };
    let positionDataT = {
      y: [getDataSpreatFixedEnd()],
      type: "line",
      name: "Onda Transmitida",
    };

    Plotly.newPlot(
      "Movimientos",
      [positionDataI, positionDataR, positionDataT],
      layout
    );

    plotlyInterval = setInterval(function () {
      if (!pausar) {
        x += 0.01;
        Plotly.extendTraces(
          "Movimientos",
          { y: [[getDataIncidentFixedEnd()]] },
          [0]
        );
        Plotly.extendTraces(
          "Movimientos",
          { y: [[getDataReflectFixedEnd()]] },
          [1]
        );
        Plotly.extendTraces("Movimientos", { y: [[getDataSpreatFixedEnd()]] }, [
          2,
        ]);
      }
    }, 5);
  }
}

function graphTwoRopes() {
  if (!pausar) {
    var layout = {
      title: "Movimientos",
      autosize: true,
      height: 300,
      xaxis: { title: "Tiempo (s)", range: [0, 200] },
      yaxis: { title: "Amplitud (cm)" },
      legend: {
        x: 0,
        y: -1,
      },
    };

    let positionDataI = {
      y: [getDataIncidentTwoRopes()],
      type: "line",
      name: "Onda Incidente",
    };
    let positionDataR = {
      y: [getDataReflectTwoRopes()],
      type: "line",
      name: "Onda Reflejada",
    };
    let positionDataT = {
      y: [getDataSpreatTwoRopes()],
      type: "line",
      name: "Onda Transmitida",
    };

    Plotly.newPlot(
      "Movimientos",
      [positionDataI, positionDataR, positionDataT],
      layout
    );

    plotlyInterval = setInterval(function () {
      if (!pausar) {
        x += 0.01;
        Plotly.extendTraces(
          "Movimientos",
          { y: [[getDataIncidentTwoRopes()]] },
          [0]
        );
        Plotly.extendTraces(
          "Movimientos",
          { y: [[getDataReflectTwoRopes()]] },
          [1]
        );
        Plotly.extendTraces("Movimientos", { y: [[getDataSpreatTwoRopes()]] }, [
          2,
        ]);
      }
    }, 5);
  }
}

//endregion
