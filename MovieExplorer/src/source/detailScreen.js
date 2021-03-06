import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Button,
  Alert,
  NetInfo
} from 'react-native';

class DetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    headerTintColor: '#fff',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
  });

  constructor() {
    super();
    this.state = {
      id: '',
      adult: '',
      backdrop_path: '',
      popularity: '',
      budget: '',
      title: '',
      original_language: '',
      vote_average: '',
      vote_count: '',
      tagline: '',
      runtime: '',
      release_date: '',
      revenue: '',
      isLoading: true,
      key: '',
      isOnline: null,
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    const id = navigation.getParam('id', 'NO-ID');
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().then(
      (isConnected) => { this.setState({ isOnline: isConnected }); if (isConnected) this.getKey(id); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = isConnected => {
    if (isConnected) {
      this.setState({ isOnline: true })
      this.getKey(this.state.id);
    }
    else
      this.setState({ isOnline: false })
  };

  alert() {
    Alert.alert(
      'Notification',
      'No internet connection!!!',
      [
        { text: 'OK'}
      ]
    )
  }

  getKey(id) {
    return fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=f7485fa464693c4a4b1b3e4b580e4d40&append_to_response=videos')
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.videos.results.length != 0)
          if (responseJson.videos.results[0].hasOwnProperty("key")) {
            this.setState({
              myId: id,
              title: responseJson.title,
              key: responseJson.videos.results[0].key,
              poster_path: responseJson.poster_path,
              isLoading: false,
            });
          }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onClick() {
    if (this.state.isOnline) {
      if (this.state.key != '')
        this.props.navigation.navigate('trailer', { key: this.state.key });
      else {
        Alert.alert(
          'Notification',
          'This film does not have official trailer',
          [
            { text: 'OK'}
          ]
        )
      }
    }
    else {
      this.alert();
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" style={styles.colorLoading} />
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Image style={[styles.image]}
              resizeMode={'contain'}
              source={{ uri: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + this.state.poster_path }} />
          </View>
          <View style={styles.viewButton}>
            <Button
              bsSize="lg"
              title="Trailer"
              color='green'
              onPress={this.onClick}
            />
            <Button
              bsSize="lg"
              title="Information"
              color='red'
              onPress={() => {
                this.state.isOnline ?
                  navigate('information', { id: this.state.myId, title: this.state.title }) :
                  this.alert()
              }}
            />
          </View>
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
    alignSelf: 'stretch',
    backgroundColor: '#000'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  colorLoading: {
    color: "#0000ff",
  },
  viewButton: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#000'
  },
  button: {
    width: 80,
    height: 30,
  },
  headerStyle: {
    backgroundColor: '#000',
    shadowOpacity: 0
  },
  headerTitleStyle: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    marginRight: 70,
    color: '#fefefe',
    fontFamily: 'MuseoSansRounded-300',
    fontWeight: '300'
  }
});

export default DetailScreen;