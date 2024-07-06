# rn-country-phone-picker

It's an international phone input with country selection and phone mask for React Native.

![](mgif.gif)

## New Version Information

This package is a fork of the original `react-native-intl-phone-input` with several modifications and improvements. We've made changes to enhance functionality, improve performance, and add new features. As a result, we're continuing with a new version under this new package name.

Key changes include:
- [List your key changes/improvements here]
- [For example: Improved country selection UI]
- [Added support for custom styling]
- [Enhanced phone number validation]

## Installation

Install the package via npm:

```
npm install rn-country-phone-picker
```

## Usage

Import the component:

```javascript
import CountryPhonePicker from 'rn-country-phone-picker';
```

Use the component:

```javascript
onChangeText = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
  console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
};

render() {
  return (
    <SafeAreaView>
      <CountryPhonePicker 
        onChangeText={this.onChangeText} 
        defaultCountry="TR" 
        renderAction={() => <Text>XX</Text>} 
      />
    </SafeAreaView>
  );
}
```

## Custom Modal Example

```javascript
renderCustomModal = (modalVisible, countries, onCountryChange) => (
  <Modal visible={modalVisible}>
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View>
          <TextInput placeholder="Search" />
          <Text>🔍</Text>
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={countries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={() => onCountryChange(item.code)}>
              <Text>{item['your language code here for example tr']}</Text>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
      <TouchableOpacity onPress={() => this.phoneInput.hideModal()}>
        <Text>CLOSE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </Modal>
)

render() {
  return (
    <CountryPhonePicker
      ref={(ref) => this.phoneInput = ref}
      customModal={this.renderCustomModal}
      defaultCountry="TR"
      lang="TR"
    />
  );
}
```

## Supported Languages

| Code | Language |
|------|----------|
| TR   | Turkish  |
| LT   | Lithuanian |
| EN   | English  |
| RU   | Russian  |

## Props

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| lang | String | | Translate country name on modal |
| placeholder | String | | Phone input placeholder |
| defaultCountry | String | TR | Default country code |
| mask | String | | Custom mask for phone number |
| onChangeText | Function | | Callback when input text changes |
| customModal | Function | | Generate custom modal for country selection |
| phoneInputStyle | Style | | Style for the phone input TextInput |
| containerStyle | Style | | Style for the container |
| dialCodeTextStyle | Style | | Style for the dial code text |
| flagStyle | Style | | Style for the country flag |
| modalContainer | Style | | Style for the modal's SafeAreaView |
| filterInputStyle | Style | | Style for the filter input in modal |
| closeButtonStyle | Style | | Style for the close button text |
| modalCountryItemCountryNameStyle | Style | | Style for country names in modal |
| filterText | String | Filter | Placeholder text for filter input |
| closeText | String | CLOSE | Text for close button |
| disableCountryChange | Boolean | false | Disable country selection |
| renderAction | Function | | Render component to the right of phone input |
| placeholderTextColor | String | black | Color for placeholder text |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.