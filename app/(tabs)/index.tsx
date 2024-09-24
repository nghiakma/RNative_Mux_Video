import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Button,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Video from 'react-native-video'; // import Video from react-native-video like your normally would
import muxReactNativeVideo from '@mux/mux-data-react-native-video';
import app from '../../package.json'
// wrap the `Video` component with Mux functionality
const MuxVideo = muxReactNativeVideo(Video);
export default function HomeScreen() {
  const [showVideo, setShowVideo] = useState(false);
  const ref = React.useRef<any>(null);
  useEffect(() => {}, []);

  return (
    <MuxVideo
    style={styles.video}
    source={{
      uri:
        'https://stream.mux.com/ifRWicfvMydoTWkLeiyuMedxpnGah8vuPkB02PWql02eg.m3u8',
    }}
    controls
    muted
    muxOptions={{
      application_name: app.name,            // (required) the name of your application
      application_version: app.version,      // the version of your application (optional, but encouraged)
      data: {
        env_key: '8m01he8sfkme3cie3juold22i',     // (required)
        video_id: 'Kx76ruLcdU74dCOQAUp6TeecNsxcexL2YobW011pa5H00',             // (required)
        video_title: 'My awesome video',
        player_software_version: '5.0.2',     // (optional, but encouraged) the version of react-native-video that you are using
        player_name: 'React Native Player',  // See metadata docs for available metadata fields https://docs.mux.com/docs/web-integration-guide#section-5-add-metadata
      },
    }}
  />

  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  video: {
    width: 400,
    height: 500,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});