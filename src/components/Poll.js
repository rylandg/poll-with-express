import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import '../styles/Poll.css';

import RadioPoll  from './RadioPoll';

/**
 * Reusable poll component. Using the choices and questions provided
 * by the user, creates a end-to-end poll that allows users to vote
 * and subsequently see the current votes in the poll.
 */
export default function Poll({ choices, pollQuestion, submitText }) {
  return (
    // 'd-flex' - flexbox for bootstrap 4
    // 'justify-content-center' - center content vertically in Jumbotron
    // 'align-items-center' - center content horizontally in Jumbotron
    <Jumbotron className="highLevel d-flex justify-content-center align-items-center">
      <Jumbotron className="pollHolder">
        <h3>{pollQuestion}</h3>
        <RadioPoll choices={choices}
                   pollQuestion={pollQuestion}
                   submitText={submitText}>
        </RadioPoll>
      </Jumbotron>
    </Jumbotron>
  );
}
