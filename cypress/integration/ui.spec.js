/// <reference types="cypress" />

describe('FHIR Station', () => {

  context('Test UI', () => {

    beforeEach(() => {
      cy.visit('https://ui.fhirstation.net', {
        auth: {
          username: 'niels',
          password: 'apekop',
        }
      })
    })

    it('Perform a full UI walk', () => {
      cy.get('input').first().click().get('li').last().prev().prev().click()
      cy.get('input').first().should('have.value', 'fhir3.databus.portavita.pvt_amstelveen.practitioner')
      cy.get('label').contains('Identifier Value')
      .next().children().first().type('fleurke')
      cy.contains('"Fleurke, AM"').click()
      cy.contains('199078').click()
      cy.contains('1978-11-07').should('be.visible')
      cy.get('svg').last().click()
      cy.contains('1954-10-19').should('be.visible')
      cy.get('svg').first().click()
      cy.contains('"Fleurke, AM"').should('be.visible')
    })

  })

  Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err, runnable)
    return false
  })

})
