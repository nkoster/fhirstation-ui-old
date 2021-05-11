/// <reference types="cypress" />

const DEMO = true

describe('FHIR Station', () => {

  context('Test UI', () => {

    beforeEach(() => {
      cy.visit('https://ui.fhirstation.net', {
        auth: {
          username: 'niels',
          password: 'apekop',
        }
      })
      DEMO && cy.wait(1000)
    })

    it('Perform a full UI walk', () => {
      cy.get('input').first().click().get('li').last().prev().prev().click()
      DEMO && cy.wait(1000)
      cy.get('input').first().should('have.value', 'fhir3.databus.portavita.pvt_amstelveen.practitioner')
      DEMO && cy.wait(1000)
      cy.get('label').contains('Identifier Value')
      .next().children().first().type('fleurke')
      cy.contains('"Fleurke, AM"').click()
      DEMO && cy.wait(1000)
      cy.contains('199078').click()
      DEMO && cy.wait(1000)
      cy.contains('1978-11-07').should('be.visible')
      DEMO && cy.wait(1000)
      cy.get('svg').last().click()
      DEMO && cy.wait(1000)
      cy.contains('1954-10-19').should('be.visible')
      DEMO && cy.wait(1000)
      cy.get('svg').first().click()
      DEMO && cy.wait(1000)
      cy.contains('"Fleurke, AM"').should('be.visible')
    })

  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err, runnable)
    return false
  })

})
