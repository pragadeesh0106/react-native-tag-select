import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Button
} from 'react-native';

import TagSelectItem from './TagSelectItem';

class TagSelect extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    labelAttr: PropTypes.string,
    keyAttr: PropTypes.string,
    data: PropTypes.array,
    max: PropTypes.number,
    onMaxError: PropTypes.func,
    onItemPress: PropTypes.func,
    setPropData: PropTypes.func,
    itemStyle: PropTypes.any,
    itemStyleSelected: PropTypes.any,
    itemLabelStyle: PropTypes.any,
    itemLabelStyleSelected: PropTypes.any,
  };

  static defaultProps = {
    value: [],
    labelAttr: 'label',
    keyAttr: 'id',
    data: [],
    max: null,
    onMaxError: null,
    onItemPress: null,
    itemStyle: {},
    itemStyleSelected: {},
    itemLabelStyle: {},
    itemLabelStyleSelected: {},
  };

  state = {
    value: {},
  };

  componentWillMount() {
    if (this.props.value && this.props.value.length > 0) {
      // Pre-render values selected by default
      const value = {};
      this.props.value.forEach((v) => {
        value[v[[this.props.keyAttr]]] = v;
      });

      this.setState({ value });
    }
    this.setState({ data: this.props.data });
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.data && nextProps.data.length > 0) {
  //     this.setState({ data: nextProps.data });
  //   }
  // }

  /**
   * @description return total of itens selected
   * @return {Number}
   */
  get totalSelected() {
    return Object.keys(this.state.value).length;
  }

  /**
   * @description return itens selected
   * @return {Array}
   */
  get itemsSelected() {
    const items = [];

    Object.entries(this.state.value).forEach(([key]) => {
      items.push(this.state.value[key]);
    });

    return items;
  }

  /**
   * @description callback after select an item
   * @param {Object} item
   * @return {Void}
   */
  handleSelectItem = (item, callClose) => {
    const value = { ...this.state.value };
    const found = this.state.value[item[this.props.keyAttr]];
    if (callClose) {
      this.handleClose(item);
    }
    // Item is on array, so user is removing the selection
    if (found) {
      delete value[item[this.props.keyAttr]];
    } else {
      // User is adding but has reached the max number permitted
      if (this.props.max && this.totalSelected >= this.props.max) {
        return this.props.onMaxError();
      }

      value[item[this.props.keyAttr]] = item;
    }
    if (this.props.onItemPress) {
      this.props.onItemPress(item);
    }
    return this.setState({ value });
  };

  handleClose = (item) => {
    const removeId = item.id;

    // Item is on array, so user is removing the selection
    if (removeId) {
      const newData = this.state.data.filter(data => data.id != removeId)
      this.props.setPropData(newData);
      this.setState({
        data: newData
      })
    }
  };

  render() {
    return (
      <View style={styles.list}>
        {this.state.data && this.state.data.length > 0 ? this.state.data.map((i) => {
          return (
            <TagSelectItem
              {...this.props}
              label={i[this.props.labelAttr]}
              key={i[this.props.keyAttr]}
              onPress={this.handleSelectItem.bind(this, i, true)}
              selected={this.state.value[i[this.props.keyAttr]] && true}
              onClose={this.handleClose.bind(this, i)}
            />
          );
        }) : <View />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

export default TagSelect;
