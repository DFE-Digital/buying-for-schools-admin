Feature: Management
  
  Background:
    Given the user is logged in

  Scenario: Management overview
    Given user is on page /structure
    Then the service displays the following page content
      | Heading | Management |
   And show structure table