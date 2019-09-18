Feature: Framework
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
    When the dialog button no is pressed
    Then the dialog should not be displayed

  Scenario: A new framework form is displayed
    Given user is on page /framework
    When the new framework button is pressed
    Then the framework editor form should be displayed
    And the form has these fields
      | Slug        | text      |
      | Title       | text      |
      | Description | textarea  |
      | Expiry      | text      |
      | URL         | text      |
      | Provider    | select    |
      | Category    | select    |
      | Body        | textarea  |

  Scenario: Create a new framework
    Given user is on page /framework/new
    Then the framework editor form should be displayed
    When the form is completed with
      | Slug        | bdd                                   |
      | Title       | Behaviour Driven Development          |
      | Description | How to use BDD in a testing process   |
      | Expiry      | 2099-12-01                            |
      | URL         | https://bdd.com                       |
      | Provider    | cpc                                   |
      | Category    | itc                                   |
      | Body        | ## BDD ## \n hello world              |
    And the save button is pressed
    Then the ict category of the framework list should contain
      | Active | bdd | Behaviour Driven Development | CPC | 01/12/2099 | 0 |



  