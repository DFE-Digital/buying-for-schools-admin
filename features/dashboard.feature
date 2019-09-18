Feature: Dashboard
  Scenario: Dashboard display
    Given user is on page /
    Then the service displays the following page content
      | Heading | Dashboard |
      | Subheading | Framework expiry |
    And show framework expiry table
    And have links
      | Publish options | /structure |