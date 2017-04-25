/* eslint-env mocha */
import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import nock from 'nock'
import expect from 'expect.js'
import { mount } from 'enzyme'
import App from '../src/components/app'
import GameInfo, { OkButton } from '../src/components/infoMessage'
import Deck from '../src/components/deckComponent'
import * as messages from '../src/components/playerMessages'

describe('<App /> ', () => {
  let app, prompt, action
  beforeEach(() => {
    app = mount(<App />)
    prompt = app.find(GameInfo).props().text
    action = app.find(GameInfo).props().onConfirm
  })
  describe('when cutting for the first crib', () => {
    it('should start by prompting for first crib cut', () => {
      const hasFirstCut = () => app.find(Deck).props().hasFirstCut
      expect(hasFirstCut()).to.be.false
      expect(prompt).to.be(messages.CUT_FOR_FIRST_CRIB_1)
      app.find(OkButton).simulate('click')
      expect(hasFirstCut()).to.be.true
    })
    it('should prompt for second crib cut, if opponent cuts first', () => {
      window.setTestState({
        firstCut: 'D3'
      })
      prompt = app.find(GameInfo).props().text
      expect(prompt).to.be(messages.CUT_FOR_FIRST_CRIB_2)
    })
  })
})