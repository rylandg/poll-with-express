import React from 'react';

import '../styles/CompletedPollChoice.css';

/**
 * Displays a poll choice that has already been voted on.
 */
export default function CompletedPollChoice({ percentVote, isWinner, choice }) {
  return (
    <div className="cvPollChoice">
      <span className="cvPollChoiceDetails">
        <span className="cvChoicePercentage">
          {
            // simple rounding to make percentages look nicer
          }
          {Math.round(percentVote * 10) / 10}%
        </span>
        <span className="cvChoiceText">
          {choice.text}
        </span>
      </span>
      {
        // if a choice is the winner, use special styling
      }
      <span className={isWinner ? 'cvChoicePercentChart winner': 'cvChoicePercentChart'}
            style={{ width: percentVote + '%' }}>
      </span>
    </div>
  );
}
