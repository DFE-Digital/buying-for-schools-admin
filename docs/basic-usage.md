# ADMIN APP #

A basic tutorial to change the text and settings of a decision tree option.

## Changing a decision tree option ##

### Make the change in the admin app ###

In the admin app [Temporary location here](https://s107t01-webapp-admin-01.azurewebsites.net)

- Click the diagram tab
- Click the option (dotted outline) you'd like to change
- The option edit window will appear
- To change the fields as required:
  - `Slug`: a part of the url that will be used to build the url path through the decision tree must be unique
  - `Title`: the option text
  - `Hint`: Extra descriptive text shown in grey as per GDS styles.
  - `Next question`: Every option either links to another question or displays framework/s recommended
  - `Results, Framework`: These are the framework/s that will be displayed.
  - IF `Results` is locked set `Next question` to `...`
  - IF `Next question` is locked remove all frameworks from the `Results` section
- The `Save` button will turn green when there are changes that need saving
- Click `Save`
- Click `Back`
- The Diagram should now reflect the changes you made to the option


### Check the changes in staging/test ###

[Preview changes here](https://s107t01-webapp-02.azurewebsites.net/) and ensure that the change you made is showing here.

- Use this URL to gain signoff on the changes
- `DRAFT` will be displayed in the top left corner of the site reminding you that this is the test area


### Publish changes to live ###

In the admin app [Temporary location here](https://s107t01-webapp-admin-01.azurewebsites.net)

- Click the `Dashboard` tab
- Click the `Publish options` button
- Click the green `Publich changes` button
- Think of the title field here as a *Save as* type function, the title can help identify the new changes about to go live
- Click the red `Publish` button, this is the final operation in making the changes live.


### Check the new changes are actually live ###

[Pretend this would be live](https://s107p01-webapp-02.azurewebsites.net/) and verify changes are present.


## Changing a question ##

Changing a question is very similar to the above for an option.

- Click the diagram tab
- Click the question (pale grey boxes) you'd like to change
- The question edit window will appear
- Change the fields as required:
  - `Slug` or `Ref`: a part of the url that will be used to build the url path through the decision tree must be unique
  - `Title`: the question text
  - `Hint`: Extra descriptive text shown in grey as per GDS styles.
  - `Error`: The specific error text you'd like displayed if the user attempts to submit the form without choosing one of the supplied options.
  - `Suffix template`: This is only used (currently) for the `Help with meter types` info displayed on the Electricity pages, it's possible in future that more extra info templates may be coded into the system, it's not something that can be done in the admin tool.
  - You can add/remove options here
- The `Save` button will turn green when there are changes that need saving
- Click `Save`
- Click `Back`
- The Diagram should now reflect the changes you made to the question

## Adding an option to a question from the diagram view ##

Directly below the question before the diagram branches into the options there is a pale green button with a plus symbol in it, this can be used as a shortcut to add an option to the decision tree.


## Adding/altering a framework ##

- Go to the `Frameworks` tab
- Select the framework to be edited OR click the `New Framework` button at the bottom of the page
- Change the fields as required:
  - `Slug`: a part of the url that will be used to build the url path through the decision tree must be unique
  - `Title`: title of the framework
  - `Description`: this appears on the list page of frameworks
  - `Expiry`: Date the framework expires in the format `yyyy-mm-dd` eg `2019-12-25`
  - `URL`: The link to the provider's page detailing the framework
  - `Provider`: Who is providing this framework
  - `Category`: Used to sort the frameworks on the list page
  - `Body`: In markdown format the main content of the framework eg Offers and Benefits lists.
  - `Associated links`: These appear in the right hand column next to the framework content and can be links to other useful resources
- Click `Save`
- Click `Back`

