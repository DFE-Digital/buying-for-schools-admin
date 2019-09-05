Feature: Framework
  
  Background:
    Given the user is logged in

  Scenario: Framework overview
    Given user is on page /framework
    Then the service displays the following page content
      | Heading | Frameworks |
   And show framework table

  Scenario: Framework delete button is pressed
    Given user is on page /framework
    When a framework delete button is pressed
    Then a modal dialog should ask for confirmation
      | Heading | Delete framework |
      