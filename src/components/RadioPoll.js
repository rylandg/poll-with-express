import '@reshuffle/code-transform/macro';

import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import '../styles/RadioPoll.css';

import CompletedPollChoice from './CompletedPollChoice';

import { addVotesToBackend } from '../../backend/poll';

/**
 * Given a set of choices and respective votes,
 * choose a winner based on which choice received the most votes.
 */
function getWinningChoice(votes) {
  // iterate over all vote options and their respective vote counts
  // to determine the choice which received the most votes
  let currMax = -1, currWinner = '';
  Object.keys(votes).forEach((voteKey) => {
    const isBigger = votes[voteKey] >= currMax;
    currMax = isBigger ? votes[voteKey] : currMax;
    currWinner = isBigger ? voteKey : currWinner;
  });
  return currWinner;
}

/**
 * Class that groups an arbitrary number of radio options that
 * users may choose between. RadioPoll allows a maximum of 1 selection,
 * so selecting new options when one is already chosen will deselect it.
 * Furthermore, the submit button is only available when an (any) option
 * is chosen.
 */
export default class RadioPoll extends Component {
  /**
   * Create a RadioPoll.
   */
  constructor(props) {
    super(props);
    // defines initial state for the RadioPoll which is used to
    // determine if a specific user has already voted, or if
    // they are eligible to vote
    this.state = {
      hasVoted: false,
      submitValid: false,
      // add some internal properties to the incoming choices
      choices: props.choices.map((choice) => {
        return { label: choice, checked: false };
      }),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
  }

  /**
   * Handles the "submit" button being clicked. The submit
   * button is part of the Radio form and allows users to
   * confirm a previously selected choice.
   */
  async handleSubmit(e) {
    // since we use 'await' it's absolutely crucial that we preventDefault
    // as the first call in this method
    e.preventDefault();

    // @BACKEND
    // update the backend with the users single vote, then store
    // the response as it represents the global vote state
    //
    // Note: This operation has the potential to fail, and a more
    // robust design would include error handling for that case.
    const votes = await addVotesToBackend(this.state.choices);

    // calculate the total number of votes based on individual votes
    // provided by the backend
    const totalVotes = Object.keys(votes).reduce((aggr, curr) => aggr + votes[curr], 0);

    // calculate the winner based on backend votes
    const winningChoice = getWinningChoice(votes, totalVotes);

    // update this components state to reflect the vote tallies
    this.setState((prevState) => {
      const newChoices = prevState.choices.map((choice) => {
        const extraInfo = {
          isWinner: choice.label === winningChoice,
          percentVote: (votes[choice.label] / totalVotes) * 100,
          votes: votes[choice.label],
        };
        return { ...choice, ...extraInfo }
      });

      // set the nextState to be the prevState + global votes and a flag
      // indicating that the current user has already voted
      return { ...prevState, choices: newChoices, votes, hasVoted: true };
    });
  }

  /**
   * Handles a radio selection on this components form. Only a single
   * selection is valid at a time.
   */
  handleRadio(e) {
    // represents the radio that is selected
    const targetId = e.currentTarget.id;
    this.setState((prevState) => {
      const newChoices = prevState.choices.map((choice) => {
        // if the radio has the same Id as our choice, it means
        // the user is currently selecting it
        choice.checked = (targetId === choice.label);
        return choice;
      });
      // the pre-requisite to submit a vote is having any of the available
      // options selected
      return { ...prevState, choies: newChoices, submitValid: true }
    });
  }

  render() {
    return (
      // if the user has already voted, we display the results component,
      // otherwise we display the traditional voting screen
      this.state.hasVoted ?
      <Form onSubmit={this.handleSubmit} className='pollForm'>
        {
          this.state.choices.map((choice) => {
            return (
              // displays the percentage of votes for respective choices
              <CompletedPollChoice key={choice.label}
                                   percentVote={choice.percentVote}
                                   isWinner={choice.isWinner}
                                   isSelected={choice.checked}
                                   choice={{ text: choice.label }}
              />
            )
          })
        }
      </Form>
      :
      <Form onSubmit={this.handleSubmit} className='pollForm'>
        {
          this.state.choices.map((choice) => (
            <div key={choice.label} className="mb-2">
              <Form.Check type='radio' >
                <Form.Check.Input id={choice.label}
                                  type='radio'
                                  checked={choice.checked}
                                  onChange={this.handleRadio}
                                  isValid
                />
                <Form.Check.Label className='text-dark'>
                  {choice.label}
                </Form.Check.Label>
              </Form.Check>
            </div>
          ))
        }
        <Button type="submit"
                className='pollSubmit'
                disabled={!this.state.submitValid}>
          {this.props.submitText}
        </Button>
      </Form>
    );
  }
}
