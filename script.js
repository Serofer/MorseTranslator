var translation_string = "";
var translated_morse = "";

//without a function for the slider
var slider_wpm = document.getElementById("WPM");
var slider_word = document.getElementById("word");
var output_wpm = document.getElementById("WPM_value");
var output_word = document.getElementById("word_value");
var wpm = 20;

var word_pause = 1000;
output_wpm.innerHTML = display_value(slider_wpm, output_wpm, wpm);
output_word.innerHTML = display_value(slider_word, output_word, word_pause);

function display_value(slider, output, LENGTH_VALUE) {
  slider.oninput = function () {
    output.innerHTML = this.value;
    LENGTH_VALUE = slider.value;
  };
}
//without a function ends here

const dictionary_A = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  0: "-----",
  " ": "/",
};
const dictionary_B = {
  ".-": "a",
  "-...": "b",
  "-.-.": "c",
  "-..": "d",
  ".": "e",
  "..-.": "f",
  "--.": "g",
  "....": "h",
  "..": "i",
  ".---": "j",
  "-.-": "k",
  ".-..": "l",
  "--": "m",
  "-.": "n",
  "---": "o",
  ".--.": "p",
  "--.-": "q",
  ".-.": "r",
  "...": "s",
  "-": "t",
  "..-": "u",
  "...-": "v",
  ".--": "w",
  "-..-": "x",
  "-.--": "y",
  "--..": "z",
  "/": " ",
};

function MorseToAlpha() {
  //document.A_Form.alpha.value = "";
  //document.getElementById("A_Form").reset();

  morse = document.M_Form.morse.value;

  code_array = morse.split(" ");

  for (let i = 0; i < code_array.length; i++) {
    if (dictionary_B[code_array[i]]) {
      translated_morse += dictionary_B[code_array[i]];
    }
  }

  console.log(translated_morse);
  document.getElementById("alpha").value = translated_morse.trim();
  translated_morse = "";
}

function AlphaToMorse() {
  //document.getElementById("alpha").reset();
  text = document.A_Form.alpha.value.toUpperCase();
  //document.getElementById("morse").textContent = "";
  for (let char of text) {
    if (dictionary_A[char]) {
      translation_string += dictionary_A[char] + " ";
    }
  }
  console.log(translation_string);
  document.getElementById("morse").value = translation_string.trim();
  translation_string = "";
}

function generate_audio() {
  console.log(slider_wpm.value);
  var unit = 60000/(50*slider_wpm.value);
  console.log(unit);
  var delay = 0;
  const synth = new Tone.Synth().toDestination();
  const oscillator = new Tone.Oscillator(440, 'sine'); //for the sound

  const now = Tone.now(); //starts a time tracker

  function sound_creator(tone_length) {
    //sound creation

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, tone_length);
    console.log("goes to function");
  }

  morse = document.M_Form.morse.value;

  sign_array = morse.split(""); //creates an array with all signs and spaces
  
  for (let i = 0; i < sign_array.length; i++) {
    if (sign_array[i] == ".") {
      sound_creator(unit);
      delay += 2 * unit;
      console.log(delay);
    } else if (sign_array[i] == "-") {
      sound_creator(3 * unit);
      delay += 4 * unit;
      console.log("yeah");

      //add one pause_length unit
    } else if (sign_array[i] == " ") {
      if (sign_array[i + 1] == "/" || sign_array[i - 1] == "/") {
        //do nothing
      } else {
        delay += 2 * unit;
      }
    } else if (sign_array[i] == "/") {
      delay += 6 * unit;
    }
  }
}
