$('document').ready(function() {

var $submit = $(':submit[value="Search"]');
var $input = $(':text');
var $radio = $(':radio');
var $translation = $('#translation');
var $translatedWord = $('#translatedWord');
var $button = $('.btn-primary');
var $nav = $('nav');
var $toggle = $('.dropdown-toggle');
var $dropdownmenu = $('.dropdown-menu');
var $li;
var $body = $('body');
var $textarea;
var $list = $('ul');
var $remover = $('#remover');
var key = 'trnsl.1.1.20160314T184936Z.9d3efbf317ea1f38.63421992b4a92e9f2dbc5d6867900d57a447cca9'; //will get from user
var langs = "ru-en";

var word;
var url;
var text;
var cardCount = 0;

cardCounter();

$body.dblclick(textSelector);

$radio.click(toggleLanguages);

$button.click(displayNewCard);

$submit.click(function(e){
  e.preventDefault();
  word = $input.val();
  wordLookup();
});
$remover.click(startRemoval);

function cardCounter(){
  for (var i = 1; localStorage.getItem("card" + i) !== null; i++){
    var currentCard = JSON.parse(localStorage.getItem("card" + i));
    $list.prepend('<li id="' + i +'">' + currentCard[0] + ": " + currentCard[1] + '</li>');
    cardCount++;
  }
  $li = $('li');
}
function textSelector() {
  text = window.getSelection().toString();
  $input.val(text);
  $translation.text('Translation: ');
  $translatedWord.text(text.charAt(0).toUpperCase() + text.slice(1));
}
function toggleLanguages(e) {
  if (e.target === $radio[1]) {
    langs = "en-ru";
  }
  else {
    langs ="ru-en";
  } 
}
function displayNewCard(){
  $('div > div > div').append('<textarea class="form-control" rows="3"></textarea>');
  $textarea = $('textarea');
  $textarea.val('Front: ' +  $translatedWord.text() + '\nBack: ' + $translation.text().replace("Translation: ", ""));
  $button.text('Submit');
  $button.off();
  $button.click(makeNewCard);
}
function makeNewCard(){
  var newCard = $textarea.val().replace(/Front: (.*\n)Back: /, '$1').split('\n');
  // if card for same word exists, update existing card
  var novelty = true;
  for (var i = 1; i <= cardCount; i++) {
    if (JSON.parse(localStorage.getItem("card" + i))[0] === newCard[0]){
      localStorage.setItem("card" + i, JSON.stringify(newCard));

      novelty = false;
    }
  }
  if (novelty) {
    cardCount++;
    localStorage.setItem("card" + (cardCount), JSON.stringify(newCard));
    $list.prepend('<li id="' + i +'">' + newCard[0] + ": " + newCard[1] + '</li>');
    $li = $('li');
  }
  $button.off();
  $textarea.remove();
  $button.text('Add to my word list');
  $button.click(displayNewCard);
}
function wordLookup() {
  url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&text=' + word + '&lang=' + langs; 
  $translatedWord.text(word.charAt(0).toUpperCase() + word.slice(1));
  $.get(url, function(data){
  $translation.text('Translation: ' + data.text);
  }); 
}
function startRemoval(e){
  
  $remover.off();
  $remover.click(endRemoval);
  $remover.text('Done');
  for (var i = 0; i < $li.length - 3; i++){
    $($li[i]).click(removeWord);
    $($li[i]).addClass('remove');
  }
  e.stopPropagation();
}
function removeWord(e) {
  for(var j = parseInt(e.target.id); localStorage.getItem("card" + j) !== null; j++){
        $('#' + j).attr('id', j-1);
        localStorage.setItem("card" + (j -1), localStorage.getItem("card" + j));
  }
  localStorage.removeItem("card" + (j-1));
  cardCount--;
  e.target.remove();
  $li = $('li');
  e.stopPropagation();
}
function endRemoval(){
  $li.off(removeWord);
  $remover.text('Remove Words');
  $remover.off();
  $remover.click(startRemoval);
}
});

