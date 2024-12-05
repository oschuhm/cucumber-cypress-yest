// Copyright 2024 oschuhmacher
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Then, When, Before} from "@badeball/cypress-cucumber-preprocessor"; 

Before(function () {
    cy.visit('https://effelenne.ch/JS-Werkstatt/w-calculator/calculator.html');    
})

When('ich drücke Taste {string}', input => {
    
    for (let i = 0; i < input.length; i++) {
        let taste = input.charAt(i);

        if(taste == '+' ) {taste = ' + '}
        else if (taste == '*' ) {taste = ' * '}
        else if (taste == '-' ) {taste = ' - '}
        cy.get(`[onclick="display.value += '${taste}';"]`).click();

      }
    
});


Then('ich prüfe ob das Ergebnis {string} ist', ergebnis => {
    cy.get('[onclick="display.value = eval(display.value);"]').click();
    cy.get('#display').should('have.value', ergebnis);
})