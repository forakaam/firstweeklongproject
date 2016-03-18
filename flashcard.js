$('document').ready(function() {
var $cardFront = $('.card-front');
var $cardBack = $('.card-back');
var $flip = $('.btn-default');
var $go  = $('.btn-primary');
var $select = $('select');
var deck = [];
var randomCard;

$go.click(checkDifficulty);
$flip.click(flipCard);

buildDeck();

function buildDeck(){
  for (var i = 1; localStorage.getItem('card' + i) !== null; i++){
    deck.push(JSON.parse(localStorage.getItem('card' + i)));
  }
  if (deck.length === 0){
    $cardFront.html('<h2>You have no words to display</h2>');
    disable($select, $go, $flip);
  }
  else {
    newCard();
  }
}
function newCard(){
  disable($select, $go);
  switchClasses($cardFront, $cardBack, 'revealed', 'concealed');
  if (deck.length === 0){
    disable($flip);
    $cardFront.html('<h2>You have no words left to display</h2>');
  }
  else {
    enable($flip);
    randomCard = Math.floor(Math.random() * deck.length);
    $cardFront.html('<h2>' + deck[randomCard][0]+ '</h2>');
    $cardBack.html('<h2>' + deck[randomCard][1]+ '</h2>');
  }
}
function flipCard(){
  switchClasses($cardFront, $cardBack, 'concealed', 'revealed');
  enable($select, $go);
  disable($flip);
}
function checkDifficulty(){
  if ($select.val() === 'easy'){
    deck.splice(randomCard, 1);
  }
  newCard();
}
});
function disable(){
  Array.prototype.forEach.call(arguments, function(el) {
  el.prop('disabled', true);
});
}
function enable(){
  Array.prototype.forEach.call(arguments, function(el) {
  el.prop('disabled', false);
});
}
function switchClasses(first,second, class1, class2){
  first.addClass(class1);
  second.removeClass(class1);
  first.removeClass(class2);
  second.addClass(class2);
}

