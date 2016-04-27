var _ = require('lodash');
var natural = require('natural');

var cachedFreqs = {};

function author(corpusString, maxWordCount, cacheId) {
  var nGramSize = 2;
  var freqs;
  if (!cacheId || !(cacheId in cachedFreqs)) {
      freqs = getFreqs(corpusString, nGramSize);
      if (cacheId) {
        cachedFreqs[cacheId] = freqs;
      }
  } else {
    freqs = cachedFreqs[cacheId];
  }
  var text = createRandomText(freqs, maxWordCount);
  return text;
}

function getFreqs(s, nGramSize) {
  var nGrams = natural.NGrams.ngrams(s, nGramSize);
  var freqs = {};
  if (nGrams) {
    _.forEach(nGrams, function(ng) {
      var key = JSON.stringify(ng.slice(0, -1));
      var value = ng[ng.length - 1];
      if (key in freqs) {
        var start = freqs[key];
        if (value in start) {
          freqs[key][value] += 1;
        } else {
          freqs[key][value] = 1;
        }
      } else {
        freqs[key] = {};
        freqs[key][value] = 1;
      }
    });
  }
  return freqs;
}

function createRandomText(freqs, wordCount) {
  var text = '';
  var nGram = JSON.parse(_.sample(_.keys(freqs)));
  var word = nGram.join(' ');

  text += word + ' ';
  for(var i = 0; i < wordCount - 1; i++) {
    word = getRandomWord(nGram, freqs);
    text += word + ' ';
    nGram.pop();
    nGram.push(word);
  }

  return text;
}

function getRandomWord(nGram, freqs) {
    var key = JSON.stringify(nGram);
    var values = _.keys(freqs[key]);
    var word = '';

    if (values.length > 0) {
      var totalFreq = _.reduce(values, function(tf, value) {
        tf += freqs[key][value];
        return tf;
      }, 0);
      if (totalFreq > 0) {
        var p = _.random(1, totalFreq);
        var foundValue = false;
        var i = -1;
        while(p > 0 && i < values.length - 1) {
          i++;
          p -= freqs[key][values[i]];
        }
        word = values[i];
        return word;
      }
    }

    // get a random word for a random nGram
    var randomNGramKey = _.sample(_.keys(freqs));
    word = _.sample(_.keys(freqs[randomNGramKey]));
    return word;
}

module.exports = {
  author: author,
  getRandomWord: getRandomWord,
  getFreqs: getFreqs,
  createRandomText: createRandomText
};
