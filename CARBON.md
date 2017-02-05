
- [ ] Expanding
- [ ] Raised card
- [ ] usage docs
- [ ] Auto tests
- [ ] Test on ios emulator

*Questions to Tucker*
- [ ] Font properties (like family) won't propagate to nested <Text> components.
How is carbon-ui dealing with that? shall I create a sharable <MyText> which
wraps <Text> and adds default Roboto font?
Or, instead of having specific font properties in CardTitle and CardText, spread
one of prepackaged Types and they include font size, family, height...etc

------------------
Carbon-ui issues
- [ ] Warning: Failed prop type: Invalid props.style key `fontFeatureSettings` supplied to `Text`.
https://github.com/necolas/react-native-web/issues/331