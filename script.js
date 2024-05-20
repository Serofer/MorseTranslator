var translation_string = "";
var translated_morse = "";
let sign_array = [];



morse_field = document.getElementById("morse");
alpha_field = document.getElementById("alpha");

//slider information
var slider_wpm = document.getElementById("WPM");
var output_wpm = document.getElementById("WPM_value");
var output_word = document.getElementById("word_value");
var wpm = 30;

slider_wpm.value = 30;
output_wpm.innerHTML = slider_wpm.value;


//output_wpm.innerHTML = display_value(slider_wpm, output_wpm, wpm);



function display_value(slider, output, LENGTH_VALUE) {
  slider.oninput = function () {
    output.innerHTML = this.value;
    LENGTH_VALUE = slider.value;
  };
}

display_value(slider_wpm, output_wpm, wpm);
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
//translate Morse to normal
function MorseToAlpha() {
  translated_morse = "";
  morse = morse_field.textContent;
  code_array = morse.split(" ");
  for (let j = 0; j < code_array.length; j++) {
    if (dictionary_B[code_array[j]]) {
      translated_morse += dictionary_B[code_array[j]];
    }
  }
  console.log(translated_morse);
  alpha_field.innerHTML = translated_morse;
  translated_morse = "";
}
//translate normal to morse
function AlphaToMorse() {
  translation_string = "";
  text = alpha_field.textContent.toUpperCase();
  console.log(text);
  for (let char of text) {
    if (dictionary_A[char]) {
      translation_string += dictionary_A[char] + " ";
    }
  }
  console.log("Translation:" + translation_string);

  morse_field.innerHTML = translation_string;
  //document.getElementById("morse").value = translation_string.trim();
  translation_string = "";
}

//everything for the AUDIO ----------------------------------------------------------------------------------------------------------------
var index = 0;
var unit = 0;
var tone = unit;
var pause = unit;

var PlayPause = document.getElementById("play_pause");
var PLAY = true;
var current_situation = "loop";
//reset both fields
function reset_fields(){
  morse_field.innerHTML = "";
  alpha_field.innerHTML = "";
}
//mark the current position during audio

function mark(){
  console.log("marking");
  //new field with the mark function
  var text = "";

  for(let i=0;i<sign_array.length;i++){
    let toAdd = "";
    if(i==index && index != sign_array.length){
      toAdd = "<span id ='high'>" + sign_array[i]+ "</span>";
    }
    else {
      toAdd = "<span>"+sign_array[i] + "</span>";
    }
    text = text + toAdd;
  }

  morse_field.innerHTML = text;
}

//pause the audio
function pause_audio() {
  if(morse_field.textContent != ""){

    console.log("Audio should be paused");
    var play = "<button type='button' class='button' onclick='continue_audio()'> <span class='glyphicon glyphicon-play'></span> Play</button>";
    PlayPause.innerHTML = play;
    PLAY = false;
  }

}

function continue_audio() { //continue the staff: problem with the loop, initialize the current function with if statmentes would work.
  //console.log("continue AUDIO")
  var pause = "<button type='button' class='button' onclick='pause_audio()'> <span class='glyphicon glyphicon-pause'></span> Pause</button>";
  PlayPause.innerHTML = pause;
  PLAY = true;
  switch (current_situation) {
    case "loop":
      looping();
      break;
    case "production":
      sound_creator(tone,pause);
      break;
  }
}

function stop_audio(){
    PLAY = false;
    console.log("end");
    index=sign_array.length;
    mark();
    morse_field.contenteditable=true;
    play = "<button type='button' class='button' onclick='init_audio()'> <span class='glyphicon glyphicon-play'></span> Play</button>";
    PlayPause.innerHTML = play;
    
    

}

//creates the sound then runs the loop function to generate the next
//tests if the pause button is pressed.
function sound_creator(tone_length, pause_length) {
  mark();
  //console.log("in the creation");
  current_situation = "production";
  if(PLAY){
    //pause organisation
    //console.log("sound_generator");
    if (sign_array[index + 1] == " ") {
      index += 1; //skip the next part of the array (" ")
    }
    if (sign_array[index] == " " && sign_array[index + 1] == "/") {
      index += 2; //skipt the next three parts of the array (/, " ")
    }
    
    index++; //increase the value anyways to to to next position
    const oscillator = new Tone.Oscillator(600, "sine").toDestination();
    //sound creation
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, tone_length);

    if(index == sign_array.length){
        console.log("end");
        mark();
        morse_field.contenteditable=true;
        play = "<button type='button' class='button' onclick='init_audio()'> <span class='glyphicon glyphicon-play'></span> Play</button>";
        PlayPause.innerHTML = play;
    }
    else {
      setTimeout(() => {
        looping();
       
      }, tone_length + pause_length);
  

    }
    
  }
  
}

//initialization of audio
function init_audio() {
  if(morse_field.textContent != ""){ //before: document.M_Form.morse.value
    morse = morse_field.textContent;
    //morse = document.M_Form.morse.value;
    sign_array = morse.split("");
    morse_field.contenteditable = false;
    //console.log("initialized audio");
    index=0;
    PLAY = true;
    
    var pause = "<button type='button' class='button' onclick='pause_audio()'> <span class='glyphicon glyphicon-pause'></span> Pause</button>";
    PlayPause.innerHTML = pause;
    unit = 60000 / (50 * slider_wpm.value);
    console.log(slider_wpm.value);
    console.log(unit);
  
  
    //for the sound
    
    //const now = oscillator.now(); //starts a time
  
    //start the loop
    looping();

  }

}

//creates an array with all signs and spaces
function looping() {
  //console.log("in the algorithm");
  current_situation = "loop";
  if(PLAY){
    pause = unit;
    if (sign_array[index + 1] == " ") {
      pause = 3 * unit;
    }
    if (sign_array[index + 1] == " " && sign_array[index + 2] == "/") {
      pause = 7 * unit;
    }

    if (sign_array[index] == ".") {
      tone = unit;
    }
    if (sign_array[index] == "-") {
      tone = 3 * unit;

    //add one pause_length unit
    }
    if (sign_array[index] == "." || sign_array[index] == "-") {
      sound_creator(tone, pause);
    }
  }
}



//should produce an audio file to download via recorder.start() from Tone.js
function download_audio() {
  var sign_array = [];
    if(morse_field.textContent != "") {
        morse = morse_field.textContent;
        sign_array = morse.split("");
        console.log(sign_array);
    }
    //set variables to count the symbols in the morse code
    var dot_count = 0;
    var line_count = 0;
    var pause_count = 0;
    var word_count = 0;
    var sign_count = 0;

    var pause = false;
    
    for (let i = 0; i < sign_array.length; i++) {//count the symbols in the morse code
        if (sign_array[i] == ".") {
            dot_count++;
            sign_count++;
        } else if (sign_array[i] == "-") {
            line_count++;
            sign_count++;
        } else if (sign_array[i] == " " && sign_array[i + 1] != "/" && sign_array[i - 1] != "/") {
            pause_count++;
        } else if (sign_array[i] == "/") {
            word_count++;
        }
    }

    console.log(dot_count, line_count, pause_count, word_count);//works perfectly
    //self defined variables
    var unit = 0;
    var progress = 0;
    slider_value = slider_wpm.value;
    unit = 60000 / (50 * 1000 * slider_value);//time in milliseconds
    console.log(unit);


    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an audio buffer with a length enough to hold the sound
    const sampleRate = audioContext.sampleRate;//sampleRate = 1 second
    const beepLength = 3 * sampleRate;
    const real_unit = unit * sampleRate;
    console.log(real_unit);
    const short = real_unit;
    const long = 3 * real_unit;
    const sign_pause = real_unit;
    const short_pause = 3 * real_unit;
    const long_pause = 7 * real_unit;
    const breakLength = 2 * sampleRate; // 2 seconds
    

    const totalLength = (beepLength * 2) + breakLength;
    const TOTAL_LENGTH = (short * dot_count) + (long * line_count) + (short_pause * pause_count) + (long_pause * word_count) + (sign_pause * sign_count);//set the length of the buffer

    
    const buffer = audioContext.createBuffer(1, totalLength, sampleRate);
    const BUFFER = audioContext.createBuffer(1, TOTAL_LENGTH, sampleRate);
    const channelData = buffer.getChannelData(0);
    const CHANNEL_DATA = BUFFER.getChannelData(0);




    var sign_counter = 0;
    //Loop for every sign
    for (let i = 0; i < sign_array.length; i++) {

        var sign = 0;//set variable to declare soundlength to be added

        if (sign_array[i] == ".") {
            sign = short;
            pause = false;
        }
        if (sign_array[i] == "-") {
            sign = long;
            pause = false;
        }
        if (sign_array[i] == " " && sign_array[i + 1] != "/")  {
            sign = short_pause;
            pause = true;
            console.log("short pause");
        }
        if (sign_array[i] == " " && sign_array[i + 1] == "/")  {
            sign = long_pause;
            console.log("long pause");
            pause = true;
            i += 2;
       
        }
        
        if ((sign == short || sign == long) && !pause) {
            sign_counter++;
            for (let j = progress; j < (progress + sign); j++) {
             CHANNEL_DATA[j] = Math.sin(2 * Math.PI * 600 * j / sampleRate) 
            }
            progress = progress + sign + sign_pause;
        }

        else {
            progress += sign;
        }
        
    }
    
    // Convert the buffer to a WAV file
    const wav = audioBufferToWav(BUFFER);
    const blob = new Blob([wav], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'beep.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to convert an AudioBuffer to a WAV file
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferLength = buffer.length;
    const result = new ArrayBuffer(length);
    const view = new DataView(result);
    
    let channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write interleaved data
    for (i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < bufferLength) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][pos])); // clamp
            sample = (sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(offset, sample, true); // write 16-bit sample
            offset += 2;
        }
        pos++;
    }

    return result;

    function setUint16(data) {
        view.setUint16(offset, data, true);
        offset += 2;
    }

    function setUint32(data) {
        view.setUint32(offset, data, true);
        offset += 4;
    }


}


