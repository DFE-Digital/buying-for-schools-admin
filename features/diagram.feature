Feature: Diagram
  Scenario: Diagram display
    Given user is on page /diagram
    When the option /type/buying/what/furniture is clicked
    Then the option editor form should be displayed
    And the form has these fields
      | Slug          | text    |
      | Title         | text    |
      | Hint          | text    |
      | Next question | select  |
      | Framework     | select  |

  Scenario: Remove framework from the option
    Given user is on page /diagram
    When the option /type/buying/what/furniture is clicked
    And the remove framework 1 button is pressed
    And the save button is pressed
    And the back button is pressed
    Then the option editor form should not be displayed