const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const gravidade = 0.35;
const forcaPulo = -6;
const larguraCano = 75;
const espaco = 190;

let passaro, canos, pontos, acabou, quadro;

function reiniciar() {
  passaro = { x: 140, y: canvas.height / 2, tamanho: 25, velocidade: 0 };
  canos = [];
  pontos = 0;
  acabou = false;
  quadro = 0;
}

function pular() {
  if (acabou) {
    reiniciar();
  } else {
    passaro.velocidade = forcaPulo;
  }
}

document.addEventListener("keydown", function (evento) {
  if (evento.code === "Space") {
    evento.preventDefault();
    if (!evento.repeat) pular();
  }
});
canvas.addEventListener("pointerdown", pular);

function atualizar() {
  if (acabou) return;

  quadro++;
  passaro.velocidade += gravidade;
  passaro.y += passaro.velocidade;

  if (quadro % 100 === 0) {
    const altura = 70 + Math.random() * (canvas.height - espaco - 140);
    canos.push({ x: canvas.width, altura: altura, passou: false });
  }

  for (const cano of canos) {
    cano.x -= 3.5;

    if (!cano.passou && cano.x + larguraCano < passaro.x) {
      pontos++;
      cano.passou = true;
    }

    const encostouNoCano =
      passaro.x + passaro.tamanho > cano.x &&
      passaro.x < cano.x + larguraCano &&
      (passaro.y < cano.altura ||
        passaro.y + passaro.tamanho > cano.altura + espaco);

    if (encostouNoCano) acabou = true;
  }

  canos = canos.filter(cano => cano.x + larguraCano > 0);

  if (passaro.y < 0 || passaro.y + passaro.tamanho > canvas.height) {
    acabou = true;
  }
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#2eaf37";
  for (const cano of canos) {
    ctx.fillRect(cano.x, 0, larguraCano, cano.altura);
    ctx.fillRect(cano.x, cano.altura + espaco, larguraCano,
      canvas.height - cano.altura - espaco);
  }

  ctx.fillStyle = "#ff0000ff";
  ctx.fillRect(passaro.x, passaro.y, passaro.tamanho, passaro.tamanho);

  ctx.fillStyle = "#222";
  ctx.font = "bold 28px Arial";
  ctx.fillText("Pontos: " + pontos, 12, 35);

  if (acabou) {
    ctx.fillStyle = "#d62828";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#222";
    ctx.font = "18px Arial";
    ctx.fillText("Espaço ou clique para reiniciar", canvas.width / 2, canvas.height / 2 + 35);
    ctx.textAlign = "left";
  }
}

function jogar() {
  atualizar();
  desenhar();
  requestAnimationFrame(jogar);
}

reiniciar();
jogar();
