import React from 'react';

import Poll  from './components/Poll';

// text displayed on poll submit button
const submitText = 'submit';

// question that will be asked at the top of the poll
const pollQuestion = 'What is your favorite flavor?';

// list of choices that poll recipients can pick as an answer
// to the poll question
const choices = [
  'Vanilla',
  'Chocolate',
  'Strawberry',
  'Neopolitan',
];

function App() {
  return (
    <Poll choices={choices} submitText={submitText} pollQuestion={pollQuestion} />
  );
}

export default App;
