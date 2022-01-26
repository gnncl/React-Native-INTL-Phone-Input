import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import data from './Countries';

export default class IntlPhoneInput extends React.Component {
  constructor(props) {
    super(props);
    const defaultCountry = data.filter((obj) => obj.code === props.defaultCountry)[0] || {};

    this.state = {
      defaultCountry,
      flag: defaultCountry.flag,
      modalVisible: false,
      dialCode: defaultCountry.dialCode,
      phoneNumber: '',
      mask: props.mask || defaultCountry.mask,
      countryData: data,
      selectedCountry: defaultCountry,
      placeholderTextColor: 'grey'
    };
  }

  onChangePropText=(unmaskedPhoneNumber, phoneNumber) => {
    const { dialCode, mask, selectedCountry } = this.state;

    const countOfNumber = mask.match(/9/g).length;
    if (this.props.onChangeText) {
      const isVerified = countOfNumber === unmaskedPhoneNumber?.length && phoneNumber?.length > 0;
      this.props.onChangeText({
        dialCode, unmaskedPhoneNumber, phoneNumber, isVerified, selectedCountry
      });
    }
  }

  onChangeText = async (value) => {
    let unmaskedPhoneNumber = (value.match(/\d+/g) || []).join('');

    const countryData = await data;
    const defaultCountry = countryData.filter((obj) => obj.code === this.props.defaultCountry)[0] || {};

    this.setState({
      mask: defaultCountry.mask
    });

    if (unmaskedPhoneNumber.length === 0) {
      this.setState({ phoneNumber: '' });
      this.onChangePropText('', '');
      return;
    }

    let phoneNumber = this.state.mask.replace(/9/g, '_');
    for (let index = 0; index < unmaskedPhoneNumber.length; index += 1) {
      phoneNumber = phoneNumber.replace('_', unmaskedPhoneNumber[index]);
    }
    let numberPointer = 0;
    for (let index = phoneNumber.length; index > 0; index -= 1) {
      if (phoneNumber[index] !== ' ' && !isNaN(phoneNumber[index])) {
        numberPointer = index;
        break;
      }
    }
    phoneNumber = phoneNumber.slice(0, numberPointer + 1);
    unmaskedPhoneNumber = (phoneNumber.match(/\d+/g) || []).join('');

    this.onChangePropText(unmaskedPhoneNumber, phoneNumber);
    this.setState({ phoneNumber });
  }

  showModal = () => (this.props.disableCountryChange ? null : this.setState({ modalVisible: true }));

  hideModal = () => this.setState({ modalVisible: false });

  onCountryChange = async (code) => {
    this.hideModal();

    const countryData = await data;

    try {
      const country = countryData.filter((obj) => obj.code === code)[0];

      this.setState({
        dialCode: country.dialCode,
        flag: country.flag,
        mask: this.props.mask || country.mask,
        phoneNumber: '',
        selectedCountry: country,
        countryData
      });

      if (this.props.onSelectCountry) {
        this.props.onSelectCountry(country);
      }
    } catch (err) {
      const defaultCountry = this.state.defaultCountry;
      this.setState({
        dialCode: defaultCountry.dialCode,
        flag: defaultCountry.flag,
        mask: this.props.mask || defaultCountry.mask,
        phoneNumber: '',
        selectedCountry:defaultCountry,
        countryData
      });

      if (this.props.onSelectCountry) {
        this.props.onSelectCountry(defaultCountry);
      }
    }
  }

  filterCountries = async (value) => {
    const { lang } = this.props;

    const countryData = await data;

    const filteredCountry = countryData.filter((obj) => (obj[lang?.toLowerCase() || 'en']?.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1) || obj.code.indexOf(value.toUpperCase()) > -1);

    this.setState({ countryData: filteredCountry });
  }

  focus() {
    this.props.inputRef.current.focus();
  }

  renderModal=() => {
    if (this.props.customModal) return this.props.customModal(this.state.modalVisible,this.state.countryData,this.onCountryChange);
    const {
      countryModalStyle,
      modalContainer,
      modalFlagStyle,
      filterInputStyle,
      modalCountryItemCountryNameStyle,
      modalCountryItemCountryDialCodeStyle,
      closeText,
      filterText,
      searchIconStyle,
      closeButtonStyle,
      lang,
      placeholderTextColor
    } = this.props;
    return (
      <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.modalContainer, modalContainer]}>
            <View style={styles.filterInputStyleContainer}>
              <TextInput autoCapitalize="words" onChangeText={this.filterCountries} placeholder={filterText || 'Filter'} style={[styles.filterInputStyle, filterInputStyle]} placeholderTextColor={placeholderTextColor }/>
              <Text style={[styles.searchIconStyle, searchIconStyle]}>🔍</Text>
            </View>
            <FlatList
              style={{ flex: 1 }}
              data={this.state.countryData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={
                ({ item }) => (
                  <TouchableOpacity onPress={() => this.onCountryChange(item.code)}>
                    <View style={[styles.countryModalStyle, countryModalStyle]}>
                      <Text style={[styles.modalFlagStyle, modalFlagStyle]}>{item.flag}</Text>
                      <View style={styles.modalCountryItemContainer}>
                        <Text style={[styles.modalCountryItemCountryNameStyle, modalCountryItemCountryNameStyle]}>{(item[lang?.toLowerCase()] || item['en'])}</Text>
                        <Text style={[styles.modalCountryItemCountryDialCodeStyle, modalCountryItemCountryDialCodeStyle]}>{`  ${item.dialCode}`}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }
            />
          </View>
          <TouchableOpacity onPress={() => this.hideModal()} style={[styles.closeButtonStyle, closeButtonStyle]}>
            <Text style={styles.closeTextStyle}>{closeText || 'CLOSE'}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    );
  }

  renderAction=()=>{
    const renderAction=this.props.renderAction;
    if(renderAction) {
      console.log("action",renderAction);
      if(typeof renderAction!=="function") throw ("The renderAction is not a function. Please set a renderAction function on there");
      else return this.props.renderAction();
    }
    return null;
  }

  render() {
    const { flag } = this.state;
    const {
      containerStyle,
      flagStyle,
      phoneInputStyle,
      dialCodeTextStyle,
      inputProps,
      placeholderTextColor,
      placeholder,
      showCountryBox,
      showInput,
      value
    } = this.props;

    return (
      <View>
        {
          showCountryBox &&
          <TouchableOpacity style={{ ...containerStyle }} onPress={() => this.showModal()}>
            <View style={styles.openDialogView}>
              {!!!(flag && this.state.dialCode) && <TextInput style={[phoneInputStyle]} editable={false} placeholder={placeholder}/>}
              <Text style={[styles.flagStyle, flagStyle]}>{flag}</Text>
              <Text style={[styles.dialCodeTextStyle, dialCodeTextStyle]}>{this.state.dialCode}</Text>
            </View>
          </TouchableOpacity>
        }
        {showCountryBox && this.renderModal()}
        {
          showInput &&
          <TextInput
            style={[phoneInputStyle]}
            placeholder={placeholder || this.state.mask.replace(/9/g, '_')}
            autoCorrect={false}
            keyboardType="number-pad"
            secureTextEntry={false}
            value={value}
            // value={this.state.phoneNumber}
            onChangeText={this.onChangeText}
            placeholderTextColor={placeholderTextColor}
            {...inputProps}
          />
        }
        {this.renderAction()}
      </View>
    );
  }
}

IntlPhoneInput.propTypes = {
  lang: PropTypes.string,
  defaultCountry: PropTypes.string,
  mask: PropTypes.string,
  showCountryBox: PropTypes.bool,
  showInput: PropTypes.bool,
  inputProps: PropTypes.object, // {}
  onSelectCountry: PropTypes.func,
  onChangeText: PropTypes.func,
  customModal: PropTypes.func,
  phoneInputStyle: PropTypes.object, // {}
  containerStyle: PropTypes.object, // {}
  dialCodeTextStyle: PropTypes.object, // {}
  flagStyle: PropTypes.object, // {}
  modalContainer: PropTypes.object, // {}
  filterInputStyle: PropTypes.object, // {}
  closeButtonStyle: PropTypes.object, // {}
  modalCountryItemCountryNameStyle: PropTypes.object, // {}
  filterText: PropTypes.string,
  closeText: PropTypes.string,
  searchIconStyle: PropTypes.object,
  disableCountryChange: PropTypes.bool,
  inputRef: PropTypes.object,
  placeholderTextColor: PropTypes.string
};

const styles = StyleSheet.create({
  closeTextStyle: {
    padding: 5,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  modalCountryItemCountryDialCodeStyle: {
    fontSize: 15
  },
  modalCountryItemCountryNameStyle: {
    flex: 1,
    fontSize: 15
  },
  modalCountryItemContainer: {
    flex: 1,
    paddingLeft: 5,
    flexDirection: 'row'
  },
  modalFlagStyle: {
    fontSize: 25,
  },
  modalContainer: {
    paddingTop: 15,
    paddingLeft: 25,
    paddingRight: 25,
    flex: 10,
    backgroundColor: 'white'
  },
  flagStyle: {
    fontSize: 35,
  },
  dialCodeTextStyle: {
  },
  countryModalStyle: {
    flex: 1,
    // borderColor: 'green',
    // borderTopWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  openDialogView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterInputStyle: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchIcon: {
    padding: 10,
  },
  filterInputStyleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInputStyle: {
    marginLeft: 5,
    flex: 1
  },
  container: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center'
  },
  searchIconStyle: {
    color: 'black',
    fontSize: 15,
    marginLeft: 15
  },
  buttonStyle: {
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  countryStyle: {
    flex: 1,
    borderColor: 'black',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    padding: 12,
    alignItems: 'center',
  }
});
