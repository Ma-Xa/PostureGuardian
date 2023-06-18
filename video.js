let videofeed;
let posenet;
let poses = [];
let started = false;
var audio = document.getElementById("audioElement");

// p5.js функция setup() для настройки холста для видеопотока с веб-камеры
function setup() {
  //создаем холст, задавая размеры
  const canvas = createCanvas(400, 450);
  canvas.parent("video");

  videofeed = createCapture(VIDEO);
  videofeed.size(width, height);
  console.log("setup");

  // настройка модели postnet для подачи в видеопоток.
  posenet = ml5.poseNet(videofeed);

  posenet.on("pose", function (results) {
    poses = results;
  });

  videofeed.hide();
  noLoop();

    // Вызываем функцию showBreakMessage() каждые 10 минут (600 000 миллисекунд)
    setInterval(showBreakMessage, 600000);
}

// // p5.js функция рисования() вызывается после функции настройки
function draw() {
  if (started) {
    image(videofeed, 0, 0, width, height);
    calEyes();
  }
}

//-----------------------------------------------
// Регистрируем Service Worker при загрузке страницы
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker зарегистрирован');
    })
    .catch(function(error) {
      console.error('Ошибка при регистрации Service Worker:', error);
    });
}
//-----------------------------------------------------------

// кнопка переключения для запуска видеопотока
function start() {
  select("#startstop").html("Стоп");
  document.getElementById("startstop").addEventListener("click", stop);
  started = true;
  loop();
  navigator.serviceWorker.controller.postMessage('start');
}

// кнопка переключения для завершения видеопотока
function stop() {
  select("#startstop").html("Старт");
  document.getElementById("startstop").addEventListener("click", start);
  removeblur();
  started = false;
  noLoop();
  navigator.serviceWorker.controller.postMessage('stop');
}

// определение параметров, используемых для postnet : отслеживание взгляда
var rightEye,
  leftEye,
  defaultRightEyePosition = [],
  defaultLeftEyePosition = [];

//функция для вычисления положения различных ключевых точек
function calEyes() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      rightEye = pose.keypoints[2].position;
      leftEye = pose.keypoints[1].position;

      //  ключевые точки - это точки, представляющие различные соединения на теле, распознанные postnet

      while (defaultRightEyePosition.length < 1) {
        defaultRightEyePosition.push(rightEye.y);
      }

      while (defaultLeftEyePosition.length < 1) {
        defaultLeftEyePosition.push(leftEye.y);
      }

      // если текущее положение тела слишком далеко от исходного, вызывается функция размытия
      if (Math.abs(rightEye.y - defaultRightEyePosition[0]) > 25) {
        blur();
      }
      if (Math.abs(rightEye.y - defaultRightEyePosition[0]) < 25) {
        removeblur();
      }
    }
  }
}

//функция размытия фона и добавления звукового эффекта
function blur() {
  document.body.style.filter = "blur(5px)";
  document.body.style.transition = "1s";
  var audio = document.getElementById("audioElement");
  console.log("change");
  audio.play();
}

//функция для устранения эффекта размытия
function removeblur() {
  document.body.style.filter = "blur(0px)";
  var audio = document.getElementById("audioElement");

  audio.pause();
}

function showBreakMessage() {
  alert("Не забывайте делать зарядку для глаз");
}

/** Этот код представляет собой программу на JavaScript, которая использует p5.js библиотека и ml5.js библиотека для создания веб-приложения, 
 которое отслеживает глаза человека в режиме реального времени с использованием методов визуализации.
 Программа захватывает видеопоток с веб-камеры пользователя и использует модель PoseNet из ml5.js библиотека для отслеживания положения глаз человека.
Программа также включает в себя кнопку переключения, которая запускает и останавливает видеопоток. Когда запускается видеопоток, программа отображает видео на холсте и 
применяет эффект размытия к фону, когда глаза человека перемещаются слишком далеко от своего первоначального положения. 
Кроме того, программа воспроизводит звуковой эффект при применении эффекта размытия и останавливает звуковой эффект при удалении эффекта размытия.

Код обеспечивает все эти функциональные возможности путем определения нескольких переменных и функций, включая 
функцию setup(), функцию draw(), функцию start(), функцию stop(), функцию calEyes(), функцию blur() и функцию removeblur(). */