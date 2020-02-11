/*
  License: see LICENSE
  Description: Oyun motorunun nasil çalıştığını gösteren dosya
  Oyunun ana aşamaları burada
 */
import {
    game
} from "./engine/engine";

let gm = game(640, // sahnenin eni
    360, // sahnenin boyu
    setup, // yukleme fonksiyonu
    ["./images/textureAtlas.json",
        "./images/insan.png"
    ], // oyun varliklari (resimler, sesler, fontlar vs)
    load // oyun kurulumu sirasinda ne olsun (yukleme ekrani vs gosteren fn)
);

gm.start(); // oyun yuklemesi baslar

// sahne tarayicinin göruntuleme boyutuna gore ayarlanir
gm.scaleToWindow();

// tarayici boyutu degistikçe sahnenin boyutu degistirilir
window.addEventListener("resize", event => {
    gm.scaleToWindow();
});

// kullanilacak nesneler deklare edilir
// dalgalar ile ilgili muhabbet
let kucukDalga, ortaDalga, buyukDalga, dalgaBoyu, dalgaEni;

// sesler
let dalgaSesi, insanSesi, muzik;

// tuslar
let yukariTus, asagiTus, sagTus, solTus;

// mouse
let mousePos = {
    "x": null,
    "y": null
};

// gostermek vs için
let titleMessage, messager;


// Sahneler
let titleScene, gameScene;

function load {
    // yukleme barini goster
    gm.progressBar.create(gm.canvas, gm.assets);
    gm.progressBar.update();
}

function setup() {
    // yukleme ekranini temizle
    gm.progressBar.remove();

    // Sahnelerin ogelerini yukle

    // Baslik Sahnesi
    // kullanılacak nesnelere oyun varliklari yuklenir
    insan = gm.sprite(gm.assets["insan.png"]);

    // yukleme bittikten sonra oyunun durumu oynama durumuna donusturulur
    gm.state = play;
}

function play() {
    // nesnelerle bir seyler yapilir.
}
